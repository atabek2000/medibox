export default (number) => {
  const str = String(number).replace(" ", "").replace("-", "");
  const last = str.slice(-4);
  return last.padStart(str.length, "*");
};
