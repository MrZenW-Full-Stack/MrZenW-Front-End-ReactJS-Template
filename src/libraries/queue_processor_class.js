/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:32
 * @modify date 2021-05-25 13:13:32
 * @desc [description]
 */
function QueueVariable(queue, opts) {
  if (Array.isArray(queue)) {
    this.queue = Array.from(queue);
  } else if (queue) {
    this.queue = [queue];
  } else {
    this.queue = [];
  }
  this.opts = Object.assign({}, {
    maximum: 100,
  }, opts || {});
  return this;
}

QueueVariable.prototype.push = function (variable) {
  if (this.queue.length === this.opts.maximum) this.pick();
  return this.queue.unshift(variable);
};

QueueVariable.prototype.pick = function () {
  return this.queue.pop();
};

QueueVariable.prototype.queueLength = function () {
  return this.queue.length;
};

QueueVariable.prototype.discard = function () {
  this.queue.splice(0);
};

function QueueProcessorClass(processor, queue, queueOpts) {
  if (typeof processor !== 'function') throw new Error('Processor need to be a function, but got a ' + (typeof processor));
  this._isDiscarded = false;
  this.processor = processor;
  this.queue = new QueueVariable(queue, Object.assign({
    maximum: 5,
  }, queueOpts || {}));
  this._isPicking = false;
  this._nextProcessBoundThis = this._nextProcess.bind(this);
  return this;
}
QueueProcessorClass.QueueVariable = QueueVariable;
QueueProcessorClass.prototype._nextProcess = function () {
  if (this._isDiscarded) return;
  const pickedVariable = this._pick();
  if (pickedVariable[0]) {
    this._isPicking = true;
    this.processor(pickedVariable[1], this._nextProcessBoundThis);
  } else {
    this._isPicking = false;
  }
};

QueueProcessorClass.prototype.push = function (v) {
  this.queue.push(v);
  if (this._isPicking === false) {
    setTimeout(this._nextProcessBoundThis, 0);
  }
};

QueueProcessorClass.prototype._pick = function () {
  if (this.queue.queueLength() === 0) {
    return [false];
  } else {
    return [true, this.queue.pick()];
  }
};

QueueProcessorClass.prototype.discard = function () {
  this._isDiscarded = true;
  this.queue.discard();
};
exports.QueueProcessorClass = QueueProcessorClass;
