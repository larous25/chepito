var http     = require('http');
var cheerio  = require('cheerio');
var texto1   = 'texto';  

var servicios = function(req, res){
	res.writeHead({'Content-Type': 'text/plain'});
	llamar('www.google.com');
	res.end('hola');
};

function llamar(sitio){
	
	var  options = {
		hostname : sitio,
		method : 'GET',
		path: '/'
	};

	var reqs = http.request(options,function(resultados){
		var completo = '';
		resultados.setEncoding('utf8');
		resultados.on('data',function(data){
			completo += data;
		});
		resultados.on('end',function(data){
			completo += data;
			$ = cheerio.load(completo);
			console.log(completo);
			arbolGenealogico($('body'));
		});
	});
	reqs.end();
};

function comparar(texto,texto2){
	var texto1 = new RegExp(texto);
	return texto1.test(texto2);
};

function arbolGenealogico(elemento){
	var google = 'google';
	var hijos = elemento.children();
	if(hijos.length>0){
		hijos.each(function(){
			var $selt = $(this);
			console.log(this.tagName);
			if(comparar(google,$selt.text())){
				console.log(this.innerHTML+'winner');
			}else{
				console.log($selt.text());
				arbolGenealogico($selt);
			}
		});
	}
}; 

var server = http.createServer(servicios);

server.listen(3000);