#!/bin/bash
#run shell before  tar xf *.tgz
source /etc/profile
/bin/cp -f client/start.sh /home/loggingchart/client/start.sh
/bin/cp -f server/start.sh /home/loggingchart/server/start.sh
/bin/cp -f server/src/config/config.js /home/loggingchart/server/src/config/config.js

/bin/cp -f client/src/router.jsx /home/loggingchart/client/src/router.jsx
/bin/cp -f java/schedule/config.json /home/loggingchart/java/schedule/config.json
/bin/cp -f client/config.js /home/loggingchart/client/config.js
rm -rf /home/loggingchart/client/node_modules
/bin/cp -r /home/loggingchart_0703/client/node_modules /home/loggingchart/client/

rm -rf /home/loggingchart/server/node_modules
/bin/cp -r /home/loggingchart_0703/server/node_modules /home/loggingchart/server/
# kill
 kill -9 `lsof -i:3008|grep -i node|awk 'NR!=1 {print $2}'`
 kill -9 `lsof -i:3007|grep -i node|awk 'NR!=1 {print $2}'`
 kill -9 `lsof -i:3333|grep -i java|awk '{print $2}'`
pushd /home/loggingchart/server
sh start.sh
popd
pushd /home/loggingchart/client
sh start.sh
popd
pushd /home/loggingchart/java/schedule/
sh start.sh
popd
pushd /home/loggingchart
/bin/cp -f package.json /home/pack/package.json
rm -f package.json
popd
echo "程序正常启动后，如果需要后端代码加密执行back.sh"
