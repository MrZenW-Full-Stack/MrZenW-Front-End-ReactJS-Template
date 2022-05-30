function capitaliseNameInital(word) {
  return (word + '')
    .replace('-', '_')
    .replace('.', '_')
    .split('_')
    .map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    })
    .join('');
}

exports.capitaliseNameInital = capitaliseNameInital;
