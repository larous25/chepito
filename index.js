var http    = require('http');
var cheerio = require('cheerio');
var puerto  = process.env.PORT || 3000;
var url = require("url");


/*
 * acciones del servirdor
 */
var servicios = function(req, res){
	var texto = "here";
	res.writeHead({'Content-Type': 'text/plain'});
	llamar('http://www.google.com',texto);
	res.end('hola');
};

/*
 *@param string sitio url de la web que se va a llamar
 *realiza un llamado a la web que se decea
 */
function llamar(sitio,texto){
	var objSitio = url.parse(sitio);
	console.log(objSitio);
	var  options = {
		hostname : objSitio.hostname,
		method : 'GET',
		path:  objSitio.path
	};

	http.request(options,function(resultados){
		console.log('--------------------------------------');
		console.log('llamando a:\n' + options.hostname + '\n con el camino:\n'+options.path);
		console.log('--------------------------------------');
		var completo = '';
		resultados.setEncoding('utf8');
		resultados.on('data',function(data){
			completo += data;
		});
		resultados.on('end',function(data){
			completo += data;
			$ = cheerio.load(completo);
			arbolGenealogico($('body'), texto);
		});
	})
	.end();
}

/*
 * @param string texto una cadena de texto   
 * @param string texto2 otra cadena de texto
 * @function busca la primera cadena de texto dentro de la
 * segunda   
 */
function comparar(texto,texto2){
	var texto1 = new RegExp(texto);
	return texto1.test(texto2);
}

function arbolGenealogico(elemento,texto){
	var aVisitar = [];
	var hijos = elemento.children();
	if(hijos.length>0){
		hijos.each(function(){
			var $selt = $(this);

			console.log($selt.text());
			if(comparar(texto,$selt.text())){
				if($selt[0].name==='a'){
					aVisitar.push($selt.attr('href'));
				}
			}else{
				arbolGenealogico($selt);
			}
		});
	}
	for (var i = 0; i < aVisitar.length; i++) {
		llamar(aVisitar[i],texto);
	}
} 

// creacion del servidor y puesta en marcha
var server = http.createServer(servicios);

server.listen(puerto,function(){
	console.log('---server corriendo en puerto:\t'+puerto+'---');
});