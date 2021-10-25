package com.itma.kms.pojo;

import java.util.List;

public class Qxwjm {

	int index;
	String taskID;
	String jh;
	String qxwjm;
	List<String> header;
	String model;
	String output = "predict";
	
	Task task;
	
	public Qxwjm() {
	}
	public Qxwjm(Task task) {
		this.task = task;
	}
	
	@Override
	public String toString() {
		return "JH:"+jh+";QXWJM:"+qxwjm+";model:"+model+";output:"+output+";header:"+header;
	}
	
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
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
	public List<String> getHeader() {
		return header;
	}
	public void setHeader(List<String> header) {
		this.header = header;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getOutput() {
		return output;
	}
	public void setOutput(String output) {
		this.output = output;
	}
	
	public Task getTask() {
		return task;
	}
	void setTask(Task task) {
		this.task = task;
	}
}
