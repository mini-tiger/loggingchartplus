package com.itma.kms;

import java.io.CharArrayWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;
import java.util.StringTokenizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class WebServer implements HttpHandler {

	private Logger logger = LoggerFactory.getLogger(WebServer.class);

	private Dispatcher dispatcher;
	
	public static void main(String[] args) throws Exception {
		WebServer web = new WebServer(null);
		web.start(3333, "/");
	}
	
	public WebServer(Dispatcher dispatcher) {
		this.dispatcher = dispatcher;
	}
	public void start(int port, String context) throws IOException {
		HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext(context, this);
        server.start();
	}

	@Override
	public void handle(HttpExchange exchange) throws IOException {
		try {
			JSONObject rs;
			try {
				String ContentType = exchange.getRequestHeaders().getFirst("Content-Type");
				String charset = "UTF-8";
				if (ContentType != null && ContentType.contains("charset=")) {
					charset = ContentType.substring(ContentType.indexOf("charset=") + "charset=".length());
					if (charset.contains(";")) {
						charset = ContentType.substring(0, charset.indexOf(";"));
					}
					charset = charset.trim();
					if (charset.isEmpty()) { charset = "UTF-8"; }
				}
				String body;
				InputStream is = exchange.getRequestBody();
		        try {
		            byte[] bs = new byte[1024];
		            int index = is.read(bs, 0, bs.length);
		            int len = 0;
		            while (index != -1) {
		            	len += index;
		            	if (len == bs.length) {
		            		byte[] temp = new byte[bs.length + 1024];
		            		System.arraycopy(bs, 0, temp, 0, bs.length);
		            		bs = temp;
		            	}
		                index = is.read(bs, len, bs.length - len);
		            };
		            body = new String(bs, 0, len, charset);
		        } finally {
		        	is.close();
		        }
				String uri = exchange.getRequestURI().toString();
		        logger.info("{}\n{}",uri,body);
				String context = exchange.getHttpContext().getPath();
		        if (uri.startsWith(context)) { uri = uri.substring(context.length()); }
				if (uri.startsWith("task/") || uri.startsWith("task?") || uri.equals("task")) {
					rs = task(exchange, body);
				} else if (uri.startsWith("qxwjm/") || uri.startsWith("qxwjm?") || uri.equals("qxwjm")) {
					rs = qxwjm(exchange, body);
				} else {
					rs = error("错误的访问路径");
				}
			} catch (Throwable ex) {
				exception(exchange, null, ex);
		        return;
			}
		    logger.info("result:{}",rs);
			if (rs == null) { return; }
	        exchange.sendResponseHeaders(200, 0);
	        exchange.getResponseHeaders().add("Content-Type", "application/json;charset=UTF-8");
	        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
	        exchange.getResponseHeaders().add("Cache-Control", "no-cache"); 
	        OutputStream os = exchange.getResponseBody();
	        os.write(rs.toJSONString().getBytes("UTF-8"));
	        os.close();
		} catch (IOException ex) {
			logger.error("web server handle", ex);
		} catch (Throwable ex) {
			logger.error("web server handle", ex);
			throw new IOException(ex);
		}
	}
	private JSONObject task(HttpExchange exchange, String body) throws IOException {
		//是否更新任务的执行状态
		boolean update = false;
		//是否检查历史执行情况
		boolean check = false;
		//是否返回执行结果
		boolean result = false;
		//任务编号
        String taskId = null;
        JSONObject json = null;
        try {
        	json = JSON.parseObject(body);
        } catch (Exception ex) {
        	//eat
        }
        if (json == null) {
	        StringTokenizer st = new StringTokenizer(body, "&");
	        while (st.hasMoreTokens()) {
	            String v = st.nextToken();
	            if (v.startsWith("update=")) {
	            	update = Boolean.parseBoolean(URLDecoder.decode(v.substring("update=".length()), "UTF-8"));
	            } else if (v.startsWith("check=")) {
	            	check = Boolean.parseBoolean(URLDecoder.decode(v.substring("check=".length()), "UTF-8"));
	            } else if (v.startsWith("result=")) {
	            	result = Boolean.parseBoolean(URLDecoder.decode(v.substring("result=".length()), "UTF-8"));
	            } else if (v.startsWith("task_id=")) {
	            	taskId = URLDecoder.decode(v.substring("task_id=".length()), "UTF-8");
	            }
	        }
        } else {
        	if (json.containsKey("update")) { update = Boolean.parseBoolean(json.getString("update")); }
        	if (json.containsKey("check")) { check = Boolean.parseBoolean(json.getString("check")); }
        	if (json.containsKey("result")) { result = Boolean.parseBoolean(json.getString("result")); }
        	if (json.containsKey("task_id")) { taskId = json.getString("task_id"); }
        }
        logger.info("task:{}", taskId);
        if (taskId == null || taskId.isEmpty()) {
        	return error("缺少任务编号(task_id)参数");
        }
        if (dispatcher != null) {
        	StringBuilder log = new StringBuilder();
        	List<TaskResult> rs;
        	try {
        		dispatcher.webCounter.incrementAndGet();
        		rs = dispatcher.work(taskId, log, update, check);
        	} catch (Exception ex) {
        		logger.error("dispatcher work "+taskId, ex);
        		exception(exchange, log.toString(), ex);
        		return null;
        	} finally {
        		dispatcher.webCounter.decrementAndGet();
        	}
        	JSONObject ok = success(log.toString());
    		JSONArray array = new JSONArray();
    		for (TaskResult r : rs) {
            	if (result) {
            		array.add(r.toJson(dispatcher.getPredictCfg()));
            	} else {
            		array.add(r.toStatusJson());
            	}
    		}
    		ok.getJSONObject("data").put("result", array);

        	return ok;
        }
        return success("OK");
		
	}
	private JSONObject qxwjm(HttpExchange exchange, String body) throws IOException {
		//是否返回执行结果
		boolean result = false;
		double pmax = Double.NaN;
		double pmin = Double.NaN;
		//曲线图
        Qxwjm qxwjm = new Qxwjm();
        JSONObject json = null;
        try {
        	json = JSON.parseObject(body);
        } catch (Exception ex) {
        	//eat
        }
        if (json == null) {
	        StringTokenizer st = new StringTokenizer(body, "&");
	        while (st.hasMoreTokens()) {
	            String v = st.nextToken();
	            if (v.startsWith("result=")) {
	            	result = Boolean.parseBoolean(URLDecoder.decode(v.substring("result=".length()), "UTF-8"));
	            } else if (v.startsWith("task_id=")) {
	            	qxwjm.setTaskID(URLDecoder.decode(v.substring("task_id=".length()), "UTF-8"));
	            } else if (v.startsWith("jh=")) {
	            	qxwjm.setJh(URLDecoder.decode(v.substring("jh=".length()), "UTF-8"));
	            } else if (v.startsWith("qxwjm=")) {
	            	qxwjm.setQxwjm(URLDecoder.decode(v.substring("qxwjm=".length()), "UTF-8"));
	            } else if (v.startsWith("header=")) {
	            	qxwjm.setHeader(Arrays.asList(URLDecoder.decode(v.substring("header=".length()), "UTF-8").split(",")));
	            } else if (v.startsWith("model=")) {
	            	qxwjm.setModel(URLDecoder.decode(v.substring("model=".length()), "UTF-8"));
	            } else if (v.startsWith("model_max=")) {
	            	pmax = Double.parseDouble(URLDecoder.decode(v.substring("model_max=".length()), "UTF-8"));
	            } else if (v.startsWith("model_min=")) {
	            	pmin = Double.parseDouble(URLDecoder.decode(v.substring("model_min=".length()), "UTF-8"));
	            }
	        }
        } else {
        	if (json.containsKey("result")) { result = Boolean.parseBoolean(json.getString("result")); }
        	if (json.containsKey("task_id")) { qxwjm.setTaskID(json.getString("task_id")); }
        	if (json.containsKey("jh")) { qxwjm.setJh(json.getString("jh")); }
        	if (json.containsKey("qxwjm")) { qxwjm.setQxwjm(json.getString("qxwjm")); }
        	if (json.containsKey("header")) { qxwjm.setHeader(Arrays.asList(json.getString("header").split(","))); }
        	if (json.containsKey("model")) { qxwjm.setModel(json.getString("model")); }
        	if (json.containsKey("model_max")) { pmax = Double.parseDouble(json.getString("model_max")); }
        	if (json.containsKey("model_min")) { pmin = Double.parseDouble(json.getString("model_min")); }
        }
        logger.info(qxwjm.toString());
        if (qxwjm.getJh() == null || qxwjm.getJh().isEmpty()) {
        	return error("缺少井号(jh)参数");
        }
        if (qxwjm.getQxwjm() == null || qxwjm.getQxwjm().isEmpty()) {
        	return error("缺少曲线文件名(qxwjm)参数");
        }
        if (qxwjm.getHeader() == null || qxwjm.getHeader().isEmpty()) {
        	return error("缺少输出字段(header)参数");
        }
        if (qxwjm.getModel() == null || qxwjm.getModel().isEmpty()) {
        	return error("缺少模型(model)参数");
        }
        Task task = new Task(qxwjm);
        task.setPmax(pmax);
        task.setPmin(pmin);
        if (dispatcher != null) {
        	StringBuilder log = new StringBuilder();
        	TaskResult rs;
        	try {
        		dispatcher.webCounter.incrementAndGet();
        		rs = dispatcher.work(qxwjm, log);
        	} catch (Exception ex) {
        		logger.error("dispatcher work "+qxwjm, ex);
        		exception(exchange, log.toString(), ex);
        		return null;
        	} finally {
        		dispatcher.webCounter.decrementAndGet();
        	}
        	if (rs == null) {
        		return error(log.toString());
        	}
        	JSONObject ok = success(log.toString());
        	
        	if (result) {
        		ok.getJSONObject("data").put("result", rs.toJson(dispatcher.getPredictCfg()));
        	} else {
        		ok.getJSONObject("data").put("result", rs.toStatusJson());
        	}
        	return ok;
        }        
        return success("OK");
		
	}

	private void exception(HttpExchange exchange, String message, Throwable ex) {
	    logger.error("exception:{}",message);
		try {
			CharArrayWriter caw = new CharArrayWriter();
			PrintWriter pw = new PrintWriter(caw);
		    if (message != null && !message.isEmpty()) {
			    pw.println(message);
		    }
			ex.printStackTrace(pw);
			String error = caw.toString();
			pw.close();
			
		    exchange.sendResponseHeaders(500, 0);
	        exchange.getResponseHeaders().add("Content-Type", "application/json;charset=UTF-8");
	        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
	        exchange.getResponseHeaders().add("Cache-Control", "no-cache"); 
		    OutputStream os = exchange.getResponseBody();
		    os.write(error(error).toJSONString().getBytes("UTF-8"));
		    os.flush();
		    os.close();
		} catch (Throwable th) {
			logger.error("web server handle", th);
		}
	}

	private JSONObject error(String message) {
		JSONObject rs = new JSONObject();
		rs.put("status", 400);
		rs.put("statusText", "fail");
		rs.put("data", new JSONObject());
		rs.getJSONObject("data").put("msg", message);
		return rs;
	}
	private JSONObject success(String message) {
		JSONObject rs = new JSONObject();
		rs.put("status", 200);
		rs.put("statusText", "ok");
		rs.put("data", new JSONObject());
		rs.getJSONObject("data").put("msg", message);
		return rs;
	}
}
