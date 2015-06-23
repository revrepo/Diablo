#!/bin/bash 

#
# This script builds Rev CUBE service Debian package
#

if [ -z "$WORKSPACE" ]; then
	echo "ERROR: WORKSPACE env. variable is not set"
	exit 1
fi

if [ -z "$BUILD_NUMBER" ]; then
	echo "ERROR: BUILD_NUMBER env. variable is not set"
	exit 1
fi

VERSION=3.0.$BUILD_NUMBER

CODEDIR=RevSwDiablo/cube

if [ ! -d $CODEDIR ]; then
	echo "ERROR: Cannot find directory $CODEDIR"
	echo "ERROR: Please run the script from the top of Portal repo clone directory"
	exit 1
fi

dat=`date +%Y_%m_%d_%H_%M_%S`

WORKDIR=revsw-cube'_'$VERSION'_'$dat 
mkdir $WORKDIR
cd $WORKDIR


foldername=revsw-cube'_'$VERSION
mkdir -p $foldername/DEBIAN
touch $foldername/DEBIAN/control

PackageName=revsw-cube
PackageVersion=$VERSION
MaintainerName="Victor Gartvich"
MaintainerEmail=victor@revsw.com

echo "Package: $PackageName
Version: $PackageVersion
Architecture: amd64
Maintainer: $MaintainerName <$MaintainerEmail>
Installed-Size: 26
Section: unknown
Priority: extra
Homepage: www.revsw.com
Description: Rev CUBE Service" >> $foldername/DEBIAN/control

mkdir -p $foldername/etc/init.d  $foldername/etc/logrotate.d

cp -rp $WORKSPACE/scripts/revsw-cube  $foldername/etc/init.d/revsw-cube

cp -rp $WORKSPACE/RevSwDiablo/cube/config/logrotate_revsw-cube $foldername/etc/logrotate.d/revsw-cube

mkdir -p $foldername/opt/$PackageName 

cp -rf  $WORKSPACE/RevSwDiablo/cube/*  $foldername/opt/$PackageName/

mkdir -p $foldername/opt/$PackageName/log

dpkg -b $foldername $foldername.deb

