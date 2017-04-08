const http = require('http');
const port = 3000;
const url = 'http://netology.tomilomark.ru/api/v1/hash';

function parse(data, type){
	switch (type){
		case 'application/json':
			data = JSON.parse(data);
			break;
		case 'application/x-www-form-urlencoded':
			data = querystring.parse(data);	
			break;			
	}
	return data;
}

function handler(response){
	let data = '';
	response.on('data',function(chunk){
		data += chunk;
	});
	
	response.on('end', function (){
		console.log(data);
	});
}

let server = http.createServer();
server.on('error', err=>console.error(err));

server.on('request', (req, res) => {
	/*const request = http.request(url);
	request.on('response',handler);
	request.end();*/
	
	let data = '';
	req.on('data', chunk => data += chunk);
	req.on('end', () => {
		parse_data = parse(data, req.headers);
		//Перевести данные в читаемый вид
		console.log(`Получены данные: ${data}`);
		res.writeHead(200,'OK', {'Content-Type': 'text/plain'});
		res.write(data);
		res.end();
	})
})

server.on('listening', () => {
	console.log('Start HTTP on port %d', port);
});

server.listen(port);