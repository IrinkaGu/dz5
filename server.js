const http = require('http');
const querystring = require('querystring');

const port = 3000;
const host = 'netology.tomilomark.ru';
const path = '/api/v1/hash';

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
	let data = '';
	req.on('data', chunk => data += chunk);
	req.on('end', () => {
		parse_data = parse(data, req.headers['content-type']);
		console.log(`Получены данные: ${parse_data.firstName} ${parse_data.lastName}`);
		
		let data_hash = JSON.stringify({
			'lastName' : parse_data.lastName
		});
		
		let options = {
			hostname: host,
			port: 80,
			path: path,
			method:'POST',
			headers:{
				'Firstname': parse_data.firstName,
				'Content-Type': 'application/json'
				
			}
		}
		
		const request = http.request(options);
		request.write(data_hash);
		request.on('response',handler);
		request.end();
		res.writeHead(200,'OK', {'Content-Type': 'text/plain'});
		let answer = querystring.stringify({
			'Firstname': parse_data.firstName,
			'lastName' : parse_data.lastName,
			'hash':data_hash
		});
		res.write(answer);
		res.end();
	})
})

server.on('listening', () => {
	console.log('Start HTTP on port %d', port);
});

server.listen(port);