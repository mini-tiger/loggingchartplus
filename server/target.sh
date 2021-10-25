#!/usr/bin/ksh

which "javascript-obfuscator" > /dev/null
if [ $? -ne 0 ]
then
	npm install javascript-obfuscator -g
	javascript-obfuscator -v
fi

mkdir target
javascript-obfuscator ./src --output ./target --exclude node_modules --config javascript-obfuscator.json
/bin/cp -rf node_modules ./target/node_modules
/bin/cp -f start.sh ./target
/bin/cp -f stop.sh ./target
mkdir ./target/tmpzip

