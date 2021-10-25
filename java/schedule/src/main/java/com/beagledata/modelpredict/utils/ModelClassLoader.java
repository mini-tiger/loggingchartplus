package com.beagledata.modelpredict.utils;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class ModelClassLoader extends ClassLoader {

	
	private String rootDir;
	
	
	public ModelClassLoader() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ModelClassLoader(ClassLoader parent) {
		super(parent);
		// TODO Auto-generated constructor stub
	}
	public ModelClassLoader(String rootDir,ClassLoader parent) {
		super(parent);
		this.rootDir = rootDir;
	}
	public ModelClassLoader(String string) {
		super();
		this.rootDir = string;
	}
	private String classNameToPath(String className) { 
	       return rootDir + File.separatorChar 
	               + className.replace('.', File.separatorChar) + ".class"; 
	   }
	public Class<?> reDefineClass(String name) throws ClassNotFoundException{
		byte[] classData = loadClassFile(classNameToPath(name)); 
		return reDefineClass(name,classData);
	}
	public Class<?> reDefineClass(String name,byte[] classData) throws ClassNotFoundException{
		if (classData == null) { 
	           throw new ClassNotFoundException(); 
	       } 
	       else { 
	           return defineClass(name, classData, 0, classData.length); 
	       } 
	}
	@Override
	protected Class<?> findClass(String name) throws ClassNotFoundException {
		String classpath = classNameToPath(name);
		byte[] classData = loadClassFile(classpath); 
        /*if (classData == null  ||  classData.length < 1) {
           throw new ClassNotFoundException(); 
        }else { 
           return defineClass(name, classData, 0, classData.length);
        } */
        if( classData != null && classData.length > 1){
			return defineClass(name, classData, 0, classData.length);
		}else{
        	return null;
		}

	}

	//把我们的class文件转成字节码，用于classloader动态加载  
    private byte[] loadClassFile(String classPath) {  
        ByteArrayOutputStream bos = new ByteArrayOutputStream();  
        try {  
            FileInputStream fi = new FileInputStream(classPath);  
            BufferedInputStream bis = new BufferedInputStream(fi);  
            byte[] data = new byte[1024 * 256];  
            int ch = 0;  
            while ((ch = bis.read(data, 0, data.length)) != -1) {  
                bos.write(data, 0, ch);  
            }  
  
        } catch (FileNotFoundException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        } catch (IOException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        }  
  
        return bos.toByteArray();  
  
    }  

	
}
