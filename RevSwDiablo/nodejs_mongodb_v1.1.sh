#!/bin/bash
#nodejs and mongodb installation
#script preaped by srikanth thota
#Changes done by Haranath Gorantla
#version 1.0

#This scripts runs under root only
if [ $UID -ne 0 ]
then
echo "Please run this script as root"
exit
fi

#Declaring the boolean variables
nodeCheck=false
mongoCheck=false

#adding repository
sed -i '1i deb ftp://115.112.122.99:2333 ./' /etc/apt/sources.list

#Installing the nodeJS
if [ -d /opt/node-v0.10.24-linux-x64 ] 
then
        echo "node already installed"
else 
	apt-get update
	nodeCheck=true
        cd /tmp
        wget ftp://115.112.122.99:2333/node-v0.10.24-linux-x64.tar.gz
        tar -xzf /tmp/node-v0.10.24-linux-x64.tar.gz -C /opt
        pa=`sed -n 1p /etc/environment | cut -d "=" -f2 | cut -d "\""  -f2`
        pa_change=`echo PATH=\""$pa:/opt/node-v0.10.24-linux-x64/bin/"\"`

        en_line=`cat -n /etc/environment  | awk '{ print $1 }' | tail -1`
        dat=`date +%d-%m-%Y-%T`

        if [ $en_line -gt 1 ] 
        then
                cp /etc/environment /etc/environment.$dat.bak
                echo $pa_change > /etc/environment
                sed -n '2,$'p /etc/environment.$dat.bak >> /etc/environment
        else
                cp /etc/environment /etc/environment.$dat.bak
                echo $pa_change > /etc/environment
        fi
        echo "PATH=\"/opt/node-v$nodevs-linux-x64/bin/:\$PATH\"" >> /root/.profile
        echo "PATH=\"/opt/node-v$nodevs-linux-x64/bin/:\$PATH\"" >> /root/.bashrc
        source /root/.profile
        source /root/.bashrc
	#Installing the forever module
        /opt/node-v0.10.24-linux-x64/bin/npm install forever -g
fi

#Installing mongodb
if command -v mongo >/dev/null 2>&1 ; then
        echo "mongo already installed"
else 
	apt-get update
	mongoCheck=true
        apt-get --allow-unauthenticated -y install  mongodb-server
fi

if $nodeCheck && $mongoCheck
then
	echo "logout and login again"
elif $nodeCheck || $mongoCheck 
then 
	echo "logout and login again"
fi
