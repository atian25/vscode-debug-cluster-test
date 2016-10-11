const http = require('http');

console.log('worker process.execArgv', process.execArgv)

http.Server((req, res) => {
  res.writeHead(200);
  res.end('hello world\n');

  // notify master about the request
  process.send({ cmd: 'notifyRequest' });
}).listen(8000);

process.once('exit', code => {
  console.info('[worker] exit with code: %s', code);
});