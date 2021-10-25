package com.itma.kms;

public class PredictCfg {

	//校验数据
	boolean restrict = true;
	//生成校验数据后,原始数据列需要添加的后缀
	String suffix = "_orSw";
	
	public boolean isRestrict() {
		return restrict;
	}
	public void setRestrict(boolean restrict) {
		this.restrict = restrict;
	}
	public String getSuffix() {
		return suffix;
	}
	public void setSuffix(String suffix) {
		this.suffix = suffix == null || suffix.isEmpty() ? "_" : suffix;
	}
	 

}
