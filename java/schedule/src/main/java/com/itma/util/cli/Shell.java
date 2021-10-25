package com.itma.util.cli;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itma.util.collection.ArrayUtil;
import com.itma.util.io.BytesOutputStream;


public class Shell {

	static boolean DEBUG = false;

	private static final boolean isWindows;
	private static final boolean isLinux;
	private static final String cmd;
	private static final byte[] exit;
	private static final byte[] lf;
	static {
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") > -1) {
			isWindows = true;
			isLinux = false;
			cmd = "cmd";
			exit = "exit".getBytes();
			lf = new byte[] { '\r', '\n' };
		} else {
			isWindows = false;
			isLinux = true;
			cmd = "bash";
			exit = "exit".getBytes();
			lf = new byte[] { '\n' };
		}
	}
	private static final byte[] ECHO = "echo '#'".getBytes();

	private static Logger logger = LoggerFactory.getLogger(Shell.class);
	private final Executor executor;


	private Process console;
	private OutputStream cli;
	private OutputStream outlog = null;
	private DateFormat tfmt = new SimpleDateFormat ("HH:mm:ss");
	private byte prompt;
	private BytesOutputStream result = new BytesOutputStream();


	public static void main(String[] args) throws Exception {
		String ping;
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") > -1) {
			ping = "ping -n 6 ";
		} else {
			ping = "ping -c 6 ";
		}
		Shell shell = new Shell(Executors.newCachedThreadPool());
		shell.start();
//		System.out.println("--------------------------------------------");
//		System.out.println(shell.command(ping + "127.0.0.1", 15000L));
//		System.out.println("--------------------------------------------");
//		System.out.println(shell.command(ping + "1.1.1.1", 15000L));
		System.out.println("--------------------------------------------");
		System.out.println(shell.command(ping + "2.2.2.2", 15000L));
		System.out.println("--------------------------------------------");
		System.out.println(shell.command(ping + "3.3.3.3", 15000L));
		System.out.println("--------------------------------------------");
//		System.out.println(shell.command("./wmic -U administrator%Admin@open //10.240.81.86 \"select *        from Win32_Volume\"", 15000L));
//		System.out.println("--------------------------------------------");
//		System.out.println(shell.command("pwd", 15000L));
//		System.out.println("--------------------------------------------");
//		System.out.println(shell.command("env", 15000L));
//		System.out.println("--------------------------------------------");

		shell.close();
		System.exit(1);
	}

	public Shell(Executor executor) {
		this.executor = executor;
	}
	public void start() throws IOException, InterruptedException {
		if (isWindows) { start_windows(); }
		if (isLinux) { start_linux(); }
	}
	private void writeDebugFile() {
		if (!DEBUG) { return; }
		try {
			File file = new File("./log", "/shell/."+this.hashCode()+".log");
			file.getParentFile().mkdirs();
			outlog = new FileOutputStream(file, true);
			outlog.write(("\nvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv\n").getBytes());
			outlog.flush();
		} catch (Throwable ex) {
			logger.error("create logger file", ex);
		}
	}
	protected void start_windows() throws IOException, InterruptedException {
		synchronized (Shell.class) {
			boolean ok = false;
			try {
				console = Runtime.getRuntime().exec(cmd);

				writeDebugFile();
		        StreamGobbler err = new StreamGobbler(console.getErrorStream());
				executor.execute(err);
				StreamGobbler std = new StreamGobbler(console.getInputStream());
				executor.execute(std);

				cli = console.getOutputStream();
				cli.write(lf);
				cli.flush();

				ok = true;
			} finally {
				if (!ok) {
					close();
				}
			}
		}
		int len = 0;
		for (int i = 0; i < 10; i++) {
			synchronized (result) {
				try {
					result.wait(200L);
				} catch (InterruptedException ex) {
					logger.error("wait find prompt", ex);
				}
			}
			if (len > 0 && len == result.size()) { break; }
			len = result.size();
		}
		prompt = len > 0 ? result.getBytes()[len - 1] : (byte) '>';
	}
	protected void start_linux() throws IOException, InterruptedException {
		synchronized (Shell.class) {
			boolean ok = false;
			try {
				console = Runtime.getRuntime().exec(cmd);

				writeDebugFile();
		        StreamGobbler err = new StreamGobbler(console.getErrorStream());
				executor.execute(err);
				StreamGobbler std = new StreamGobbler(console.getInputStream());
				executor.execute(std);

				cli = console.getOutputStream();

				ok = true;
			} finally {
				if (!ok) {
					close();
				}
			}
		}
		prompt = '#';
	}

	public void close() throws IOException, InterruptedException {
		try {
			if (cli != null) {
				cli.write(exit);
				cli.write(lf);
				cli.flush();
			}
		} finally {
			cli = null;
			try {
				if (console != null) {
					try {
						console.waitFor(5, TimeUnit.SECONDS);
			        } finally {
			        	console.destroy();
			        }
				}
	        } finally {
	        	console = null;
				if (outlog != null) {
					try {
						outlog.write(("\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n").getBytes());
						outlog.flush();
						outlog.close();
					} catch (Throwable ex) {
						logger.error("close logger file", ex);
					}
				}
	        }
		}
	}

	public String command(String command, long timeout) throws IOException {
		if (cli == null) { throw new IOException("closed shell"); }
		if (outlog != null) {
			try {
				synchronized (outlog) {
					outlog.write('<');
					outlog.write(tfmt.format(new Date()).getBytes());
					outlog.write('|');
					outlog.write(String.valueOf(timeout).getBytes());
					outlog.write('|');
					outlog.write(command.getBytes());
					outlog.write('>');
				}
			} catch (Throwable ex) {
				logger.error("write debug log file", ex);
			}
		}
		if (isWindows) { return command_windows(command, timeout); }
		if (isLinux) { return command_linux(command, timeout); }
		throw new IOException("unknown os");
	}

	protected synchronized String command_windows(String command, long timeout) throws IOException {
		byte[] cbs = command.getBytes();

		result.reset();

		cli.write(cbs);
		cli.write(lf);
		cli.flush();

		int len = 0; // �?查到提示符号的位�?
		long mark = 0;
		while (cli != null) {
			synchronized (result) {
				try {
					result.wait(200L);
				} catch (InterruptedException ex) {
					logger.error("wait result data", ex);
				}
			}
			if (len == result.size()) {
				if (len > 0 && result.getBytes()[len -1] == prompt) {
					if (outlog != null) {
						try {
							synchronized (outlog) {
								outlog.write('<');
								outlog.write(tfmt.format(new Date()).getBytes());
								outlog.write('|');
								outlog.write(new byte[] { 'O', 'k', '>' });
							}
						} catch (Throwable ex) {
							logger.error("write debug log file", ex);
						}
					}
					break;
				} else if (mark == 0L) {
					mark = System.currentTimeMillis();
				} else if (System.currentTimeMillis() - mark > timeout) {
					if (outlog != null) {
						try {
							synchronized (outlog) {
								outlog.write('<');
								outlog.write(tfmt.format(new Date()).getBytes());
								outlog.write('|');
								outlog.write(new byte[] { 'T', 'i', 'm', 'e', 'o', 'u', 't', '>' });
							}
						} catch (Throwable ex) {
							logger.error("write debug log file", ex);
						}
					}
					len = 0;
					break;
				}
			} else {
				mark = 0L;
			}
			len = result.size();
		}
		if (len > 0) {
			int i = ArrayUtil.lastIndexOf(result.getBytes(), 0, len, lf);
			if (i > 0) { len = i; }
		} else {
			len = result.size();
		}
		int begin = 0;
		if (ArrayUtil.startsWith(result.getBytes(), 0, cbs)) {
			if (ArrayUtil.startsWith(result.getBytes(), cbs.length, lf)) {
				begin = cbs.length + lf.length;
			}
		}
		return resultString(begin, len);
	}
	protected synchronized String command_linux(String command, long timeout) throws IOException {
		result.reset();

		cli.write(command.getBytes());
		cli.write(lf);
		cli.flush();

		boolean echo = false;
		int len = 0; // �?查到提示符号的位�?
		long mark = 0;
		while (cli != null) {
			synchronized (result) {
				try {
					result.wait(200L);
				} catch (InterruptedException ex) {
					logger.error("wait result data", ex);
				}
			}
			if (len == result.size()) {
				if (len > 2 && result.getBytes()[len -3] == '\n' && result.getBytes()[len -2] == prompt && result.getBytes()[len -1] == '\n') {
					if (outlog != null) {
						try {
							synchronized (outlog) {
								outlog.write(new byte[] { '<', 'O', 'k', '>' });
							}
						} catch (Throwable ex) {
							logger.error("write debug log file", ex);
						}
					}
					len -= 2;
					break;
				} else if (mark == 0L) {
					mark = System.currentTimeMillis();
				} else if (System.currentTimeMillis() - mark > timeout) {
					if (outlog != null) {
						try {
							synchronized (outlog) {
								outlog.write(new byte[] { '<', 'T', 'i', 'm', 'e', 'o', 'u', 't', '>' });
							}
						} catch (Throwable ex) {
							logger.error("write debug log file", ex);
						}
					}
					len = 0;
					break;
				} else if (System.currentTimeMillis() - mark > 500L && !echo) {
					if (outlog != null) {
						try {
							synchronized (outlog) {
								outlog.write(new byte[] { '<', '#', '>' });
							}
						} catch (Throwable ex) {
							logger.error("write debug log file", ex);
						}
					}
					echo = true;
					cli.write(ECHO);
					cli.write(lf);
					cli.flush();
				}
			} else {
				mark = 0L;
			}
			len = result.size();
		}
		if (len == 0) { len = result.size(); }
		if (len > 0 && result.getBytes()[len -1] == '\n') {
			len --;
		}
		return resultString(0, len);
	}
	protected String resultString(int begin, int end) throws UnsupportedEncodingException {
		String s = result.toString(begin, end, "UTF-8");
        if (s.getBytes("UTF-8").length == end - begin) {
        	return s;
        }
        s = result.toString(begin, end, "GBK");
        if (s.getBytes("GBK").length == end - begin) {
        	return s;
        }
        return result.toString(begin, end);
	}

	private class StreamGobbler implements Runnable {
		private InputStream input;

		public StreamGobbler(InputStream input) {
			this.input = input;
		}
		@Override
		public void run() {
			byte[] buf = new byte[1024];
			try {
				int avail = input.read(buf);
				while (console != null && avail >= 0) {
					if (avail > 0) {
						synchronized (result) {
							result.write(buf, 0, avail);
							result.notifyAll();
						}
						if (outlog != null) {
							try {
								synchronized (outlog) {
									outlog.write(buf, 0, avail);
								}
							} catch (Throwable ex) {
								logger.error("write debug log file", ex);
							}
						}
					}
					avail = input.read(buf);
				}
			} catch (Throwable ex) {
				logger.error("gobbler stream", ex);
			}
		}
	}
}
