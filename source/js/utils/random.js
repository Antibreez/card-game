export const getShuffledArr = (arr) => {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};
