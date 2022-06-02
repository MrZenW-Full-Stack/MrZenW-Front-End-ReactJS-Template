/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:13:27
 * @modify date 2021-07-02 16:20:36
 * @desc [description]
 */
const adjectiveList = [
  'Active', 'Adorable', 'Gentle', 'Modest', 'Clever', 'Cheerful', 'Considerate',
  'Courageous', 'Brave', 'Creative', 'Cultured', 'Disciplined', 'Energetic',
  'Expressive', 'Friendly', 'Frank', 'Kind', 'Outgoing', 'Polite', 'Pushy', 'Selfless',
  'Talented', 'Thoughtful', 'Understanding', 'Upright',
];
const nounList = [
  'Fox', 'Dog', 'Yak', 'Tiger', 'Horse', 'Mouse', 'Rabbit', 'Bear',
  'Marmot', 'Monkey', 'Koala', 'Kangaroo', 'KiwiBird', 'Deer',
  'Giraffe', 'Elephant', 'Unicorn', 'Cat', 'Chick', 'Wolf', 'Fish',
  'Seal', 'Shark', 'Leopard',
];

const allNiceNamePool = adjectiveList.reduce((acc, curr) => {
  return [].concat(acc, nounList.map((nounCurr) => {
    return curr + '_' + nounCurr;
  }));
}, []);

exports.allNiceNamePool = allNiceNamePool;

exports.getNiceName = () => {
  return allNiceNamePool[(Math.random() * allNiceNamePool.length) | 0];
};
