#!/bin/bash
#Copyright 2013-2014 RevSoftware, Inc.
#Script prepared by Haranath
#Version 1.0

base_path=$PWD

#killing the processers
nodePids=$(pgrep node)
if [[ -n $nodePids ]] ; then
        killall -9 node
fi

#To installig the npm packages
cd $base_path/BoomerangService 
npm install

#To run the Cube
cd $base_path/cube
forever start -o $base_path/collector.log bin/collector.js 2>&1 >> $base_path/collector.log &
forever start -o $base_path/evaluator.log bin/evaluator.js 2>&1 >> $base_path/evaluator.log &

#To run the beacon service
cd $base_path/BoomerangService
forever start -o $base_path/rum.log server.js 

