const cfork = require('cfork');
const childprocess = require('child_process');

cfork({
  exec: './worker.js',
  // slaves: ['/your/app/slave.js'],
  count: 1,
  refork: false,
})
  .on('fork', function (worker) {
    console.warn('[%s] [worker:%d] new worker start', Date(), worker.process.pid);
  })
  .on('disconnect', function (worker) {
    console.warn('[%s] [master:%s] wroker:%s disconnect, suicide: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.suicide, worker.state);
  })
  .on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('worker %s died (code: %s, signal: %s, suicide: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.suicide, worker.state));
    err.name = 'WorkerDiedError';
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid, err.stack);
  })

  // if you do not listen to this event
  // cfork will output this message to stderr
  .on('unexpectedExit', function (worker, code, signal) {
    // logger what you want
  });

// if you do not listen to this event
// cfork will listen it and output the error message to stderr
process.on('uncaughtException', function (err) {
  // do what you want
});

// -===========
cfork({
  exec: './agent.js',
  // slaves: ['/your/app/slave.js'],
  count: 1,
  refork: false,
})
  .on('fork', function (worker) {
    console.warn('[%s] [agent:%d] new agent start', Date(), worker.process.pid);
  })
  .on('disconnect', function (worker) {
    console.warn('[%s] [master:%s] agent:%s disconnect, suicide: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.suicide, worker.state);
  })
  .on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('agent %s died (code: %s, signal: %s, suicide: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.suicide, worker.state));
    err.name = 'WorkerDiedError';
    console.error('[%s] [master:%s] agent exit: %s', Date(), process.pid, err.stack);
  })

  // if you do not listen to this event
  // cfork will output this message to stderr
  .on('unexpectedExit', function (worker, code, signal) {
    // logger what you want
  });
// const agentWorker = childprocess.fork('./agent.js', [], { execArgv: process.execArgv.concat([ '--debug-port=5856' ]) });