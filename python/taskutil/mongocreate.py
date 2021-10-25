import cx_Oracle
import pymongo
import os
#mongodb ? ????
dbname="petrol_data"
#??oracle ???
is_oracle=True
#mongodb ?? ????????
rawcollection="petrol_raw" 
mongourl="mongodb://localhost:27017/" #mongodb ???
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'

linkstr = "puguang/puguang@192.168.43.22:1521/ORCL" #oracle ??????
'''
oracle connection string
'''
sqlstr = '''SELECT JH, JT, 
    QXWJM, ZBMC, KC, CJXMID, CYJG, YXJDDJSD1,
     YXJDDJSD2, BZ, LRSJ, VRUSERNAME, VRUNITNAME，
     COLLECT_JOB_S，GL_UUID， DATASTATUS， CJLX,
     ORDERTIME, UPLOADFLAG
      from WL18'''
#Oracle to mongodb mapping
field_raw = [
    'JH', 'JT', 'QXWJM',
    'ZBMC', 'KC', 'CJXMID',
    'CYJG', 'YXJDDJSD1', 'YXJDDJSD2',
    'BZ', 'LRSJ', 'VRUSERNAME', 'VRUNITNAME',
    'COLLECT_JOB_S', 'GL_UUID', 'DATASTATUS', 'CJLX',
    'ORDERTIME', 'UPLOADFLAG'
]
collectionames= ['crud_dict', 'crud_field', 'crud_table', 'crud_user', 'model_config', 
'oil_field_config', 'task', 'users']
#create crud meta schema
def create_schema(mongourl, dbname, collectionames):
    myclient = pymongo.MongoClient(mongourl)
    db = myclient[dbname]
    if len(db.list_collection_names()) != 0:
        [db.create_collection(item) for item in collectionames]
        print("在mongodb 中为 node.js 主服务 创建数据集合")
        print(db.list_collection_names())
#??????mongodb??
def transfer_data(linkstr, mongourl, dbname, field_list, is_oracle, datarepo, sqlstr):
    myclient = pymongo.MongoClient(mongourl)
    db = myclient[dbname]
    dbcols = db[datarepo]
    sys_conn = None
    if is_oracle:
        sys_conn = cx_Oracle.connect(linkstr)
    else:
        return
    cursor = sys_conn.cursor()
    cursor.execute(sqlstr.encode('utf-8'))
    result = cursor.fetchall()
    for row in result:
        dictionary = dict(zip(field_list,list(row)))
        dbcols.insert_one(dictionary)

if __name__ == "__main__":
    create_schema(mongourl, dbname, collectionames)
    transfer_data(linkstr, mongourl, dbname, field_raw, is_oracle, rawcollection, sqlstr)