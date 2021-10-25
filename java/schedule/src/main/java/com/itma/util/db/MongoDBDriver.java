package com.itma.util.db;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoDatabase;

/**
 * https://docs.mongodb.com/manual/reference/command/
 * https://xuexiyuan.cn/article/detail/155.html
 */
public class MongoDBDriver  {
	
	
	private Logger logger = LoggerFactory.getLogger(MongoDBDriver.class);
	
	public static void main(String[] args) throws Exception {
		if (args.length < 4) {
			System.out.println("args : address port username password [database]");
			System.out.println("example : 127.0.0.1 27017 admin 123456 admin");
			System.exit(-2);
		}

		Properties context = new Properties();
		context.setProperty("address", args[0]);
		context.setProperty("port", args[1]);
		context.setProperty("username", args[2]);
		context.setProperty("password", args[3]);
		if (args.length > 4) { context.setProperty("database", args[4]); }

		MongoDBDriver driver = new MongoDBDriver(context);
        try {
        } finally {
            System.exit(0);
        }
	}

	private String address;
	private int port;
	private String username;
	private String password;
	private String database;
	
	private MongoClient mongoClient = null;
	
	public MongoDBDriver(Properties context) {
		address = context.getProperty("address");
		port = Integer.parseInt(context.getProperty("port", "27017"));
        username = context.getProperty("username");
		password = context.getProperty("password");
		database = context.getProperty("database", "admin");
	}

	public MongoDatabase getDatabase() {
		return mongoClient.getDatabase(database);
	}
	public void close() {
		if (mongoClient != null) {
			mongoClient.close();
		}
		mongoClient = null;
	}	
	public void connect() {
		MongoClientOptions.Builder build = new MongoClientOptions.Builder();          
		build.connectionsPerHost(10);
		build.threadsAllowedToBlockForConnectionMultiplier(50);  
		/* 
		 * 一个线程访问数据库的时候，在成功获取到一个可用数据库连接之前的最长等待时间为2分钟 
		 * 这里比较危险，如果超过maxWaitTime都没有获取到这个连接的话，该线程就会抛出Exception 
		 * 故这里设置的maxWaitTime应该足够大，以免由于排队线程过多造成的数据库访问失败 
		 */  
		build.maxWaitTime(1000*60*2);  
		build.connectTimeout(1000*60*1);    //与数据库建立连接的timeout设置为1分钟  		
		build.maxConnectionLifeTime(1000*60*10);
		
		MongoClientOptions options = build.build();

		List<ServerAddress> addr = new ArrayList<ServerAddress>();
		addr.add(new ServerAddress(address, port));
		List<MongoCredential> cred = new ArrayList<MongoCredential>();
		cred.add(MongoCredential.createCredential(username, database, password.toCharArray()));
		
		MongoClient client = new MongoClient(addr, cred, options);
		if (mongoClient != null) {
			try {
				mongoClient.close();
			} catch (Throwable ex) {
				//TODO
			}
		}
		mongoClient = client;
	}
	public static class Connection {
		
		final MongoClient client;
		final MongoDatabase database;
		
		Connection(MongoClient client, MongoDatabase database) {
			this.client = client;
			this.database = database;
		}
		void close() {
			client.close();
		}

	}
}
