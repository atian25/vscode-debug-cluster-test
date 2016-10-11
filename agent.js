const http = require('http');

console.log('agent process.execArgv', process.execArgv)

http.Server((req, res) => {
  res.writeHead(200);
  res.end('hello world\n');

  // notify master about the request
  process.send({ cmd: 'notifyRequest' });
}).listen(8001);

// kill agent worker
process.once('exit', code => {
  console.info('[agent] exit with code: %s', code);
});