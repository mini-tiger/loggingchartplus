package com.itma.kms;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beagledata.modelpredict.utils.FileOperateUtil;
import com.beagledata.modelpredict.utils.ModelClassLoader;
import com.bigdata.bdtm.IModelPredict;
import com.bigdata.bdtm.ModelPredictFactroy;
import com.bigdata.bdtm.exceptions.ModelPredictException;
import com.itma.kms.pojo.Depth;
import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Section;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;

public class MaximAI implements Draw {

	public static void main(String[] args) throws IOException, ModelPredictException {
		// MaximAI jar 模型
		MaximAI ai = new MaximAI(null,
				new File("D:/Project4Itma/loggingchart/java/schedule/model/"),
				new File("D:/Project4Itma/loggingchart/java/schedule/temp/"));
		
		IModelPredict predict = ai.brain("model_3_drf_120_20200215_115252.jar");		
		//File csv = new File("D:/Project4Itma/loggingchart/java/schedule/input/test-age.csv");
		//List<String> header = Arrays.asList("y,age,job,housing,contact,day,month,duration,pdays,previous,poutcome".split(","));
		File csv = new File("D:/Project4Itma/loggingchart/java/schedule/input/3/data.csv");
		List<String> header = Arrays.asList("_id	GR	SP	LLD	LLS	MSFL	RHOB	DT	NPHI	SH	POR	DEPTH".split("\t"));
		BufferedReader reader = new BufferedReader(new FileReader(csv));
		try {
			ai.ai(predict, 5, header, reader);
		} finally {
			reader.close();
		}
		System.exit(0);
	}


	private Logger logger = LoggerFactory.getLogger(MaximAI.class);
	private Executor executor = Executors.newCachedThreadPool();
	//模型存放目录
	private File modelp = new File("./model/");
	//jar解压缓存目录
	private File classp = new File("./temp/");
	
	private Dispatcher dispatcher;
	private Transform transform;
	//采用几个线程进行数据分析
	private int threads = 5;
	
	public MaximAI(Dispatcher dispatcher, File modelp, File classp) {
		this.dispatcher = dispatcher;
		this.modelp = modelp;
		this.classp = classp;
		
		this.transform = dispatcher == null ? null : dispatcher.getTransform();
	}
	public int getThreads() {
		return threads;
	}
	public void setThreads(int threads) {
		logger.error("MaximAI threads:{}", threads);
		this.threads = threads;
	}


	@Override
	public IModelPredict taskBegin(Task task, StringBuilder log) {
		IModelPredict predict = brain(task.getModel());
		if (predict == null) {
			logger.error("not found predict {}",task.getModel());
			log.append("not found predict ").append(task.getModel()).append('\n');
			return null;
		}
		return predict;
	}
	@Override
	public void taskEnd(Task task, Object ctx, StringBuilder log) {
	}
	@Override
	public TaskResult draw(Qxwjm qxwjm, Object ctx, StringBuilder log) throws Exception {
		IModelPredict predict = (IModelPredict) ctx;
		TaskResult rs = new TaskResult(qxwjm);
		log.append(qxwjm).append('\n');
		if (predict == null) {
			logger.error("not found predict {}",qxwjm.getModel());
			rs.error("not found predict "+qxwjm.getModel());
			return rs;
		}
		
		long time = System.currentTimeMillis();
    	List<JSONArray> pool = new ArrayList<>(threads);
    	List<JSONArray> spool = new ArrayList<>(threads);
    	for (int i = 0; i < threads; i++) {
    		pool.add(new JSONArray());
    		spool.add(new JSONArray());
    	}
    	int size = transform.doc2json(qxwjm.getHeader(), qxwjm.getJh(), qxwjm.getQxwjm(), pool, qxwjm.getOutput(), spool);
		time = System.currentTimeMillis() - time;
		logger.warn("mongo data[{}] time:{}s",size,(time/1000L));
		log.append("mongo data["+size+"] time:"+(time/1000L)+"s").append("\n");
		if (size == 0) { rs.error("未查询到测井数据"); return rs; }
		
		time = System.currentTimeMillis();
		List<Iterator<?>> result = ai(predict, size, pool);
		time = System.currentTimeMillis() - time;
		logger.warn("MaximAI data[{}] time:{}s",size,(time/1000L));
		log.append("MaximAI data["+size+"] time:"+(time/1000L)+"s").append("\n");
		
		time = System.currentTimeMillis();
        List<Iterator<?>> pooli = new ArrayList<>(pool.size());
        for (JSONArray array : pool) {
        	pooli.add(array.iterator());
        }
        List<Iterator<?>> spooli = new ArrayList<>(spool.size());
        for (JSONArray array : spool) {
        	spooli.add(array.iterator());
        }
		boolean ok = result(rs, qxwjm, size, result, pooli, spooli);
		if (ok) {
			rs.success("执行成功");
			transform.saveResult(dispatcher.getPredictCfg(), rs);
		} else {
			rs.error("执行失败");
		}
		time = System.currentTimeMillis() - time;
		logger.warn("result data[{}] section[{}] time:{}s",rs.getDataAll().size(),rs.getSectionData().size(), (time/1000L));
		log.append("result data["+rs.getDataAll().size()+"] section["+rs.getSectionData().size()+"] time:"+(time/1000L)+"s").append("\n");

		return rs;
	}

	private static File findJar(File dir, String jar) {
		for (File f : dir.listFiles()) {
			if (f.isDirectory()) {
				f = findJar(f, jar);
				if (f != null) { return f; }
			} else if (f.isFile() && f.getName().endsWith(jar)) {
				String c = f.getName();
				c = c.substring(0, c.length() - jar.length());
				if (c.isEmpty()) { return f; }
				if (c.startsWith("(") && c.endsWith(")")) { return f; }
			}
		}
		return null;
	}
	IModelPredict brain(String modelname) {
		String name = modelname.substring(0, modelname.length() - 4);
		File jarsourcepath = new File(modelp, modelname);
		if (!jarsourcepath.exists()) {
			//不存在,在loggingchart/model目录里面找
			File file = new File("../../model");
			if (file.exists() && file.isDirectory()) {
				file = findJar(file, modelname);
			} else {
				file = null;
			}
			jarsourcepath = file;
		}
		if (jarsourcepath == null || !jarsourcepath.exists()) {
			logger.error("Not found file '"+modelname+"' at ../model & ../../model");
			return null;
		}
		File jarpath = new File(classp, name);
		Class<?> modelClass = null;
		synchronized (this) {
			try {
				FileOperateUtil.unZipFiles(jarsourcepath.getPath(), jarpath.getPath());
				ModelClassLoader mcl = new ModelClassLoader(jarpath.getPath(), this.getClass().getClassLoader());
				modelClass = mcl.loadClass(name);
			} catch (Exception ex) {
				logger.error("load IModelPredict", ex);
				return null;
			}
		}
		try {
			return ModelPredictFactroy.getModelPredict(modelClass);
		} catch (ModelPredictException ex) {
			logger.error("build IModelPredict", ex);
			return null;
		}
	}
	
	List<Iterator<?>> ai(IModelPredict ai, int size, List<JSONArray> pool) throws ModelPredictException, IOException {    	
    	List<Worker> workers = new ArrayList<>(pool.size());
    	CountDownLatch latch = new CountDownLatch(pool.size());
    	long time = System.currentTimeMillis();
        for (int i = 0; i < pool.size(); i++) {
        	Worker worker = new Worker(latch, ai, i, pool.get(i));
        	workers.add(worker);
        	executor.execute(worker);
        }
        try {
			latch.await();
		} catch (Exception ex) {
			logger.error("wait all work thread", ex);
		}
        time = System.currentTimeMillis() - time;
        
        List<Iterator<?>> result = new ArrayList<>(pool.size());
        for (Worker w : workers) {
        	if (w.getOutput() == null) {
        		result.add(Collections.emptyIterator());
        	} else {
        		result.add(w.getOutput().iterator());
        	}
        }
        return result;
	}
	boolean result(TaskResult tr, Qxwjm qxwjm, int size, List<Iterator<?>> result, List<Iterator<?>> pool, List<Iterator<?>> spool) throws IOException { 
		List<Depth> list = new LinkedList<Depth>();
		Iterator<?> iter;
		Iterator<?> siter;
		boolean hasNan = false;
		for (int i = 0; i < size; i++) {
        	Depth doc = new Depth();
        	if (spool != null) {
        		siter = spool.get(i % spool.size());
            	if (siter.hasNext()) {
            		JSONObject obj = (JSONObject) siter.next();
            		for (Map.Entry<String, Object> e : obj.entrySet()) {
            			doc.addData(e.getKey(), parseDouble(e.getValue().toString()));
            		}
            	}
        	}
        	iter = pool.get(i % pool.size());
        	if (iter.hasNext()) {
        		JSONObject obj = (JSONObject) iter.next();
        		doc.setId(obj.getString("_id"));
        		hasNan = false;
        		for (String h : qxwjm.getHeader()) {
        			doc.addData(h, parseDouble(obj.getString(h)));
        			if (Double.isNaN(doc.getData(h))) { hasNan = true; }
        		}
        		doc.setDepth(parseDouble(obj.getString("DEPTH")));
        		if (Double.isNaN(doc.getDepth())) { hasNan = true; }
        		if (hasNan) {
        			logger.error("result error data:{}", obj);
        		}
        	} else {
        		continue;
        	}
        	iter = result.get(i % result.size());
        	if (iter.hasNext()) {
        		JSONObject obj = (JSONObject) iter.next();
        		String predict = obj.getString("predict");
        		if (predict != null && predict.startsWith("<0x") && predict.endsWith(">") && obj.containsKey(predict)) {
        			logger.info("guess format predict data:{}", obj);
        			predict = obj.getString(predict);
        		}
        		doc.setPredict(qxwjm.getOutput(), parseDouble(predict));
        		if (Double.isNaN(doc.getPredict())) {
        			logger.error("predict error data:{}", obj);
        		}
        	} else {
        		continue;
        	}
    		
        	list.add(doc);
        }
		//System.out.println(list);
		List<Section> data = dispatcher.section(qxwjm, list);
		//System.out.println(data);
		
		tr.setDataAll(list);
		tr.setSectionData(data);
		tr.setTimeEnd(new Date());
		
		return true;
	}
	
	public void ai(IModelPredict ai, int threads, List<String> header, BufferedReader reader) throws ModelPredictException, IOException {
    	List<JSONArray> pool = new ArrayList<>(threads);
    	for (int i = 0; i < threads; i++) {
    		pool.add(new JSONArray());
    	}
    	int size = cvs2json(header, reader, pool);
    	
    	List<Worker> workers = new ArrayList<>(threads);
    	CountDownLatch latch = new CountDownLatch(threads);
    	long time = System.currentTimeMillis();
        for (int i = 0; i < pool.size(); i++) {
        	Worker worker = new Worker(latch, ai, i, pool.get(i));
        	workers.add(worker);
        	executor.execute(worker);
        }
        try {
			latch.await();
		} catch (InterruptedException e) {
			logger.error("latch await", e);
		}
        time = System.currentTimeMillis() - time;
        
        List<Iterator<?>> result = new ArrayList<>(threads);
        for (Worker w : workers) {
        	if (w.getOutput() == null) {
        		result.add(Collections.emptyIterator());
        	} else {
        		result.add(w.getOutput().iterator());
        	}
        }
        for (int i = 0; i < size; i++) {
        	Iterator<?> iter = result.get(i % threads);
        	if (iter.hasNext()) {
        		System.out.println(iter.next());
        	} else {
        		System.out.println("null");
        	}
        }
        
        System.out.println(size);
        System.out.println(time);
	}

	public int cvs2json(List<String> header, BufferedReader reader, List<JSONArray> pool) throws IOException {
		String line = reader.readLine();
		while (line != null && (line.isEmpty() || line.contains("_id") || line.contains("age"))) {
			//跳过头
			line = reader.readLine();
		}
		int count = 0;
		while (line != null) {
			String[] rs = line.split(",");
			//数据是否合法
			if (rs.length == 0/*3*/ + header.size()) {
				JSONObject obj = new JSONObject();
				int index = 0;
				//obj.put("_id", new ObjectId(rs[index++]));
				for (String h : header) {
					obj.put(h, rs[index++]);
				}
				//obj.put("DEPTH", rs[index++]);
				//obj.put("predict", rs[index++]);
				pool.get(count % pool.size()).add(obj);
				count ++;
			}
			line = reader.readLine();
		}
		return count;
	}
	static double parseDouble(String s) {
		if (s == null || s.isEmpty()) { return Double.NaN; }
		if (s.contains(",")) { s = s.replaceAll(",", ""); }
		try {
			return Double.parseDouble(s);
		} catch (NumberFormatException ex) {
			return Double.NaN;
		}
    }
	
	class Worker implements Runnable {
		CountDownLatch latch;
		IModelPredict predict;
		int index;
		JSONArray input;
		JSONArray output;
		
		Worker(CountDownLatch latch, IModelPredict predict, int index, JSONArray input) {
			this.latch = latch;
			this.predict = predict;
			this.index = index;
			this.input = input;
		}
		@Override
		public void run() {
			try {
				output = predict.predictMore(input);
			} catch (Throwable ex) {
				logger.error("Worker["+index+"]", ex);
			} finally {
				latch.countDown();
			}
		}
		public JSONArray getOutput() {
			return output;
		}
	}

}
