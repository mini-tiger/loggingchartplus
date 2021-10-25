#!/bin/bash
 kill -9 `lsof -i:3007|grep -i node|awk 'NR!=1 {print $2}'`
