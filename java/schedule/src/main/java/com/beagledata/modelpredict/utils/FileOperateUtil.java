package com.beagledata.modelpredict.utils;


import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Enumeration;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;

public class FileOperateUtil {

	  public static void setLogPath(String logPath) {
	        FileOperateUtil.logPath = logPath;
	    }

	    private static String logPath = "";

	    public static String getLogPath() {
	        return logPath;
	    }

	    public  static void unZipFiles(String zipFilePath, String fileSavePath) {
	        try {
				File savepath = new File(fileSavePath);
				if(!savepath.exists()){
					savepath.mkdirs();
				}
	            File f = new File(zipFilePath);
	            if ((!f.exists()) && (f.length() <= 0)) {
	                throw new RuntimeException("not find "+zipFilePath+"!");
	            }
	            ZipFile zipFile = new ZipFile(f, "gbk");
	            String gbkPath, strtemp;
	            Enumeration<ZipEntry> e = zipFile.getEntries();
	            while (e.hasMoreElements()) {
	                org.apache.tools.zip.ZipEntry zipEnt = e.nextElement();
	                gbkPath = zipEnt.getName();
	                strtemp = fileSavePath + File.separator + gbkPath;
	                if (zipEnt.isDirectory()) { //目录
	                    File dir = new File(strtemp);
	                    if (!dir.exists()) {
	                        dir.mkdirs();
	                    }
	                    continue;
	                } else {
	                    // 读写文件
	                    InputStream is = zipFile.getInputStream(zipEnt);
	                    BufferedInputStream bis = new BufferedInputStream(is);
	                    // 建目录
	                    String strsubdir = gbkPath;
	                    for (int i = 0; i < strsubdir.length(); i++) {
	                        if (strsubdir.substring(i, i + 1).equalsIgnoreCase("/")) {
	                            String temp = fileSavePath + File.separator
	                                    + strsubdir.substring(0, i);
	                            File subdir = new File(temp);
	                            if (!subdir.exists())
	                                subdir.mkdir();
	                        }
	                    }
	                    FileOutputStream fos = new FileOutputStream(strtemp);
	                    BufferedOutputStream bos = new BufferedOutputStream(fos);
	                    int len;
	                    byte[] buff = new byte[5120];
	                    while ((len = bis.read(buff)) != -1) {
	                        bos.write(buff, 0, len);
	                    }
	                    bos.close();
	                    fos.close();
	                }
	            }
	            zipFile.close();
	        } catch (Exception e) {
	            System.out.println("extract file error: " + zipFilePath);
	            
	        }
	    }
	 
	 
	 
	 /**
	     * 删除指定文件夹下所有文件
	     * param path 文件夹完整绝对路径
	     *
	     * @param path
	     * @return
	     */

	    public static boolean delAllFile(String path) {
	        System.out.println(path);
	        boolean flag = false;
	        File file = new File(path);
	        if (!file.exists()) {
	            return flag;
	        }
	        if (!file.isDirectory()) {
	            return flag;
	        }
	        String[] tempList = file.list();
	        File temp = null;
	        for (int i = 0; i < tempList.length; i++) {
	            if (path.endsWith(File.separator)) {
	                temp = new File(path + tempList[i]);
	            } else {
	                temp = new File(path + File.separator + tempList[i]);
	            }
	            if (temp.isFile()) {
	                temp.delete();
	            }
	            if (temp.isDirectory()) {
	                delAllFile(path + "/" + tempList[i]);// 先删除文件夹里面的文件
	                boolean success = (new File(path + "/" + tempList[i])).delete();
	                flag = success;
	            }
	        }
	        return flag;
	    }

}
