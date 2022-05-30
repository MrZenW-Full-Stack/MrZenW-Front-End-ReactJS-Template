exports.createQueueWorker = (opt) => {
  opt = opt || {};
  let workerMax = Math.floor(opt.workerMax) || 0;
  let queueLength = Math.floor(opt.queueLength) || 0;
  if (workerMax <= 0) workerMax = 1;
  if (queueLength <= 0) queueLength = 0;

  const queue = [];

  let currentWorking = 0;
  const doTask = () => {
    // log(currentWorking, 'currentWorking');
    if (currentWorking < workerMax) {
      currentWorking += 1;
      const workFunc = queue.pop();
      if (workFunc) {
        let next = doTask;
        workFunc(() => {
          if (next) {
            currentWorking -= 1;
            next();
            next = undefined;
          }
        });
      } else {
        currentWorking -= 1;
      }
    }
  };
  // worker function
  return (task) => {
    if (typeof task !== 'function') {
      throw new Error('The task has to be a function!');
    }
    if (queueLength > 0 && queue.length >= queueLength) {
      throw new Error('The length of the queue has reached the maximum!');
    }
    queue.unshift(task);
    doTask();
    return queue.length;
  };
};
