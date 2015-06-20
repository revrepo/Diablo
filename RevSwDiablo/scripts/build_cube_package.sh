#!/bin/bash 
#Maintainer: sudheerkumarms <sudheer.mandala@techvedika.com>

######## Installing the git ############################################################################

apt-get install git
dat=`date +%Y_%m_%d_%H_%M_%S`
#########################################################################################################
######### Entering into home directory and Creating the directory with the name "GitFolder" #############                                                                                               
cd ~
mkdir $1'_'cube_$dat && cd $1'_'cube_$dat

#########################################################################################################
############################# Providing Version Number for downloading from git #########################

#read -p "gitversion: " gitversion(need to changed the gitversion based on the requirement)
git clone -b 3.0 --single-branch https://gitusername:gitpassword@github.com/techvedika-dev/RevSwDiablo

########################################################################################################

foldername=revsw-cube_$1
mkdir -p $foldername/DEBIAN
touch $foldername/DEBIAN/control

PackageName=revsw-cube
PackageVersion=$1
MaintainerName=sudheer
MaintainerEmail=sudheer.mandala@techvedika.com


echo "Package: $PackageName
Version: $PackageVersion
Architecture: amd64
Maintainer: $MaintainerName <$MaintainerEmail>
Installed-Size: 26
Recommends: Mongodb
Section: unknown
Priority: extra
Homepage: <www.techvedika.com>
description: <installing Cube package>
             <Using this package you will install cube server>" >> $foldername/DEBIAN/control


cp -rf  ~/$1'_'cube_$dat/RevSwDiablo/cube_etc  ~/$1'_'cube_$dat/$foldername/etc

mkdir -p $foldername/opt/$PackageName  ~/$1'_'cube_$dat/$foldername/opt/$PackageName/log

cp -rf  ~/$1'_'cube_$dat/RevSwDiablo/cube/*  ~/$1'_'cube_$dat/$foldername/opt/$PackageName/

rm -rf ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/*

cp -rf ~/$1'_'cube_$dat/RevSwDiablo/cube/bin/collector.js ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/
cp -rf ~/$1'_'cube_$dat/RevSwDiablo/cube/bin/evaluator.js ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/
cp -rf ~/$1'_'cube_$dat/RevSwDiablo/nodejs_only_v1.1.sh ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/
cp -rf ~/$1'_'cube_$dat/RevSwDiablo/cube/bin/collector-config.js ~/$1'_'cube_$dat/$foldername/opt/$PackageName/config/collector-config.js.def
cp -rf ~/$1'_'cube_$dat/RevSwDiablo/cube/bin/evaluator-config.js ~/$1'_'cube_$dat/$foldername/opt/$PackageName/config/evaluator-config.js.def
mv ~/$1'_'cube_$dat/$foldername/opt/$PackageName/config/config.js ~/$1'_'cube_$dat/$foldername/opt/$PackageName/config/config.js.def
sed -i 's/\.\/collector-config/\.\.\/config\/collector-config/g' ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/collector.js
sed -i 's/\.\/evaluator-config/\.\.\/config\/evaluator-config/g' ~/$1'_'cube_$dat/$foldername/opt/$PackageName/bin/evaluator.js

dpkg -b ~/$1'_'cube_$dat/$foldername 

rm -rf ~/$1'_'cube_$dat/RevSwDiablo  ~/$1'_'cube_$dat/$foldername/

#Transfering files to ftp
ftp_add="ftpdetails"
username="ftpusername"
pass='ftppassword'


cd ~/cube_$dat/

ftp -n $ftp_add 2333 <<FTP-Session
user $username $pass
binary
mkdir /home/revsw/RevSw_Build/$1_cube_$dat
cd /home/revsw/RevSw_Build/$1_cube_$dat
put $foldername.deb 
bye
FTP-Session



