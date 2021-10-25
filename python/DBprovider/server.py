import cx_Oracle
from flask import Flask, jsonify, request, make_response
import json
import os
from logwriter import *
os.environ["NLS_LANG"] = ".zhs16gbk"
app = Flask(__name__)
userName ="puguang"
passWord ="puguang"
ip="192.168.43.22"
port =1521
sid ="ORCL"

def initDB():

    strOrder = '{}/{}@{}:{}/{}'.format(userName, passWord, ip, str(port), sid)
    conn = cx_Oracle.connect(strOrder)
    return conn

def initDBstr(sn):
    #sn = 'puguang/puguang@192.168.43.22:1521/ORCL'
    conn = cx_Oracle.connect(sn)
    return conn

def get_wellno(conn):

    cursor = conn.cursor()
    cursor.execute("""
    SELECT DISTINCT JH FROM WL18
    """)
    ret= [ item[0] for item in cursor]
    #print(ret)
    return ret

def get_wellflist(conn,JH):

    cursor = conn.cursor()
    formatedstr = """SELECT DISTINCT QXWJM FROM WL18 WHERE JH = '{}'""".format(JH)
    cursor.execute(formatedstr)
    #for item in cursor:
    #   print(item[0])
    return [ item[0] for item in cursor]

def get_curveindex(conn, curvefilename):

    cursor = conn.cursor()
    formatedstr = """
       SELECT ZBMC FROM WL18 WHERE QXWJM = '{}'
       """.format(curvefilename)
    cursor.execute(formatedstr)

    return [ item[0] for item in cursor]

def closeConn(conn):

    if conn is not None:
        conn.close()


@app.route('/wellapi/v1/getJH' ,methods=['POST'])
def http_get_wellno():
    data_encoded = request.get_data().decode('utf-8')
    data_decoded = json.loads(data_encoded)
    linkstr = data_decoded['linkstr']
    linktype = data_decoded['linktype']
    print(linkstr)
    if(linktype == '0'):
        conn = initDBstr(linkstr)
        cursor = get_wellno(conn)
        closeConn(conn)
        return make_response(jsonify({'wellnolist': cursor}), 200)
    else:
        pass
@app.route('/wellapi/v1/getwellflist', methods=['POST'])
def http_get_wellflist():
    data_encoded = request.get_data().decode('utf-8')
    data_decoded = json.loads(data_encoded)
    linkstr = data_decoded['linkstr']
    linktype = data_decoded['linktype']
    jh = data_decoded['jh']
    if (linktype == '0') :
        conn = initDBstr(linkstr)
        ret = get_wellflist(conn, jh)
        closeConn(conn)
        return make_response(jsonify({'wellflist': ret}), 200)
    else:
        pass
@app.route('/wellapi/v1/getidxlist', methods=['POST'])
def http_get_idx():
    data_encoded = request.get_data().decode('utf-8')
    #print(data_encoded)
    data_decoded = json.loads(data_encoded)
    linkstr = data_decoded['linkstr']
    linktype = data_decoded['linktype']
    filename = data_decoded['qxm']
    if (linktype == '0') :
        conn = initDBstr(linkstr)
        ret = get_curveindex(conn, filename)
        closeConn(conn)
        return make_response(jsonify({'wellfidxlist': ret}), 200)
    else:
        pass
@app.route('/wellapi/v1/writeDB', methods=['POST'])
def logservice():

    data_encoded = request.get_data().decode('utf-8')
    data_decoded = json.loads(data_encoded)
    #username = data_decoded["username"]
    #password = data_decoded["password"]
    #ip = data_decoded["ip"]

    #port = data_decoded["port"]
    #sid = data_decoded["sid"]
    linkstr = data_decoded["linkstr"]
    jh = data_decoded["jh"]
    qx = data_decoded["qx"]

    jhvalues = jh.split(',')
    print(jhvalues)
    qxvalues = qx.split(',')
    print(qxvalues)

    if os.path.exists(outPath) == False:
        os.mkdir(outPath)
    processDB(linkstr, jhvalues, qxvalues)

    #qx = 'GR'
    get_res_data(qxvalues)
    shutil.rmtree(folderName)
    return make_response(jsonify({'isOK': True}), 201)

if __name__ == "__main__":
    app.run(host="192.168.40.111", debug=True, port=5000)