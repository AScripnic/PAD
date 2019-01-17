const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (!cluster.isMaster) {
  return require('./child');
}

const workers = {};
const tasks = {
  1: {
    await: []
  },
  2: {
    await: []
  },
  3: {
    await: []
  },
  4: {
    await: []
  },
  5: {
    await: [1, 2]
  },
  6: {
    await: [3, 4]
  },
  7: {
    await: [5, 6]
  },
}


Object.keys(tasks).forEach((taskName) => {
  const worker = cluster.fork({ dependencies: tasks[taskName].await, taskName });

  workers[taskName] = worker;

  worker.on('message', (data) => {
    if (data.message === 'TASK_FINISHED') {
      delete workers[data.taskName];
  
      Object.keys(workers).forEach((taskName) => {
        workers[taskName].send(data);
      })
    }
  })
});
