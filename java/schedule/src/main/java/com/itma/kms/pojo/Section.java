package com.itma.kms.pojo;

import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class Section {

    String jh;
    String qxwjm;
    double beginDepth;
    double endDepth;
    long predict;
    
    public Section(Qxwjm qxwjm) {
		this.jh = qxwjm.getJh();
		this.qxwjm = qxwjm.getQxwjm();
	}
    @Override
	public String toString() {
    	return new StringBuilder().append(beginDepth).append("-").append(endDepth).append("/").append(predict).toString();
    }
    public DBObject toBson() {
    	BasicDBObject bson = new BasicDBObject();
    	bson.put("JH", jh);
    	bson.put("QXWJM", qxwjm);
    	bson.put("sectionDepth", getSectionDepth());
    	bson.put("predict", predict);
    	bson.put("plyDepth", getPlyDepth());
    	return bson;
    }
    public JSONObject toJson() {
    	JSONObject json = new JSONObject();
    	json.put("JH", jh);
    	json.put("QXWJM", qxwjm);
    	json.put("sectionDepth", getSectionDepth());
    	json.put("predict", predict);
    	json.put("plyDepth", getPlyDepth());
    	return json;
    }
    
    public String getSectionDepth() {
    	return new StringBuilder().append(beginDepth).append("-").append(endDepth).toString();
    }
    public double getPlyDepth() {
    	return endDepth - beginDepth;
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
	public double getBeginDepth() {
		return beginDepth;
	}
	public void setBeginDepth(double beginDepth) {
		this.beginDepth = beginDepth;
	}
	public double getEndDepth() {
		return endDepth;
	}
	public void setEndDepth(double endDepth) {
		this.endDepth = endDepth;
	}
	public long getPredict() {
		return predict;
	}
	public void setPredict(long predict) {
		this.predict = predict;
	}
}
