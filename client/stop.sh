#!/bin/bash
 kill -9 `lsof -i:3008|grep -i node|awk 'NR!=1 {print $2}'`
