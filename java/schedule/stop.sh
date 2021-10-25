#!/bin/bash
kill -9 `ps -ef | grep java | grep kms-schedule-1.1-jar-with-dependencies.jar | grep -v grep | awk '{print $ 2}'`
ps -ef | grep java | grep kms-schedule | grep -v grep
