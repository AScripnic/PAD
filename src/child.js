const dependencies = process.env.dependencies.split(',').filter(el => el);
const currentTask = process.env.taskName;

function onMessage(data) {
  const { message, taskName } = data;

  if (message !== 'TASK_FINISHED') {
    return null;
  }

  if (dependencies.includes(taskName)) {
    dependencies.splice(dependencies.indexOf(taskName), 1);
  }

  if (!dependencies.length) {
    return executeTask();
  }
}

function executeTask() {
  process.removeListener('message', onMessage);
  console.log(`Task with name ${ currentTask } started at ${ Date.now() }`);

  setTimeout(() => {
    console.log(`Task with name ${ currentTask } finished execution at ${ Date.now() }`);
    process.send({ message: 'TASK_FINISHED', taskName: currentTask });
    process.exit();
  }, 1000 * currentTask);
}


if (!dependencies.length) {
  return executeTask();
}

process.on('message', onMessage);