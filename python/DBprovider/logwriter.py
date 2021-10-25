import numpy as np
import pandas as pd
import lasio
import cx_Oracle                                                #引用模块cx_Oracle
import time
import codecs
import os, sys,shutil
import pymysql

from sqlalchemy import create_engine

folderName='newLogPG'
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
#                    文件名，曲线名，间隔，测井曲线,开始深度，    结束深度
colNameList = ['JH','QXWJM','ZBMC','CYJG','ZBSJT', 'YXJDDJSD1', 'YXJDDJSD2']
#           mysql的连接地址
mysqlurl='mysql+pymysql://root:W3b5Ev!c3@127.0.0.1/petrol_data'

outPath = './newLogPG'


def getColIndex(colName):
    return colNameList.index(colName)

#数据库列进入sql格式转换
def getCols():
    txt  = ''
    for i in range(len(colNameList)-1):
        txt += colNameList[i] + ','
    txt += colNameList[len(colNameList)-1]
    return txt
#井号进入sql格式转换
def getjh(jh):
    txt  = ''
    for i in range(len(jh)-1):
        txt += jh[i] + "','"
    txt += jh[len(jh)-1]
    txt="('"+txt+"')"
    return txt
#测井曲线进入sql格式转换
def getqx(qx):
    txt  = ''
    for i in range(len(qx)-1):
        txt += qx[i] + "','"
    txt += qx[len(qx)-1]
    txt="('"+txt+"')"
    return txt

def toLas(filename, jh, tDepth, logNameList, logDataList):
    las = lasio.LASFile()
    samples = int(((tDepth[1] - tDepth[0]) / tDepth[2]) + 1)
    depth = np.linspace(tDepth[0], tDepth[1], samples)
    las.add_curve('DEPTH', depth, unit='M')
    for i in range(len(logNameList)):
        # print("==" * 20)
        # print("logNameList[i]", logNameList[i])
        # print("logDataList[i]", logDataList[i])
        las.add_curve(logNameList[i], logDataList[i], unit='UNKNOWN')
    las.well.WELL.value = jh
    las.write(filename)


def processDB(linkstr, jhvalues, qxvalues) :
    fWrite = codecs.open(outPath + '/writeLog.log', 'w', encoding='gbk')
    #strOrder = '%s/%s@%s:%s/%s' % (userName, passWord, ip, port, sid)
    print(linkstr)
    sys_conn = cx_Oracle.connect(linkstr)
    # sys_conn=cx_Oracle.connect('truck/******@10.74.**.**:****/****')    #连接数据库
    cursor = sys_conn.cursor()  # 获取cursor
    # sqlStr = 'SELECT %s from WL18 order by QXWJM'%(getCols())
    sqlStr = 'SELECT %s from WL18 where JH in %s AND ZBMC in %s order by QXWJM' % (getCols(), getjh(jhvalues), getqx(qxvalues))
    print(sqlStr)
    cursor.execute(sqlStr.encode('utf-8'))
    # cursor.execute(sqlStr)
    result = cursor.fetchall()
    tDepth = [0.0, 0.0, 0.0]
    logNamelist = []
    logDatalist = []
    curJH = 'JH-Test-NONE'
    samples = 0
    lasCount = 0
    errorIndex = 0
    curLx = 'orignal filename'
    for i in range(len(result)) :
        jh = result[i][getColIndex('JH')]
        lx = result[i][getColIndex('QXWJM')].replace('.', '_')  # 测井曲线原来所属的文件名
        logName = result[i][getColIndex('ZBMC')]
        d1 = float(result[i][getColIndex('YXJDDJSD1')])
        d2 = float(result[i][getColIndex('YXJDDJSD2')])
        dd = float(result[i][getColIndex('CYJG')])
        if i == 0 :
            curJH = jh
            curLx = lx
            curPath = outPath + '/' + curJH
            if os.path.exists(curPath) == False :  # 每一个井建立一个子文件夹
                os.mkdir(curPath)

        if jh != curJH or (tDepth[0] != d1 or tDepth[1] != d2) :  # 有一个新的‘井号’或者‘深度区间’，则建立一个新的文件
            if len(logNamelist) > 0 :
                # print('WriteStart')
                toLas(curPath + '/' + curJH + '_' + curLx + '.las', curJH, tDepth, logNamelist, logDatalist)
                # print('Write END')
                lasCount += 1
                print('lasCount = %s,  write las: well = %s,  orignal file = %s, rowIndex = %s' % (
                lasCount, curJH, lx, i))
                logNamelist.clear()
                logDatalist.clear()
            curJH = jh
            curLx = lx
            curPath = outPath + '/' + curJH
            if os.path.exists(curPath) == False :  # 每一个井建立一个子文件夹
                os.mkdir(curPath)

            tDepth[0] = d1
            tDepth[1] = d2
            tDepth[2] = dd  # float(result[i][getColIndex('CYJG')])
            samples = int(((tDepth[1] - tDepth[0]) / tDepth[2]) + 1)

        tLog = result[i][getColIndex('ZBSJT')].read().decode('utf-8').split(' ')
        tData = np.ones(samples, dtype='float32')
        for j in range(0, min(samples, len(tLog))) :
            try :
                tData[j] = float(tLog[j].replace(' ', ''))
            except Exception as ex :
                # print('error: =+++++++++++++++++++++++++++++', tLog[j],'================')
                # print('+++++++++++++++++++++++++++++++++++++%s=========================='%(tLog[len(tLog)-1]))
                tData[j] = -999.25
                tmpErr = '[errorIndex = %s]  i = %s, well = %s, tLog[j] = %s(j=%s, samples=%s), tLog[last] = %s ' % (
                errorIndex, i, curJH, tLog[j], j, samples, tLog[len(tLog) - 1])
                print('# # # ', tmpErr)
                fWrite.write(tmpErr + '\n')
        # print('type of tData = ', type(tData))
        # print(tLog)    # 读取BLOB字段转换成文本
        logNamelist.append(logName)
        # print("==" * 20)
        # print("logNameList", type(logNamelist))
        logDatalist.append(tData)
        # if i % 10 == 0:
        #    print('process = %.2f'%(i))
    toLas(outPath + '/' + curJH + '_' + curLx + '.las', curJH, tDepth, logNamelist, logDatalist)
    # print('result number = ' ,len(result))

    # x=c.execute('select sysdate from dual')                         #使用cursor进行各种操作
    # print(x)
    # x.fetchone()
    # cursor.close()
    sys_conn.close()

def closeDB(sys_conn):
    sys_conn.close()

# 获取文件夹
def get_files(path):
    name_list = os.listdir(path)
    # print(name_list)
    # current_path = os.path.abspath(__file__)
    current_path = os.getcwd()  # 获取当前路径
    # father_path=os.path.abspath(os.path.dirname(pwd)+os.path.sep+".")
    # father_path = os.path.abspath('')
    path = current_path + '/' + folderName + '/'
    # for name in name_list:
    #     if os.path.isdir(path + name):
    #         pass
    #     else:
    #         name_list.remove(name)
    name_list = [name for name in name_list if os.path.isdir(path + name)]
    return name_list, path

# 获取数据
def get_data(jh, data, result):
    # print('我是get_data')
    name_list, path = get_files('./newLogPG')
    flag =1
    for file_path in name_list:
        if flag == 1 and jh == file_path:
            for file in os.listdir(path + '/' + file_path):
                # 获取井
                wellName = file.split('_')[0]
                if file.__contains__('固井'):
                    continue
                print('{} 开始抽取'.format(file))
                #  读取数据
                df = read_las_file(path, file_path, file)  # 把读取las文件转换为DF
                # 处理数据前先判断标签
                real_label, label_list = deal_with_label(df)
                if len(label_list) == 0:
                    continue
                df = df[real_label]
                result = deal_with_data(data, df, wellName, label_list, result)  # 处理数据b
                flag = 0
                print('{} 抽取结束'.format(file))
            flag = 0
        else:
            return
    # return result
# 读取result
def get_res_data(qx):
    name_list, path = get_files(folderName)
    result1 = pd.DataFrame()
    for file_path in name_list:
        for file in os.listdir(path + '/' + file_path):
            if file.endswith(".las"):
                jh=file.split('_')[0]
                print('{} 开始抽取'.format(file))
                #  读取数据
                df = read_las_file(path, file_path, file)
                df['JH']=jh
                df = df.reset_index()
                if 'DEPTH:1' in df.columns.values.tolist():
                    df['DEPTH']=df['DEPTH:1']
                    df = df.drop('DEPTH:1', axis=1)
                    df=df.drop('DEPTH:2',axis=1)
                    print('{} 抽取结束'.format(file))
                result1=result1.append(df)
    # 保存文件
    save_data(qx, result1)
# 保存文件
def save_data(qx, res):
    qx.insert(0, 'DEPTH')
    qx.insert(0, 'JH')
    df_res = pd.DataFrame(res, columns=qx)
    engine = create_engine(mysqlurl)
    df_res.to_sql(name='petrol_resource',con=engine, if_exists='append', index=None)

# 处理标签
def deal_with_label(df):
    real_label = list(df.axes[1])  # 将目标文件的标签转换为列表
    print(len(real_label))
    label_list = []  # 用来存储目标文件标签在所要标签的位置
    real_label_list = []
    flag = 1
    for j in range(len(real_label)-1, -1, -1):
        if flag ==1 and real_label[j].split(":")[0].startswith('CAL'):
            label_list.append(label.index('CAL'))
            flag = 0
            real_label_list.append(real_label[j])
        elif real_label[j].split(":")[0] in label:
            # print(real_label[j])
            # print(j.split(":")[0])
            label_list.append(label.index(real_label[j].split(":")[0]))
            real_label_list.append(real_label[j])
    s = time.time()
    # label_list = [label.index(j.split(":")[0]) for j in real_label if j.split(":")[0] in label]
    print('deal_with_label', time.time() - s)
    return real_label_list, label_list

# 处理数据， 实现拼接
def deal_with_data(data, df, wellName, label_list, result):
    s = time.time()
    depth = list(df.index)
    for k in range(len(data)):  # 遍历res 中的df, 获取范围
        d1 = list(data.DJSD1)[k]
        d2 = list(data.DJSD2)[k]
        # print(d1, d2)
        # 2019——12——4 上午 增加了该判断， 速度蹭一下快了
        if depth[-1] < d1:
            continue
        if depth[0] > d2:
            continue
        for l in range(len(df)):  # 遍历目标文件
            # 这里陷入了死循环
            if depth[l] < d1 or depth[l] > d2:
                continue
            else:
                # print(1111)
                row = [-999.25 for i in range(len(label))]
                for num in range(len(label_list)):
                    row[label_list[num]] = df.iloc[l][num]
                row.insert(0, depth[l])  # 插入深度
                row.insert(0, wellName)  # 插入井名
                row.append(data.iloc[k][-1])
                result.append(row)
    print('deal_with_data', time.time() - s)
    return result
# 读取las数据
def read_las_file(path, file_path, file):
    path = path + '/' + file_path + '/' + file
    las = lasio.read(path)
    s = time.time()
    df = las.df()
    print(time.time() - s)
    return df

