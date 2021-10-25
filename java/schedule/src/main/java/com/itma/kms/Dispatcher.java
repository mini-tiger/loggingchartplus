package com.itma.kms;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.itma.kms.pojo.Depth;
import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Section;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;
import com.itma.util.db.MongoDBDriver;

/**
 * 
cd /opt/kms
java -cp .:mongo-java-driver-3.0.4.jar:slf4j-api-1.7.26.jar:fastjson-1.1.38.jar com.itma.kms.Dispatcher
 *
 */
public class Dispatcher {

	private Logger logger = LoggerFactory.getLogger(Transform.class);
	private Executor executor = Executors.newCachedThreadPool();

	private MongoDBDriver driver;
	private Transform transform;
	
	private PredictCfg predictCfg = new PredictCfg();
	
	//jar spark
	private String method;
	private Draw draw;
	
	private boolean debug = false;

	//记录是否有web过来的任务在执行
	AtomicInteger webCounter = new AtomicInteger(0);
	
	public static void main(String[] args) throws Exception {
		String cfg = "./config.json";
		String mode = "production";
		//轮询间隔时间秒
    	int interval = 30;
    	String method = "jar";
    	boolean debug = false;
    	//spark模式用;标记执行spark命令的工作目录
    	String workp = "/opt/predict";
    	//jar模式用;模型目录
    	String modelp = "./model/";
    	//jar模式用;class临时目录
    	String classp = "./temp/";
    	//jar模式用;采用几个现场进行数据预测
    	int threads = 5;

    	for (int i = 0; i < args.length; i++) {
	       	if (args[i].equalsIgnoreCase("-cfg")) {
	       		if (++i < args.length) {
	       			cfg = args[i];
	       		}
	      	} else if (args[i].equalsIgnoreCase("-dev")) {
	      		mode = "development";
	      	} else if (args[i].equalsIgnoreCase("-i")) {
	       		if (++i < args.length) {
	       			interval = Integer.parseInt(args[i]);
	       		}
	      	} else if (args[i].equalsIgnoreCase("-m")) {
	       		if (++i < args.length) {
	       			method = args[i];
	       		}
	      	} else if (args[i].equalsIgnoreCase("-t")) {
	      		debug = true;
	      	} else if (args[i].equalsIgnoreCase("-workp")) {
	       		if (++i < args.length) {
	       			workp = args[i];
	       		}
	      	} else if (args[i].equalsIgnoreCase("-modelp")) {
	       		if (++i < args.length) {
	       			modelp = args[i];
	       		}
	      	} else if (args[i].equalsIgnoreCase("-classp")) {
	       		if (++i < args.length) {
	       			classp = args[i];
	       		}
	       	} else if (args[i].equalsIgnoreCase("-threads")) {
	       		if (++i < args.length) {
	       			threads = Integer.parseInt(args[i]);
	       		}
	       	}
		}
    	
    	String text = readFile(new File(cfg));
    	if (text == null) {
    		System.err.println("Not found cfg:'"+cfg+"'");
    		System.exit(-1);
    	}
    	JSONObject config = null;
    	try {
    		config = JSON.parseObject(text).getJSONObject(mode);
    	} catch (Exception ex) {
    		ex.printStackTrace(System.err);
    	}
    	if (config == null) {
    		System.err.println("Not found "+mode+" at cfg:'"+cfg+"'");
    		System.exit(-2);
    	}
    	JSONObject MONGODB = config.getJSONObject("MONGODB");
    	if (MONGODB == null) {
    		System.err.println("Not found MongoDB config for "+mode+" at cfg:'"+cfg+"'");
    		System.exit(-3);
    	}
		Properties mongodb = new Properties();
		{
			mongodb.setProperty("address", MONGODB.getString("address"));
			mongodb.setProperty("port", MONGODB.getString("port"));
			mongodb.setProperty("username", MONGODB.getString("username"));
			mongodb.setProperty("password", MONGODB.getString("password"));
			mongodb.setProperty("database", MONGODB.getString("database"));
		}
    	
    	final Dispatcher dispatcher = new Dispatcher(mongodb);
    	dispatcher.debug = debug;
    	if (method != null && method.equalsIgnoreCase("spark")) {
        	File fworkp = new File(workp);
        	if (!fworkp.exists() || !fworkp.isDirectory()) {
        		System.out.println("workp not exist:"+workp);
        		System.exit(-2);
        	}
    		dispatcher.method = "spark";
        	Spark spark = new Spark(dispatcher, fworkp);
        	dispatcher.draw = spark;
    	} else {
        	File fmodelp = new File(modelp);
        	File gmodelp = new File("../../model");
        	if ((!fmodelp.exists() || !fmodelp.isDirectory()) && (!gmodelp.exists() || !gmodelp.isDirectory())) {
        		System.out.println("modelp not exist:"+modelp+"/t"+gmodelp);
        		System.exit(-2);
        	}
        	File fclassp = new File(classp);
        	if (fclassp.exists() && !fclassp.isDirectory()) {
        		System.out.println("fclassp error:"+classp);
        		System.exit(-2);
        	}
    		dispatcher.method = "jar";
    		MaximAI ai = new MaximAI(dispatcher, fmodelp, fclassp);
    		ai.setThreads(threads);
    		dispatcher.draw = ai;
    	}
    	
    	JSONObject PREDICT = config.getJSONObject("PREDICT");
    	if (PREDICT != null) {
    		if (PREDICT.containsKey("restrict")) {
    			dispatcher.predictCfg.setRestrict(PREDICT.getBooleanValue("restrict"));
    		}
    		if (PREDICT.containsKey("suffix")) {
    			dispatcher.predictCfg.setSuffix(PREDICT.getString("suffix"));
    		}
    	}
    	
    	dispatcher.start();
    	
    	StringBuilder env = new StringBuilder();
    	if (dispatcher.method.equals("spark")) {
    		env.append("Spark");
    	} else {
    		env.append("MaximAI");
    	}
    	if (dispatcher.debug) {
    		env.append("调试模式");
    	}
    	if (interval > 0) {
    		env.append("间隔时间:").append(interval).append("秒");
    		dispatcher.logger.error(env.toString());
    		System.out.println(env);
        	Timer timer = new Timer("Dispatcher", true);
        	timer.schedule(new TimerTask() {
				@Override
				public void run() {
					if (dispatcher.webCounter.get() > 0) {
						dispatcher.logger.error("has web task, not work");
					} else {
						try {
							dispatcher.work();
						} catch (Throwable ex) {
							dispatcher.logger.error("work", ex);
							ex.printStackTrace();
						}
					}
				}}, interval * 1000L, interval * 1000L);
        	
        	JSONObject WEB = config.getJSONObject("WEB");
        	if (WEB != null && WEB.containsKey("enabled") && WEB.getBooleanValue("enabled")) {
        		WebServer wsvr = new WebServer(dispatcher);
        		int port = 3333;
        		if (WEB.containsKey("port")) {
        			port = Integer.parseInt(WEB.get("port").toString());
        		}
        		String context = "/";
        		if (WEB.containsKey("context")) {
        			context = WEB.get("context").toString();
        		}
        		dispatcher.logger.error("Start web server port:"+port+" context:"+context);
        		wsvr.start(port, context);
        	}
    	} else {
    		dispatcher.logger.error(env.toString());
    		System.out.println(env);
            try {
            	//TODO 测试
            	//dispatcher.spark("model_5_deeplearning_278_20200508_142238.jar", "/opt/predict/data2", "/opt/predict/output2", "age,y");
            	//TODO 测试
            	//dispatcher.result(new File("D:\\Project4Itma\\eclipse\\workspace\\kms\\output\\0\\"));
            	dispatcher.work();
            } catch (Throwable ex) {
            	dispatcher.logger.error("work", ex);
            	ex.printStackTrace();
            } finally {
            	dispatcher.close();
                System.exit(0);
            }
    	}
	}

	

	public Dispatcher(Properties context) {
		driver = new MongoDBDriver(context);
		transform = new Transform(driver);
	}
	public void start() {
    	logger.info("driver.connect");
    	driver.connect();
    	logger.info("driver.connect ok");
	}
	public void close() {
		logger.info("driver.connect");
    	driver.close();
    	logger.info("driver.connect ok");
	}

	public List<TaskResult> work(String taskId, StringBuilder log, boolean update, boolean check) throws Exception {
		Task task = transform.getTask(taskId);
		if (task == null) {
			log.append("Not found task["+taskId+"]");
			return null;
		}
		logger.info("task:{}; qxwjm size:{}", task.getTitle(), task.getQxwjms().size());
		if (update) {
			//修改任务状态到2
			transform.readyWork(task.getTaskID());
		}
		List<TaskResult> results = new ArrayList<>(task.getQxwjms().size());
		List<DrawWorker> workers = new ArrayList<>(task.getQxwjms().size());
		try {
	    	long time = System.currentTimeMillis();
			if (!task.getQxwjms().isEmpty()) {
		    	Object ctx = draw.taskBegin(task, log);
		    	if (ctx == null) {
    				logger.error("task {} work init false", task);
    				logger.error(String.valueOf(log));
    			} else {
			    	try {
				    	CountDownLatch latch = new CountDownLatch(task.getQxwjms().size());
						int index = 0;
			    		for (Qxwjm qxwjm : task.getQxwjms()) {
			    			qxwjm.setIndex(index++);
			    			DrawWorker worker = new DrawWorker(latch, ctx, qxwjm, check);
			            	workers.add(worker);
			            	executor.execute(worker);
			    		}
			            try {
			    			latch.await();
			    		} catch (InterruptedException e) {
			    			logger.error("latch await", e);
			    		}
			    	} finally {
			    		draw.taskEnd(task, ctx, log);
			    	}
    			}
			}
            time = System.currentTimeMillis() - time;
            
            for (DrawWorker w : workers) {
        		results.add(w.getResult());
            	log.append(w.getLog());
            }
		} finally {
			if (update) {
				//修改任务状态到3
				transform.workEnd(task.getTaskID());
			}
		}
		return results;
	}
	class DrawWorker implements Runnable {
		CountDownLatch latch;
		Object ctx;
		Qxwjm qxwjm;
		boolean check;
		TaskResult result;
		StringBuilder log = new StringBuilder();
		
		DrawWorker(CountDownLatch latch, Object ctx, Qxwjm qxwjm, boolean check) {
			this.latch = latch;
			this.ctx = ctx;
			this.qxwjm = qxwjm;
			this.check = check;
		}
		@Override
		public void run() {
			logger.info("qxwjm:{}", qxwjm);
			try {
				if (check) {
					result = transform.getResult(qxwjm);
				}
				if (result == null) {
					result = draw.draw(qxwjm, ctx, log);
				} else {
					log.append("load history data:").append(qxwjm).append("\n");
				}
				if (result == null) {
					result = new TaskResult(qxwjm);
					result.error("null");
				}
			} catch (Throwable ex) {
				logger.error("draw", ex);
				result = new TaskResult(qxwjm);
				result.error(ex.getMessage());
			} finally {
				latch.countDown();
			}
		}
		public TaskResult getResult() {
			return result;
		}
		public StringBuilder getLog() {
			return log;
		}
	}
	public TaskResult work(Qxwjm qxwjm, StringBuilder log) throws Exception {
		logger.info("qxwjm:{}", qxwjm);
		Task task = qxwjm.getTask();
		if (task == null) { task = new Task(qxwjm); }
		Object ctx = draw.taskBegin(task, log);
		if (ctx == null) {
			logger.error("qxwjm {} work init false", qxwjm);
			logger.error(String.valueOf(log));
			return null;
		}
		try {
			return draw.draw(qxwjm, ctx, log);
		} finally {
			draw.taskEnd(task, ctx, log);
		}
	}
	public void work() throws IOException, InterruptedException {
		logger.info("work begin");
		//查询状态为1,2的任务
    	List<Task> tasks = new ArrayList<>(transform.loadQxwjm(!debug));
    	logger.info("need work task size:{}", tasks.size());
    	if (tasks.isEmpty()) { return; }
    	int index = 0;
    	StringBuilder log = new StringBuilder();
    	for (Task task : tasks) {
    		logger.info("task:{}; qxwjm size:{}", task.getTitle(), task.getQxwjms().size());
    		if (!debug) {
    			//修改任务状态到2
    			transform.readyWork(task.getTaskID());
    		}
    		Object ctx = null;
    		try {
    			ctx = draw.taskBegin(task, log);
		    	if (ctx == null) {
    				logger.error("task {} work init false", task);
    				logger.error(String.valueOf(log));
    			} else {
		    		for (Qxwjm qxwjm : task.getQxwjms()) {
		    			qxwjm.setIndex(index++);
		        		logger.info("qxwjm:{}", qxwjm);
		    			try {
		    				TaskResult rs = draw.draw(qxwjm, ctx, log);
		    				if (debug && rs != null && rs.getDataAll() != null) {
		    					rs.toDataCsv(predictCfg, qxwjm, "./logs/"+qxwjm.getJh()+"/"+qxwjm.getQxwjm()+".csv");
		    					rs.toSectionCsv(qxwjm, "./logs/"+qxwjm.getJh()+"/"+qxwjm.getQxwjm()+".section.csv");
		    				}
		    			} catch (Exception ex) {
		    				logger.error("draw", ex);
		    			}
		    		}
    			}
    		} catch (Exception ex) {
    			logger.error("task", ex);
    		} finally {
    			draw.taskEnd(task, ctx, log);
        		if (!debug) {
        			//修改任务状态到3
        			transform.workEnd(task.getTaskID());
        		}
    		}
    	}
    	logger.error(log.toString());
	}
 
	/**
	 * 计算区间
	 */
	public List<Section> section(Qxwjm qxwjm, List<Depth> list) {
		List<Section> data = new LinkedList<Section>();
		Iterator<Depth> iter = list.iterator();
		Depth doc = iter.hasNext() ? iter.next() : null;
		Depth next = null;
		long predict;
		long marker = doc == null ? 0L : Math.round(doc.getPredict());
		while (iter.hasNext()) {
			next = iter.next();
			predict = Math.round((Double) next.getPredict());
			
			if (marker == predict) { continue; }
			//如果深度与标定值不一致,增加一个区间
			Section s = new Section(qxwjm);
			s.setPredict(marker);
			s.setBeginDepth(doc.getDepth());
			s.setEndDepth(next.getDepth());
			data.add(s);

			doc = next;
			marker = predict;
		}
		if (next != null && doc != next) {
			Section s = new Section(qxwjm);
			s.setPredict(marker);
			s.setBeginDepth(doc.getDepth());
			s.setEndDepth(next.getDepth());
			data.add(s);
		}
		return data;
	}

	public Transform getTransform() {
		return transform;
	}
	public PredictCfg getPredictCfg() {
		return predictCfg;
	}


	public static final String readFile(File file) throws IOException {
        if (file == null || !file.exists()) { return null; }
        InputStream doc = new FileInputStream(file);
        try {
            byte[] bs = new byte[doc.available()];
            int index = doc.read(bs, 0, bs.length);
            while (index < bs.length && index != -1) {
                index += doc.read(bs, index, bs.length - index);
            }
            return new String(bs, "UTF-8");
        } finally {
            doc.close();
        }
    }
}

