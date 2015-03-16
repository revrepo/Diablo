module.exports = {
	service: {
		url: "ec2-54-187-44-141.us-west-2.compute.amazonaws.com",
		https_port:443,
		http_port:80,
		nonce_validate_time:100,
		nonce: false
	},
	is_multiple_collectors: false,
	is_https: true,
	key_path : '/etc/ssl/revsw/revsw.net.key',
	cert_path : '/etc/ssl/revsw/revsw.net.crt',
	ca_path : '/etc/ssl/revsw/gd_bundle-g2.crt',
	cube:[{
		protocol:"ws",domain:"localhost",port:"1080", client : null
	}]
};
