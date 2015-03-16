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

#for scalability
#forever start -o $base_path/collector.log bin/collector.js 2>&1 >> $base_path/collector.log &
#forever start -o $base_path/evaluator.log bin/evaluator.js 2>&1 >> $base_path/evaluator.log &
#forever start -o $base_path/collector1.log bin/collector1.js 2>&1 >> $base_path/collector1.log &
#forever start -o $base_path/evaluator1.log bin/evaluator1.js 2>&1 >> $base_path/evaluator1.log &
#forever start -o $base_path/collector2.log bin/collector2.js 2>&1 >> $base_path/collector2.log &
#forever start -o $base_path/evaluator2.log bin/evaluator2.js 2>&1 >> $base_path/evaluator2.log &
#forever start -o $base_path/collector3.log bin/collector3.js 2>&1 >> $base_path/collector3.log &
#forever start -o $base_path/evaluator3.log bin/evaluator3.js 2>&1 >> $base_path/evaluator3.log &

#To run the beacon service
cd $base_path/BoomerangService
forever start -o $base_path/rum.log server.js 

