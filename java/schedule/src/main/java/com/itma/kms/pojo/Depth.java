package com.itma.kms.pojo;

import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;

import com.alibaba.fastjson.JSONObject;
import com.itma.kms.PredictCfg;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class Depth {

    String _id;
    double depth;
    String output = "predict";
    double predict;
    Map<String, Double> data = new HashMap<>();
    
    public Depth() {
	}
	@Override
	public String toString() {
    	return new StringBuilder().append(_id).append(":").append(depth).append("/").append(predict).toString();
    }
    public DBObject toBson(Task task, PredictCfg cfg) {
       	BasicDBObject doc = new BasicDBObject();
		doc.append("_id", new ObjectId(_id));
		for (Map.Entry<String, Double> e : data.entrySet()) {
			if (Double.isNaN(e.getValue())) { continue; }
			doc.append(e.getKey(), e.getValue());
		}
    	if (!Double.isNaN(depth)) { doc.append("DEPTH", depth); }
    	if (cfg != null && cfg.isRestrict()) {
    		if (!Double.isNaN(predict)) { doc.append(output+cfg.getSuffix(), predict); }
    		double c = task == null ? predict : task.check(predict);
    		if (!Double.isNaN(c)) {
    			doc.append(output, c);
    			doc.append("modify", c);
    		}
    	} else {
        	if (!Double.isNaN(predict)) { doc.append(output, predict); }
    	}
    	return doc;
    }
    public JSONObject toJson(Task task, PredictCfg cfg) {
    	JSONObject json = new JSONObject();
    	json.put("_id", _id);
		for (Map.Entry<String, Double> e : data.entrySet()) {
			if (Double.isNaN(e.getValue())) { continue; }
			json.put(e.getKey(), e.getValue());
		}
    	if (!Double.isNaN(depth)) { json.put("DEPTH", depth); }
    	if (cfg != null && cfg.isRestrict()) {
    		if (!Double.isNaN(predict)) { json.put(output+cfg.getSuffix(), predict); }
    		double c = task == null ? predict : task.check(predict);
    		if (!Double.isNaN(c)) {
    			json.put(output, c);
    			json.put("modify", c);
    		}
    	} else {
        	if (!Double.isNaN(predict)) { json.put(output, predict); }
    	}
    	return json;
    }
    
	public String getId() {
		return _id;
	}
	public void setId(String _id) {
		this._id = _id;
	}
	public double getDepth() {
		return depth;
	}
	public void setDepth(double depth) {
		this.depth = depth;
	}
	public double getPredict() {
		return predict;
	}
	public void setPredict(String output, double predict) {
		this.output = output;
		this.predict = predict;
	}
	public void addData(String key, double value) {
		data.put(key, value);
	}
	public double getData(String key) {
		Double v = data.get(key);
		return v == null ? Double.NaN : v.doubleValue();
	}

	
}
