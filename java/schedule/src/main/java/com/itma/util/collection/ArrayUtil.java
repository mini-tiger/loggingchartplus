package com.itma.util.collection;

import java.lang.reflect.Array;

public class ArrayUtil {
	
	@SuppressWarnings("unchecked")
	public static <T> T[] create(Class<T> clazz, int size) {
		return (T[]) Array.newInstance(clazz, size);
	}
	
	
	public static int findStartsWith(String[] array, String find) {
		int last = -1;
		int len = -1;
		for (int i = 0; i < array.length; i++) {
			if (find.startsWith(array[i])) {
				if (last == -1 || array[i].length() > len) {
					last = i;
					len = array[i].length();
				}
			}
		}
		return last;
	}
	public static <T> boolean contains(T[] array, T find) {
		for (T a : array) {
			if (a == find) {
				return true;
			}
			if (a == null || find == null) {
				continue;
			}
			if (a.equals(find)) {
				return true;
			}
		}
		return false;
	}
	

	public static boolean startsWith(byte[] array, int offset, byte[] with) {
		return startsWith(array, offset, with, 0, with.length);
	}
	public static boolean startsWith(byte[] array, int aoffset, byte[] with, int owffset, int len) {
		for (int i = 0; i < len; i++) {
			if (aoffset + i >= array.length) { return false; }
			if (array[aoffset + i] != with[owffset + i]) { return false; }
		}
		return true;
	}
	public static int indexOf(byte[] source, byte[] target, int fromIndex) {
		return indexOf(source, 0, source.length, target, 0, target.length, fromIndex);
	}
	public static int indexOf(byte[] source, int sourceOffset, int sourceCount, byte[] target, int fromIndex) {
		return indexOf(source, sourceOffset, sourceCount, target, 0, target.length, fromIndex);
	}
	public static int indexOf(byte[] source, int sourceOffset, int sourceCount, 
			byte[] target, int targetOffset, int targetCount, 
			int fromIndex) 
	{
		if (fromIndex >= sourceCount) {
			return (targetCount == 0 ? sourceCount : -1);
		}
		if (fromIndex < 0) {
			fromIndex = 0;
		}
		if (targetCount == 0) {
			return fromIndex;
		}

		byte first = target[targetOffset];
		int max = sourceOffset + (sourceCount - targetCount);

		for (int i = sourceOffset + fromIndex; i <= max; i++) {
			/* Look for first character. */
			if (source[i] != first) {
				while (++i <= max && source[i] != first)
					;
			}

			/* Found first character, now look at the rest of v2 */
			if (i <= max) {
				int j = i + 1;
				int end = j + targetCount - 1;
				for (int k = targetOffset + 1; j < end && source[j] == target[k]; j++, k++)
					;

				if (j == end) {
					/* Found whole string. */
					return i - sourceOffset;
				}
			}
		}
		return -1;
	}
	
	public static int lastIndexOf(byte[] bytes, int begin, int end, byte[] search) {
		if (search == null || search.length == 0) { return -1; }
		if (end - begin < search.length/*数据段长度不够*/) { return -1; }
		boolean match = false;
		for (int i = end - 1; i >= begin + search.length - 1; i--) {
			if (bytes[i] == search[search.length - 1]) {
				match = true;
				int j = 1;
				for (; j < search.length & match; j++) {
					match = bytes[i - j] == search[search.length - 1 - j];
				}
				if (match) {
					return i - j + 1;
				}
			}
		}
		return -1;
	}
}
