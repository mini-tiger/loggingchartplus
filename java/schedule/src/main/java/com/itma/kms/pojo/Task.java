package com.itma.kms.pojo;

import java.util.ArrayList;
import java.util.List;

public class Task {

	String taskID;
	String title;
	List<Qxwjm> charts = new ArrayList<>();
	List<String> header;
	String model;
	String output = "predict";
	double pmax = Double.NaN;
	double pmin = Double.NaN;
	
	public Task(String taskID, String title) {
		this.taskID = taskID;
		this.title = title;
	}
	public Task(Qxwjm qxwjm) {
		this.taskID = qxwjm.getTaskID();
		this.charts.add(qxwjm);
		this.header = qxwjm.getHeader();
		this.model = qxwjm.getModel();
		this.output = qxwjm.getOutput();
		
		qxwjm.setTask(this);
	}
	public double check(double val) {
		if (Double.isNaN(val)) { return val; }
		if (!Double.isNaN(pmax) && val > pmax) { return pmax; }
		if (!Double.isNaN(pmin) && val < pmin) { return pmin; }
		return val;
	}
	

	public String getTaskID() {
		return taskID;
	}
	public String getTitle() {
		return title;
	}
	public void add(Qxwjm qxwjm) {
		this.charts.add(qxwjm);
	}
	public List<Qxwjm> getQxwjms() {
		return charts;
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
	public double getPmax() {
		return pmax;
	}
	public void setPmax(double pmax) {
		this.pmax = pmax;
	}
	public double getPmin() {
		return pmin;
	}
	public void setPmin(double pmin) {
		this.pmin = pmin;
	}
}
