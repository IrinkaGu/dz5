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
		request.on('response', (response) => {
			let data = '';
			response.on('data', chunk => data += chunk);
			
			response.on('end', function (){
				let hash = parse(data, 'application/json');
				console.log(`Секретный ключ:${hash.hash}`);
				res.writeHead(200,'OK', {'Content-Type': 'application/json'});
				let answer = JSON.stringify({
					'firstName': parse_data.firstName,
					'lastName' : parse_data.lastName,
					'secretKey': hash.hash
				});
				res.write(answer);
				res.end();
			});
		});
		request.end();
	})
})

server.on('listening', () => {
	console.log('Start HTTP on port %d', port);
});

server.listen(port);