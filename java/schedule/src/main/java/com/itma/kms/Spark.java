package com.itma.kms;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itma.kms.pojo.Depth;
import com.itma.kms.pojo.Qxwjm;
import com.itma.kms.pojo.Section;
import com.itma.kms.pojo.Task;
import com.itma.kms.pojo.TaskResult;
import com.itma.util.cli.CmdTools;

public class Spark implements Draw {
	
	private Logger logger = LoggerFactory.getLogger(Transform.class);
	
	private CmdTools cmd = new CmdTools(Executors.newCachedThreadPool());
	private String[] envp = null;
	//sh运行目录
	private File workp = new File("/opt/predict");

	private Dispatcher dispatcher;
	private Transform transform;
	
	public Spark(Dispatcher dispatcher, File workp) {
		this.dispatcher = dispatcher;
		this.workp = workp;
		
		this.transform = dispatcher.getTransform();
	}

	@Override
	public Object taskBegin(Task task, StringBuilder log) {
		return "spark";
	}
	@Override
	public void taskEnd(Task task, Object ctx, StringBuilder log) {
	}
	@Override
	public TaskResult draw(Qxwjm qxwjm, Object ctx, StringBuilder log) throws IOException, InterruptedException {
		TaskResult rs = new TaskResult(qxwjm);
		log.append(qxwjm).append('\n');
		
		long time = System.currentTimeMillis();
		File f = new File("../predict/input/"+qxwjm.getIndex()+"/data.csv");
		if (!f.getParentFile().exists()) {
			f.getParentFile().mkdirs();
		} else {
			for (File f0 : f.getParentFile().listFiles()) {
				if (f0.getName().equals(f.getName())) { continue; }
				f0.delete();
			}
		}
		int size;
		PrintWriter pw = new PrintWriter(new FileWriter(f, false));
		try {
			pw.print("_id");
			for (String h : qxwjm.getHeader()) {
				pw.print(",");
				pw.print(h);
			}
			pw.println(",DEPTH");
			size = transform.doc2csv(qxwjm.getHeader(), qxwjm.getJh(), qxwjm.getQxwjm(), pw);
		} finally {
			pw.close();
		}
		time = System.currentTimeMillis() - time;
		logger.warn("mongo data[{}] time:{}s",size,(time/1000L));
		log.append("mongo data["+size+"] time:"+(time/1000L)+"s").append("\n");

		File output = new File("../predict/output/"+qxwjm.getIndex());
		if (output.exists()) { 
			for (File f0 : output.listFiles()) {
				f0.delete();
			}
		}
		
		StringBuilder rsh = new StringBuilder();
		rsh.append("_id");
		for (String h : qxwjm.getHeader()) { rsh.append(",").append(h); }
		rsh.append(",DEPTH");
		
		StringBuilder cli = new StringBuilder();
		cli.append("sh start_predict_p.sh ");
		cli.append('"').append(qxwjm.getModel()).append("\" ");
		cli.append('"').append("/opt/predict/input/").append(qxwjm.getIndex()).append("\" ");
		cli.append('"').append("/opt/predict/output/").append(qxwjm.getIndex()).append("\" ");
		cli.append("\"").append(rsh).append("\"");
		logger.info(cli.toString());
		
		time = System.currentTimeMillis();
		spark(qxwjm.getModel(), 
				"/opt/predict/input/"+qxwjm.getIndex(), 
				"/opt/predict/output/"+qxwjm.getIndex(), 
				rsh.toString());
		time = System.currentTimeMillis() - time;
		logger.warn("spark data[{}] time:{}s",size,(time/1000L));
		log.append("spark data["+size+"] time:"+(time/1000L)+"s").append("\n");
		
		time = System.currentTimeMillis() - time;
		boolean ok = result(rs, qxwjm, new File("../predict/output/"+qxwjm.getIndex()));
		if (ok) {
			transform.saveResult(dispatcher.getPredictCfg(), rs);
		}
		time = System.currentTimeMillis() - time;
		logger.warn("result data[{}] section[{}] time:{}s",rs.getDataAll().size(),rs.getSectionData().size(), (time/1000L));
		log.append("result data["+rs.getDataAll().size()+"] section["+rs.getSectionData().size()+"] time:"+(time/1000L)+"s").append("\n");
		
		rs.success("执行成功");
		return rs;
    }
	void spark(String model, String input, String output, String header) throws IOException, InterruptedException {
		StringBuilder sh = new StringBuilder("sh start_predict_p.sh");
		/*/
		sh.append(" \"").append(model).append("\"");
		sh.append(" \"").append(input).append("\"");
		sh.append(" \"").append(output).append("\"");
		sh.append(" \"").append(header).append("\"");
		/*/
		sh.append(" ").append(model).append("");
		sh.append(" ").append(input).append("");
		sh.append(" ").append(output).append("");
		sh.append(" ").append(header).append("");
		System.out.println(sh);
		System.out.println(cmd.command(sh.toString(), envp, workp, 5 * 60 * 1000L));
	}
	boolean result(TaskResult tr, Qxwjm qxwjm, File output) throws IOException {
		File _SUCCESS = new File(output, "_SUCCESS");
		if (!_SUCCESS.exists()) {
			//TODO
			return false;
		}
		System.out.println(qxwjm);
		System.out.println(output);
		List<Depth> list = new LinkedList<Depth>();
		for (File part : output.listFiles()) {
			String name = part.getName();
			System.out.println(name);			
			if (!name.startsWith("part-") || !name.endsWith(".csv")) { continue; }
			BufferedReader reader = new BufferedReader(new FileReader(part));
			try {
				String line = reader.readLine();
				while (line != null && (line.isEmpty() || line.contains("_id"))) {
					//跳过头
					line = reader.readLine();
				}
				while (line != null) {
					String[] rs = line.split(",");
					//数据是否合法
					if (rs.length == 3 + qxwjm.getHeader().size()) {
						Depth doc = new Depth();
						int index = 0;
						doc.setId(rs[index++]);
						for (String h : qxwjm.getHeader()) {
							doc.addData(h, Double.parseDouble(rs[index++]));
						}
						doc.setDepth(Double.parseDouble(rs[index++]));
						doc.setPredict(qxwjm.getOutput(), Double.parseDouble(rs[index++]));
						list.add(doc);
					}
					line = reader.readLine();
				}
			} finally {
				reader.close();
			}
		}
		//System.out.println(list);
		List<Section> data = dispatcher.section(qxwjm, list);
		//System.out.println(data);
		
		tr.setDataAll(list);
		tr.setSectionData(data);
		tr.setTimeEnd(new Date());
		
		return true;
	}

}
