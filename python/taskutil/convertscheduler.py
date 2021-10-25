from dbjob import *
import multiprocessing
tablename = "wl18"
sqlstr="select distinct jh, qxwjm from wl18"
linkstr = "puguang/puguang@192.168.43.22:1521/ORCL"
mongoconn = get_mongoConn()
folderprefix = "./intermdata/"
def subrountine(rowarg):
    jh = rowarg[0]
    qxwjm = rowarg[1]
    clientconn = get_mongoConn()
    outPathid =folderprefix +str(uuid.uuid4())
    fwrite_logger = function_logger(logging.DEBUG, logging.ERROR)
    if os.path.exists(outPathid) == False :
        os.makedirs(outPathid)
    try:
        dbjob = Dbjob(linkstr, jh, qxwjm, outPathid)

        allFieldlist = dbjob.writeLog()
        get_res_data(allFieldlist, outPathid, clientconn)
    except Exception as e:
        fwrite_logger.debug(str(e))

    #shutil.rmtree(outPathid)
    clientconn.close()
def isvalid(row):
    db = mongoconn["petrol_data"]
    dbcols = db["petrol_res"]
    document = dbcols.find_one({'JH' : row[0], 'QXWJM' : row[1]})
    if not bool(document) :
        return True
    else:
        return False

def main():
    print("The CPU count is: ",multiprocessing.cpu_count())

    
    conn = cx_Oracle.connect(linkstr)
    print(cx_Oracle.version)
    cursor = conn.cursor()
    print(sqlstr)
    cursor.execute(sqlstr)

    data = cursor.fetchall()

    after = filter(isvalid, data)
    #for filtered in after:
    #    print(filtered)
    mongoconn.close()
    conn.close()
    with multiprocessing.Pool(4) as p:
        p.map(subrountine, after)
    shutil.rmtree(folderprefix)
    #with multiprocessing.Pool(5) as p:
    #    p.map(subrountine, cursor.fetchall())
    # for row in cursor.fetchall() :
    #     # print(row)
    #
    #     db = clientconn["petrol_data"]
    #     dbcols = db["petrol_res"]
    #
    #     document = dbcols.find_one({'JH' : row[0], 'QXWJM' : row[1]})
    # subrountine(linkstr, row[0], row[1], clientconn)

if __name__ == '__main__' :

    main()
