package com.itma.kms;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;
import com.itma.util.db.MongoDBDriver;
import com.mongodb.BasicDBObject;
import com.mongodb.QueryOperators;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.result.UpdateResult;


public class Transform {

	private Logger logger = LoggerFactory.getLogger(Transform.class);
	
	private MongoDBDriver driver;

	public Transform(MongoDBDriver driver) {
		logger.info("init transform");
		this.driver = driver;
	}
	
	public void readyWork(String id) {
		BasicDBObject where = new BasicDBObject("_id", new ObjectId(id));
		BasicDBObject update = new BasicDBObject("$set", new BasicDBObject("status", "2"));
		UpdateResult rs = driver.getDatabase().getCollection("task").updateOne(where, update);
		logger.info("task[{}] ready work result:{}",id,rs.toString());
	}
	public void workEnd(String id) {
		BasicDBObject where = new BasicDBObject("_id", new ObjectId(id));
		BasicDBObject update = new BasicDBObject("$set", new BasicDBObject("status", "3"));
		UpdateResult rs = driver.getDatabase().getCollection("task").updateOne(where, update);
		logger.info("task[{}] work end result:{}",id,rs.toString());
	}
	

	public Task getTask(String id) {
		BasicDBObject query = new BasicDBObject("_id", new ObjectId(id));
		FindIterable<Document> iter = driver.getDatabase().getCollection("task").find(query);
		MongoCursor<Document> cursor = iter.iterator();
		if (!cursor.hasNext()) { return null; }
		return createTask(cursor);
	}
	public List<Task> loadQxwjm(boolean check) {
		FindIterable<Document> iter;
		if (check) {
			BasicDBObject query = new BasicDBObject("status", new BasicDBObject(QueryOperators.IN, Arrays.asList("1", "2")));
			iter = driver.getDatabase().getCollection("task").find(query);
		} else {
			iter = driver.getDatabase().getCollection("task").find();
		}
		MongoCursor<Document> cursor = iter.iterator();
		List<Task> list = new ArrayList<>();
		while (cursor.hasNext()) {
			Task task;
			try {
				task = createTask(cursor);
			} catch (Exception ex) {
				logger.error("load task:"+cursor, ex);
				continue;
			}
			list.add(task);
		}
		return list;
	}
	private Task createTask(MongoCursor<Document> cursor) {
		Document doc = cursor.next();
		String taskID;
		try {
			taskID = doc.getObjectId("_id").toHexString();
		} catch (ClassCastException ex) {
			taskID = doc.get("_id").toString();
		}
		Task task = new Task(taskID, doc.getString("tasktitle"));
		
		String jh = doc.getString("wellname");
		if (jh == null || jh.isEmpty()) { return task; }
		Document model_config = doc.get("model_config", Document.class);
		if (model_config == null || model_config.isEmpty()) { return task; }
		String model = model_config.getString("model_desc");
		List<String> header = Arrays.asList(model_config.getString("inparamslist").split(","));
		String output = model_config.getString("outparamslist");
		String pmax = model_config.getString("model_max");
		String pmin = model_config.getString("model_min");
		task.setHeader(header);
		task.setModel(model);
		task.setOutput(output);
		try {
			task.setPmax(Double.parseDouble(pmax));
		} catch (Exception ex) {
			//eat
		}
		try {
			task.setPmin(Double.parseDouble(pmin));
		} catch (Exception ex) {
			//eat
		}
		@SuppressWarnings("unchecked")
		List<String> qxwjms = doc.get("checkedlist", List.class);
		if (qxwjms.isEmpty()) { return task; }
		for (String qx : qxwjms) {
			Qxwjm qxwjm = new Qxwjm(task);
			qxwjm.setTaskID(taskID);
			qxwjm.setJh(jh);
			qxwjm.setQxwjm(qx);
			qxwjm.setHeader(header);
			qxwjm.setModel(model);
			qxwjm.setOutput(output);
			task.add(qxwjm);
		}
		return task;
	}
	public int doc2json(List<String> header, String jh, String qxwjm, List<JSONArray> json, String special, List<JSONArray> specialJson) {
		BasicDBObject query = new BasicDBObject();
		List<BasicDBObject> condtions = new ArrayList<BasicDBObject>();
		condtions.add(new BasicDBObject("JH", jh));
		condtions.add(new BasicDBObject("QXWJM", qxwjm));
		query.put(QueryOperators.AND, condtions);
		FindIterable<Document> iter = driver.getDatabase().getCollection("petrol_res").find(query).sort(new BasicDBObject("DEPTH", 1/*ASC*/));
		MongoCursor<Document> cursor = iter.iterator();
		int size = 0;
		while (cursor.hasNext()) {
			Document doc = cursor.next();
			JSONObject obj = new JSONObject();
			obj.put("_id", doc.getObjectId("_id").toHexString());
			for (String h : header) {
				obj.put(h, String.valueOf(doc.get(h)));
			}
			obj.put("DEPTH", String.valueOf(doc.get("DEPTH")));
			json.get(size % json.size()).add(obj);

			JSONObject s = new JSONObject();
			if (special != null) {
				for (String k :doc.keySet()) {
					if (k.equalsIgnoreCase(special)) {
						s.put(k+"act", String.valueOf(doc.get(k)));
					}
				}
			}
			specialJson.get(size % specialJson.size()).add(s);

			size ++;
		}
		return size;
	}

	public int doc2csv(List<String> header, String jh, String qxwjm, PrintWriter out) {
		BasicDBObject query = new BasicDBObject();
		List<BasicDBObject> condtions = new ArrayList<BasicDBObject>();
		condtions.add(new BasicDBObject("JH", jh));
		condtions.add(new BasicDBObject("QXWJM", qxwjm));
		query.put(QueryOperators.AND, condtions);
		FindIterable<Document> iter = driver.getDatabase().getCollection("petrol_res").find(query).sort(new BasicDBObject("DEPTH", 1/*ASC*/));
		MongoCursor<Document> cursor = iter.iterator();
		int size = 0;
		while (cursor.hasNext()) {
			Document doc = cursor.next();
			out.print(doc.getObjectId("_id").toHexString());
			for (String h : header) {
				out.print(",");
				out.print(doc.get(h));
			}
			out.print(",");
			out.println(doc.get("DEPTH"));
			size ++;
		}
		return size;
	}

	public void saveResult(PredictCfg cfg, TaskResult rs) {
		String collName = rs.getTaskID() == null ? "taskResult" : ("taskResult_"+rs.getTaskID());
		MongoCollection<Document> coll = driver.getDatabase().getCollection(collName);
		if (coll == null) {
			driver.getDatabase().createCollection(collName);
			coll = driver.getDatabase().getCollection(collName);
		}
		coll.insertOne(rs.toBson(cfg));
	}
	public TaskResult getResult(Qxwjm qxwjm) {
		String collName = qxwjm.getTaskID() == null ? "taskResult" : ("taskResult_"+qxwjm.getTaskID());
		MongoCollection<Document> coll = driver.getDatabase().getCollection(collName);
		if (coll == null) {
			return null;
		}
		BasicDBObject query = new BasicDBObject();
		List<BasicDBObject> condtions = new ArrayList<BasicDBObject>();
		condtions.add(new BasicDBObject("JH", qxwjm.getJh()));
		condtions.add(new BasicDBObject("QXWJM", qxwjm.getQxwjm()));
		query.put(QueryOperators.AND, condtions);

		BasicDBObject prop = new BasicDBObject();
		prop.append("status", 1);
		prop.append("message", 1);
		
		FindIterable<Document> iter = coll.find(query).projection(prop).sort(new BasicDBObject("_id", -1)).limit(1);
		MongoCursor<Document> cursor = iter.iterator();
		if (!cursor.hasNext()) { return null; }
		
		TaskResult rs = new TaskResult(qxwjm);
		Document doc = cursor.next();
		rs.setStatus(doc.getBoolean("status", true));
		rs.setMessage(doc.containsKey("message") ? doc.getString("message") : "执行成功");
		return rs;
	}
}
