module.exports = (array, copy) => {
  if (copy) array = Array.from(array);
  for (let idx = 0; idx < array.length; idx += 1) {
    const swapIdx = (Math.random() * array.length) | 0;
    [array[swapIdx], array[idx]] = [array[idx], array[swapIdx]];
  }
  return array;
};
