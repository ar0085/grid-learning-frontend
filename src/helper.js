export const createDummyObj = (n, m) => {
  const obj = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      obj[`status-${i}-${j}`] = "Unmarked";
    }
  }
  return obj;
};
