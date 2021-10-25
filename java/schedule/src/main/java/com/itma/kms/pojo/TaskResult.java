package com.itma.kms.pojo;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.Document;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.itma.kms.PredictCfg;
import com.mongodb.DBObject;

public class TaskResult {

	String taskID;
	String jh;
    String qxwjm;
    //执行成功与否
    boolean status = false;
    //执行的结果
    String message = "未执行";
	List<Depth> dataAll = new ArrayList<>();
	List<Section> sectionData = new ArrayList<>();
	Date timeStart;
	Date timeEnd;
	
	Task task;
	
	public TaskResult(Qxwjm qxwjm) {
		this.taskID = qxwjm.getTaskID();
		this.jh = qxwjm.getJh();
		this.qxwjm = qxwjm.getQxwjm();
		this.timeStart = new Date();
		
		this.task = qxwjm.getTask();
	}
    public Document toBson(PredictCfg cfg) {
    	List<DBObject> array;
    	Document doc = new Document();
    	if (taskID != null) { doc.put("taskID", taskID); }
    	doc.put("JH", jh);
    	doc.put("QXWJM", qxwjm);
    	doc.put("status", status);
    	doc.put("message", message);
    	doc.put("timeStart", timeStart);
    	doc.put("timeEnd", timeEnd);
    	array = new ArrayList<>(sectionData.size());
    	for (Depth d : dataAll) {
    		array.add(d.toBson(task, cfg));
    	}
    	doc.put("dataAll", array);
    	array = new ArrayList<>(sectionData.size());
    	for (Section s : sectionData) {
    		array.add(s.toBson());
    	}
    	doc.put("sectionData", array);
    	return doc;
    }
    public JSONObject toJson(PredictCfg cfg) {
    	JSONArray array;
    	JSONObject json = new JSONObject();
    	if (taskID != null) { json.put("taskID", taskID); }
    	json.put("JH", jh);
    	json.put("QXWJM", qxwjm);
    	json.put("status", status);
    	json.put("message", message);
    	json.put("timeStart", timeStart);
    	json.put("timeEnd", timeEnd);
    	array = new JSONArray();
    	for (Depth d : dataAll) {
    		array.add(d.toJson(task, cfg));
    	}
    	json.put("dataAll", array);
    	array = new JSONArray();
    	for (Section s : sectionData) {
    		array.add(s.toJson());
    	}
    	json.put("sectionData", array);
    	return json;
    }
    public JSONObject toStatusJson() {
    	JSONObject json = new JSONObject();
    	if (taskID != null) { json.put("taskID", taskID); }
    	json.put("JH", jh);
    	json.put("QXWJM", qxwjm);
    	json.put("status", status ? 200 : 400);
    	json.put("message", message);
    	return json;
    }

	public String getTaskID() {
		return taskID;
	}

	public void setTaskID(String taskID) {
		this.taskID = taskID;
	}

	public String getJh() {
		return jh;
	}

	public void setJh(String jh) {
		this.jh = jh;
	}

	public String getQxwjm() {
		return qxwjm;
	}

	public void setQxwjm(String qxwjm) {
		this.qxwjm = qxwjm;
	}
	
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void success(String message) {
		this.status = true;
		this.message = message;
	}
	public void error(String error) {
		this.status = false;
		this.message = error;
	}
	
	public List<Depth> getDataAll() {
		return dataAll;
	}

	public void setDataAll(List<Depth> dataAll) {
		this.dataAll = dataAll;
	}

	public List<Section> getSectionData() {
		return sectionData;
	}

	public void setSectionData(List<Section> sectionData) {
		this.sectionData = sectionData;
	}

	public Date getTimeStart() {
		return timeStart;
	}

	public void setTimeStart(Date timeStart) {
		this.timeStart = timeStart;
	}

	public Date getTimeEnd() {
		return timeEnd;
	}

	public void setTimeEnd(Date timeEnd) {
		this.timeEnd = timeEnd;
	}
	
	
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	
	public void toDataCsv(PredictCfg cfg, Qxwjm qxwjm, String file) throws IOException {
		File f = new File(file);
		if (!f.getParentFile().exists()) {
			f.getParentFile().mkdirs();
		}
		PrintWriter pw = new PrintWriter(new FileWriter(f, false));
		try {
			toDataCsv(cfg, qxwjm.getHeader(), pw);
		} finally {
			pw.close();
		}
	}
	public void toDataCsv(PredictCfg cfg, List<String> header, PrintWriter out) {
		out.print("id,DEPTH,predict");
		if (cfg != null && cfg.isRestrict()) {
			out.print(",predict"+cfg.getSuffix());
		}
		for (String h : header) { out.print(","); out.print(h); }
		out.println();
		for (Depth r : dataAll) {
			out.print(r.getId());
			out.print(",");
			out.print(r.getDepth());
			out.print(",");
			out.print(r.getPredict());
			if (cfg != null && cfg.isRestrict()) {
				out.print(",");
				if (task == null) {					
					out.print(r.getPredict());
				} else {
					task.check(r.getPredict());
				}
			}
			for (String h : header) {
				out.print(",");
				out.print(r.getData(h));
			}
			out.println();
		}
		out.flush();
	}
	public void toSectionCsv(Qxwjm qxwjm, String file) throws IOException {
		File f = new File(file);
		if (!f.getParentFile().exists()) {
			f.getParentFile().mkdirs();
		}
		PrintWriter pw = new PrintWriter(new FileWriter(f, false));
		try {
			toSectionCsv(pw);
		} finally {
			pw.close();
		}
	}
	public void toSectionCsv(PrintWriter out) {
		out.print("begin,end,predict,section,ply");
		out.println();
		for (Section r : sectionData) {
			out.print(r.getBeginDepth());
			out.print(",");
			out.print(r.getEndDepth());
			out.print(",");
			out.print(r.getPredict());
			out.print(",");
			out.print(r.getSectionDepth());
			out.print(",");
			out.print(r.getPlyDepth());
			out.println();
		}
		out.flush();
	}
}
