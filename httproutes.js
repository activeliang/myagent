/**
 * 这个文件提供直接访问代理服务器时的一些接口
 */

var routes = {
	'/host/update': function(){},
	'/host/add': function(){},
	'/host/list': function(){},
	'/adapter/list': function(){},
	'/proxy.pac': function(req, resp){
		resp.setHeader('Content-Type', 'application/x-ns-proxy-autoconfig');
	}
};

exports.onRequest = onRequest;

function onRequest(req, resp) {
	var parts = url.parse(req.url, true);
	var router = parts.pathname.toLowerCase();
	req.query = parts.query;
	if(routes.hasOwnProperty(router)) {
		try {
			routes[router](req, resp);
		} catch(e) {
			resp.writeHead(500);
			resp.end(e.message);
		}
	} else {
		resp.writeHead(404);
		resp.end("Page Not Found");
	}
}