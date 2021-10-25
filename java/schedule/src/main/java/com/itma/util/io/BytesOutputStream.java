package com.itma.util.io;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;

public class BytesOutputStream extends ByteArrayOutputStream {

    public BytesOutputStream() {
		super();
    }

    /**
     * Creates a new byte array output stream, with a buffer capacity of 
     * the specified size, in bytes. 
     *
     * @param   size   the initial size.
     * @exception  IllegalArgumentException if size is negative.
     */
    public BytesOutputStream(int size) {
    	super(size);
    }
    
	public byte[] getBytes() {
		return buf;
	}
	public synchronized void mark(int offset) {
		if (offset > buf.length) {
            buf = Arrays.copyOf(buf, Math.max(buf.length << 1, offset));
		}
		count = offset;
	}
    public synchronized String toString(int begin, int end, String charsetName) throws UnsupportedEncodingException {
        return new String(buf, begin, end - begin, charsetName);
    }
    public synchronized String toString(int begin, int end) {
        return new String(buf, begin, end - begin);
    }

}
