#from dbjob import *
import subprocess

linkstr = "puguang/puguang@192.168.43.22:1521/ORCL"
tablename = "wl18"

conn = cx_Oracle.connect(linkstr)
print(cx_Oracle.version)
cursor = conn.cursor()

sqlstr="select distinct jh, qxwjm from %s"%(tablename);
print(sqlstr)
cursor.execute(sqlstr)

mysqlconn = pymysql.connect(host='192.168.40.111',
                            user='root',
                            password='W3b5Ev!c3',
                            database='petrol_data'

                            )
#outPath = './newLogPG'

for row in cursor.fetchall():
    #print(row)
    print(row[0], row[1])
    tempsql = "select count(id) from petrol_resource where jh = %(jhvalue)s and qxwjm = %(qxwvalue)s"
    #print(tempsql)
    mysqlcursor = mysqlconn.cursor()
    mysqlcursor.execute(tempsql,{"jhvalue": row[0], "qxwvalue": row[1]} )
    if mysqlcursor.fetchall()[0][0] != 0:
        print("=========================")
        print("found record")
        pass

    else:
        print("not found")
        #subprocess.run(["python3", "dbjob.py", "-u", linkstr, "-j", row[0], "-x", row[1]])

mysqlconn.close()
conn.close()