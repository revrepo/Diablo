#!/bin/bash 
#Maintainer: sudheerkumarms <sudheer.mandala@techvedika.com>

######## Installing the git ############################################################################

apt-get install git
dat=`date +%Y_%m_%d_%H_%M_%S`
#########################################################################################################
######### Entering into home directory and Creating the directory with the name "GitFolder" #############                                                                                               
cd ~
mkdir $1'_'rum_$dat && cd $1'_'rum_$dat
#########################################################################################################
############################# Providing Version Number for downloading from git #########################

#read -p "gitversion: " gitversion(need to changed the gitversion based on the requirement)
git clone -b 3.0 --single-branch https://gituser:gitpassword@github.com/techvedika-dev/RevSwDiablo

########################################################################################################

foldername=revsw-rum_$1
mkdir -p $foldername/DEBIAN
touch $foldername/DEBIAN/control

PackageName=revsw-rum
PackageVersion=$1
MaintainerName=sudheer
MaintainerEmail=sudheer.mandala@techvedika.com

echo "Package: $PackageName
Version: $PackageVersion
Architecture: amd64
Maintainer: $MaintainerName <$MaintainerEmail>
Installed-Size: 26
Section: unknown
Priority: extra
Homepage: <www.techvedika.com>
Description: <installing rum package>" >> $foldername/DEBIAN/control


cp -rf  ~/$1'_'rum_$dat/RevSwDiablo/rum_etc  ~/$1'_'rum_$dat/$foldername/etc

mkdir -p $foldername/opt/$PackageName

cp -rf  ~/$1'_'rum_$dat/RevSwDiablo/BoomerangService  ~/$1'_'rum_$dat/$foldername/opt/$PackageName/

cp -rf ~/$1'_'rum_$dat/RevSwDiablo/config ~/$1'_'rum_$dat/$foldername/opt/$PackageName/

mkdir -p ~/$1'_'rum_$dat/$foldername/opt/$PackageName/bin  ~/$1'_'rum_$dat/$foldername/opt/$PackageName/log

cp -rf ~/$1'_'rum_$dat/RevSwDiablo/nodejs_only_v1.1.sh ~/$1'_'rum_$dat/$foldername/opt/$PackageName/bin/

mv ~/$1'_'rum_$dat/$foldername/opt/$PackageName/config/config.js ~/$1'_'rum_$dat/$foldername/opt/$PackageName/config/config.js.def

mv ~/$1'_'rum_$dat/$foldername/opt/$PackageName/BoomerangService/node_modules/cube/bin/collector-config.js ~/$1'_'rum_$dat/$foldername/opt/$PackageName/BoomerangService/node_modules/cube/bin/collector-config.js.def

mv ~/$1'_'rum_$dat/$foldername/opt/$PackageName/BoomerangService/node_modules/cube/bin/evaluator-config.js ~/$1'_'rum_$dat/$foldername/opt/$PackageName/BoomerangService/node_modules/cube/bin/evaluator-config.js.def

rm ~/$1'_'rum_$dat/$foldername/opt/$PackageName/BoomerangService/settings.js

dpkg -b  ~/$1'_'rum_$dat/$foldername/ 

rm -rf ~/$1'_'rum_$dat/RevSwDiablo  ~/$1'_'rum_$dat/$foldername

#Transfering files to ftp
ftp_add="ftpdetails"
username="ftpuser"
pass='ftppasswd'


cd ~/$1_rum_$dat/

ftp -n $ftp_add 2333 <<FTP-Session
user $username $pass
binary
mkdir /home/revsw/RevSw_Build/$1_rum_$dat
cd /home/revsw/RevSw_Build/$1_rum_$dat
put $foldername.deb 
bye
FTP-Session




