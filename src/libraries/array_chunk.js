module.exports = (array, chunkSize) => {
  chunkSize = parseInt(chunkSize, 10);
  if (!chunkSize || chunkSize <= 0) throw new Error('chunkSize cannot less than zero!');
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};
