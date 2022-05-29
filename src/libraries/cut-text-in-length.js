exports.cutTextInLength = (text, length, spacehooder) => {
  if (!text) return '';
  spacehooder = spacehooder || '...';
  if (text.length > (length - spacehooder.length)) {
    return text.substr(0, length) + spacehooder;
  }
  return text;
};
