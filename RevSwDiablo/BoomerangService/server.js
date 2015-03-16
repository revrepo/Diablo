/**
* Description: This is a service for BeaconURL
* Author: Rev Software
*/

// For Collector Bridge
var collectorBridge = require("./collector_bridge");
// Settings 
var settings = require("./settings");

//loading the geoip module
var geoip = require('geoip-lite');
// Url node module
var url = require('url');
// Cube node module
var cube = require("cube");
// Http node module
var http = require('http');
var https = require('https');
var fs = require('fs');
// Router node module
var router = require('router');
var route = router();
//getting the MD5 module
var md5 = require("MD5");
var rand = 0;

//for cluster
var cluster = require('cluster');

var numCPUs = require('os').cpus().length;

/**
*Md5 key generation
*/
var authkey = function(){
	var salt = "aokimartxdzkvyiesztiizoigz";
	var inputtext = "revswtechv";
	var time = Math.floor(new Date().getTime()/1000/settings.service.nonce_validate_time);
	var token = time+inputtext+salt;
	return token;
}

// open socket connection of single/multiple cubes
function openCubeConnection(){
	if(settings.is_multiple_collectors){
		var no_of_cubes = settings.cube.length;
		for( i=0;i<no_of_cubes;i++){
			cube_url = settings.cube[i].protocol+"://"+settings.cube[i].domain+":"+settings.cube[i].port;
			settings.cube[i].client = cube.emitter(cube_url);	
		}
	}else{
		cube_url = settings.cube[0].protocol+"://"+settings.cube[0].domain+":"+settings.cube[0].port;
		settings.cube[0].client = cube.emitter(cube_url);
	}
}
//Initiating the connection to be opened for all cube url's
openCubeConnection();


//Validating the Input request
function validate_pl_info_Request(params){

        var flag = true;
        if(params.hasOwnProperty("nt_dns_end") &&
                params.hasOwnProperty("nt_dns_st") && params.hasOwnProperty("nt_red_end") &&
                params.hasOwnProperty("nt_red_st") && params.hasOwnProperty("nt_con_end") &&
                params.hasOwnProperty("nt_con_st") && params.hasOwnProperty("nt_res_end") &&
                params.hasOwnProperty("nt_res_st") && params.hasOwnProperty("nt_load_end") &&
                params.hasOwnProperty("nt_load_st") && params.hasOwnProperty("nt_domcontloaded_end") &&
                params.hasOwnProperty("nt_domloading") && params.hasOwnProperty("nt_nav_st") ){
                flag = true;
        }else{
                return false;
        }
        Object.keys(params).forEach(function(key){
                var value = params[key];
                if(key=="nt_dns_end" ||
                        key =="nt_dns_st" || key=="nt_red_end" ||
                        key=="nt_red_st" || key == "nt_con_end" ||
                        key=="nt_con_st" || key=="nt_res_end" ||
                        key=="nt_res_st" || key=="nt_load_end" ||
                        key=="nt_load_st" || key=="nt_domcontloaded_end" ||
                        key=="nt_domloading" || key=="nt_nav_st" ){
                        if(isNaN(parseInt(value))){
                                flag = false;
                                return;
                        }
                }

        });
        return flag;
}

function validate_nt_info_Request(params){
	var flag = true;
	if(params.hasOwnProperty("t_resp") && params.hasOwnProperty("t_done")){
                flag = true;
        }else{
                return false;
        }
	Object.keys(params).forEach(function(key){
                var value = params[key];
                if(key=="t_resp" || key =="t_done" ){
                        if(isNaN(parseInt(value))){
                                flag = false;
                                return;
                        }
                }

        });
        return flag;
}

//Validating the deviceType
var deviceType =  function(value){
   var iPhonep = /iPhone;/i;
   var iPodp = /iPod;/i; 
   var iPodp1 = /iPod/i;
   var iPadp = /iPad;/i; 
   var androidp = /Android/i;
   var windowsp = /Windows Phone/i;
   var iosChrome = /CriOS/i;
   var fireFox = /Firefox/i;
   var chrome = /Chrome/i;	        
   var safari = /Safari/i;	        
   var ie = /Trident/i;	        

   if(iPhonep.test(value) || iPodp.test(value) || iPodp1.test(value) || iPadp.test(value)){
        if(iosChrome.test(value)){
                return "ios-chrome";
        }else{
                return "ios-safari";
        }
   }else if(androidp.test(value)){
        if(fireFox.test(value)){
                return "android-firefox";
        }else if(chrome.test(value)){
                return "android-chrome";
        }else{
                return "android";
        }
   }else if(windowsp.test(value)){
        return "windows-phone";
   }else if(chrome.test(value)){
        return "chrome";
   }else if(fireFox.test(value)){
        return "firefox";
   }else if(safari.test(value)){
        return "safari";
   }else if(ie.test(value)){
        return "ie";
   }else{
	return "others";
   }
}


//Sending data to cube
var cubeSend = function(object,client){

	var loc = '';
	var reg = '';
	var cty = '';
	//Validating the ipaddress and getting the geography value
	if(object.data.user_ip && object.data.user_ip != undefined ){
		var geoJson = geoip.lookup(object.data.user_ip);
	        loc=geoJson.country;
		reg=geoJson.region;
		cty=geoJson.city;
	}
	//Adding the domain to object
	if(object.data.u){
		object.data.domain = object.data.u.split('//')[1].split('/')[0];
	}
	//Adding the geography to object
	if(loc && loc != undefined){
		object.data.geography = loc;
	}	
	//Adding the region to object				
	if(reg && reg != undefined){
		object.data.region = reg;
	}
	//Adding the region to object				
	if(cty && cty != undefined){
		object.data.city = cty;
	}
	client.send(object);
}

/**
* HTTP GET for BeaconURL data
*/
route.get('/service', function(request, response) {

	//Getting the user-agent info
	 var device = deviceType(request.headers['user-agent']);
	
	// parsing request url	
	var url_parts = url.parse(request.url, true);

	// get query data from parsed requested url
	var query = url_parts.query;
	console.log("QUERY",query);	
	var nonce_value = true;
	
	if (settings.service.nonce){
		if(query.hasOwnProperty("nonce")){
			if(query.nonce === md5(authkey())){
				nonce_value = true;
			}else{
				nonce_value = false;
			}
		}else{
			nonce_value = false;
		}
	}
	
	if(nonce_value){

		if(settings.is_multiple_collectors){
                        console.log("Randome value:",Math.random());
                        rand = Math.ceil((Math.random()*settings.cube.length)-1);
                        if(rand < 0){
                                rand = 1;
                        }else if(rand >settings.cube.length ){
                                rand = settings.cube.length;
                        }
                }
		console.log("RANDOM : ", rand);
		var cube_url = settings.cube[rand].protocol+"://"+settings.cube[rand].domain+":"+settings.cube[rand].port;
		console.log("CUBE URL :", cube_url);
		var client = settings.cube[rand].client


		/**
		* if nt = 0 we will need to extract the Navigation timing parameters
		*/
		
		// Based on query string here we are generating a dynamic JSON object for cube to send	
		var pl_object = {};
		var nw_object = {};
		var send_object = null;
		var pl_pattern = /^nt_/
		var rt_pattern = /^rt./
		var bw_pattern = /^bw_/
		
		// Iterating keys from query string, and adding each key w.r.t the JSON
		Object.keys(query).forEach(function(key){
			
			var k1 = key.match(pl_pattern);
			var k2 = key.match(bw_pattern);
			var k3 = key.match(rt_pattern);
			var k4 = key.match(/^t_/);
			if(k1){
				pl_object[key] = parseInt(query[key])
			}
			if(k3){
				var replace_key = key.replace("rt.","rt_");
				nw_object[replace_key] = parseInt(query[key])
			}
			if(k2){
				pl_object[key] = parseInt(query[key])
				nw_object[key] = parseInt(query[key])
			}
			if(k4){
				nw_object[key] = query[key]
			}
			if(key=="r"){
				nw_object[key] = parseInt(query[key])
			}
			if(key=="nt"){
				pl_object[key] = parseInt(query[key])
				nw_object[key] = parseInt(query[key])
			}
			if(key=="v" || key =="u" ||  key =="user_ip"){
				pl_object[key] = query[key]
				nw_object[key] = query[key]

			}
			if(key=="lat" || key=="lat_err"){
				nw_object[key] = query[key]
			}
		});
		send_object = {}	
		send_object.time = new Date();
		send_object.type = "pl_info";

		if(query.nt==1){
			var dns = query.nt_dns_end - query.nt_dns_st;
	
			var redirect = query.nt_red_end - query.nt_red_st; // Redirect Time
	
			var tcp = query.nt_con_end - query.nt_con_st; // Connection Time
	
			var ssl = 0

			var basePageDownload = query.nt_res_end - query.nt_res_st; // Response Time
	
			var browser = query.nt_load_st - query.nt_res_end; // Navigation Time
	
			var dom = query.nt_domcontloaded_end - query.nt_domloading; // DOM Time
	
			var pageLoad = query.nt_load_st - query.nt_nav_st; //Total Time
	
			if(query.nt_load_end != 0){
				  pageLoad = query.nt_load_end - query.nt_nav_st;
			}
			
			var serverConnect = dns + redirect + tcp + ssl;
			
			var networkTime = serverConnect + basePageDownload; // Network Time
			
			var backendTime = query.nt_res_st - query.nt_req_st; //Backend Time
					
			pl_object.browserTime = browser;
			pl_object.networkTime = networkTime;
			pl_object.backendTime = backendTime;
			pl_object.pageloadTime = pageLoad;
			pl_object.fbTime = query.nt_res_st - query.nt_con_end ;
			send_object.data = pl_object;
		}
		

		if(query.nt==0){
			send_object.data = nw_object
			
			//Adding the device type to object
               		send_object.data.device = device;

			if(validate_nt_info_Request(send_object.data)){
				if(parseInt(send_object.data.t_done) > parseInt(send_object.data.t_resp)){
					send_object.data.backendTime =  parseInt(send_object.data.t_resp);
					send_object.data.browserTime =  parseInt(send_object.data.t_done) - parseInt(send_object.data.t_resp);
					send_object.data.pageloadTime = parseInt(send_object.data.t_done);
					send_object.data.fbTime = parseInt(send_object.data.t_resp);
					cubeSend(send_object,client);
				}
			}
		}
		
		if(query.nt==1){
	                if(validate_pl_info_Request(send_object.data)){
	                	
				//Adding the device type to object
               			send_object.data.device = device;

				cubeSend(send_object,client);
	                }
		}
	}


	response.end();
});

var run_http_server = function(){
        console.log("Came in to the HTTP");
        http.createServer(route).listen(settings.service.http_port, settings.service.url);
        console.log("BECON URL LISTENING ON http://"+settings.service.url+":"+settings.service.http_port);
}

//for opening multiple clusters
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
	//Creating server which listen port to the given domain or ip
	if(settings.is_https != undefined && settings.is_https){
		console.log("Came in to the HTTPS");
		var options = {};
		if(settings.key_path != undefined && settings.key_path !='' && settings.cert_path != undefined && settings.cert_path != '' && settings.ca_path !='' && settings.ca_path != undefined) {
			options.key = fs.readFileSync(settings.key_path);
			options.cert = fs.readFileSync(settings.cert_path);
			options.ca = fs.readFileSync(settings.ca_path)
			https.createServer(options,route).listen(settings.service.https_port, settings.service.url);
	                run_http_server();
			console.log("BECON URL LISTENING ON https://"+settings.service.url+":"+settings.service.https_port);
		}else{
			run_http_server();
		}
	} else{
		run_http_server();
	}
}

