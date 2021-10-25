package com.itma.kms;

import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;

public interface Draw {
	
	/**
	 * 返回null表示任务开始失败
	 */
	Object taskBegin(Task task, StringBuilder log);

	TaskResult draw(Qxwjm qxwjm, Object ctx, StringBuilder log) throws Exception;
	
	void taskEnd(Task task, Object ctx, StringBuilder log);
}
