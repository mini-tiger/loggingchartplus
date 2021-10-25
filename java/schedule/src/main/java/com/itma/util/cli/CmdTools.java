package com.itma.util.cli;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CmdTools implements Runnable {
	
	/**
	 * 日志对象
	 */
	protected Logger logger = LoggerFactory.getLogger(getClass());
	public static enum RejectedPolicy {
		Forever,
		Wait,
		Abort
	}
	public static RejectedPolicy Forever = RejectedPolicy.Forever;
	public static RejectedPolicy Wait = RejectedPolicy.Wait;
	public static RejectedPolicy Abort = RejectedPolicy.Abort;
	
	//Shell模式(true) Cmd模式(false)
	private final boolean shellMode;
	
	private int corePoolSize;
	private int maximumPoolSize;
	private long keepAliveTime;
	private RejectedPolicy policy = Forever;
	
	private boolean closed = false;
	private final AtomicInteger count = new AtomicInteger(0);
	private final Object checking = new Object();
	private final Map<Shell, Worker> work = new ConcurrentHashMap<Shell, Worker>();
	private final BlockingQueue<Worker> free = new LinkedBlockingQueue<Worker>();
	
	private Executor executor;
	private final Map<String, String> threads = new ConcurrentHashMap<String, String>();

	public static void main(String[] args) throws Exception {
		final String ping;
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") > -1) {
			ping = "ping -n 3 ";
		} else {
			ping = "ping -c 3 ";
		}
		int size = 255;
		final CountDownLatch latch = new CountDownLatch(size);
		final CmdTools tools = new CmdTools(5, 10, 60000L, Forever,
				Executors.newCachedThreadPool());
		for (int i = size; i > 0; i--) {
			final int index = i;
			new Thread("("+index+")") {
				@Override public void run() {
					try {
						System.out.println(Thread.currentThread().getName()+"-127.0.0."+index);
						tools.command(ping + "127.0.0."+index, 15000L);
						System.out.println(Thread.currentThread().getName()+"-1.1.1."+index);
						tools.command(ping + "1.1.1."+index, 15000L);
						System.out.println(Thread.currentThread().getName()+"-2.2.2."+index);
						tools.command(ping + "2.2.2."+index, 15000L);
						System.out.println(Thread.currentThread().getName()+"-3.3.3."+index);
						tools.command(ping + "3.3.3."+index, 15000L);
						System.out.println(Thread.currentThread().getName()+"-end");
					} catch (Throwable ex) {
						ex.printStackTrace();
					} finally {
						latch.countDown();
					}
				}
			}.start();
		}
		latch.await();
		System.exit(0); 
	}
	
	/**
	 * Shell模式
	 */
	public CmdTools(int corePoolSize, int maximumPoolSize, long keepAliveTime, RejectedPolicy policy, Executor executor) {
		this.shellMode = true;
		
		this.corePoolSize = corePoolSize;
		this.maximumPoolSize = maximumPoolSize;
		this.keepAliveTime = keepAliveTime;
		this.policy = policy;
		this.executor = executor;

		executor.execute(this);
	}
	/**
	 * Cmd模式
	 */
	public CmdTools(Executor executor) {
		this.shellMode = false;
		
		this.executor = executor;
	}
	
	public void close() {
		closed = true;
		synchronized (checking) {
			checking.notifyAll();
		}
	}
	
	public Map<String, String> getThreads() { return threads; }

	private Shell getShell() throws IOException, InterruptedException {
		if (closed) { throw new IllegalStateException("CmdPool is closed"); }
		Worker w = free.poll();
		if (w != null) {
			work.put(w.shell, w);
			return w.shell;
		}
		if (count.get() < maximumPoolSize) {
			synchronized (this) {
				if (count.get() < maximumPoolSize) {
					w = new Worker(executor);
					w.shell.start();
					work.put(w.shell, w);
					count.incrementAndGet();
					return w.shell;
				}
			}
		}
		if (policy == Forever) {
			w = free.take();
		} else if (policy == Wait) {
			w = free.poll(keepAliveTime, TimeUnit.MILLISECONDS);
		} else {
			w = free.poll();
		}
		if (w == null) { return null; }
		
		work.put(w.shell, w);
		return w.shell;
	}
	private void returnShell(Shell s) throws IOException, InterruptedException {
		if (s == null) { return; }
		Worker w = work.remove(s);
		if (w == null) {
			s.close();
			return;
		}
		w.lastTime = System.currentTimeMillis();
		free.add(w);
	}
	@Override
	public void run() {
		Worker w;
		while (!closed) {
			if (count.get() <= corePoolSize || free.isEmpty()) {
				synchronized (checking) {
					try {
						checking.wait(keepAliveTime);
					} catch (InterruptedException ex) {
						logger.error("wait free shell", ex);
					}
				}
				continue;
			}
			w = free.poll();
			if (w == null) {
				synchronized (checking) {
					try {
						checking.wait(keepAliveTime);
					} catch (InterruptedException ex) {
						logger.error("wait free shell", ex);
					}
				}
				continue;
			}
			long interval = w.lastTime + keepAliveTime - System.currentTimeMillis();
			if (interval > 0L) {
				free.add(w);
				synchronized (checking) {
					try {
						checking.wait(interval);
					} catch (InterruptedException ex) {
						logger.error("wait free shell", ex);
					}
				}
				continue;
			}
			count.decrementAndGet();
			try {
				w.shell.close();
			} catch (Exception ex) {
				logger.error("close free shell", ex);
			}
		}
	}
	
	
	public String command(String command, long timeout) throws IOException, InterruptedException {
		if (shellMode) {
			return shell(command, timeout);
		} else {
			return cmd(command, null, null, timeout);
		}
	}
	public String command(String command, String[] envp, File dir, long timeout) throws IOException, InterruptedException {
		if (shellMode) {
			throw new IOException("ShellMode not support env & dir");
		} else {
			return cmd(command, envp, dir, timeout);
		}
	}
	private String shell(String command, long timeout) throws IOException, InterruptedException {
		threads.put(Thread.currentThread().getName(), command);
		try {
			Shell shell = getShell();
			if (shell == null) { throw new IOException("Not more cmd shell"); }
			try {
				return shell.command(command, timeout);
			} finally {
				returnShell(shell);
			}
		} finally {
			threads.remove(Thread.currentThread().getName());	
		}
	}
	private String cmd(String command, String[] envp, File dir, long timeout) throws IOException, InterruptedException {
		threads.put(Thread.currentThread().getName(), command);
		ByteArrayOutputStream data;
		try {
			Process process = Runtime.getRuntime().exec(command, envp, dir);
	
        	OutputStream out = process.getOutputStream();
        	out.write(13);
        	out.flush();
	
	        data = new ByteArrayOutputStream();
	
	        StreamGobbler err = new StreamGobbler(process.getErrorStream(), data);
			executor.execute(err);			
			StreamGobbler std = new StreamGobbler(process.getInputStream(), data);
			executor.execute(std);
			
	        try {
	        	process.waitFor(timeout, TimeUnit.MILLISECONDS);
	        } finally {
	    		process.destroy();
	        }
		} finally {
			threads.remove(Thread.currentThread().getName());
		}
        String s = data.toString("UTF-8");
        if (s.getBytes("UTF-8").length == data.size()) {
        	return s;
        }
        s = data.toString("GBK");
        if (s.getBytes("GBK").length == data.size()) {
        	return s;
        }
        return data.toString();
	}


	private static class Worker {
		final Shell shell;
		long lastTime = System.currentTimeMillis();
		
		public Worker(Executor executor) {
			this.shell = new Shell(executor);
		}
	}
	private class StreamGobbler implements Runnable {		
		private InputStream input;
		private OutputStream output;
		public StreamGobbler(InputStream input, OutputStream output) {
			this.input = input;
			this.output = output;
		}
		@Override
		public void run() {
			byte[] buf = new byte[1024];
			try {
				int avail = input.read(buf);
				while (avail >= 0) {
					if (avail > 0) {
						synchronized (output) {
							output.write(buf, 0, avail);
						}
						System.out.print(new String(buf, 0, avail));
					}
					avail = input.read(buf);
				}
			} catch (Exception ex) {
				logger.error("gobbler stream", ex);
			}
		}
	}

}
