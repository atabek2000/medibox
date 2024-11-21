export default (phone) => {
  let text = String(phone).replaceAll(/[\D]+/gi, "");
  text = text.replace(/(.{4})/g, "$1 ");
  text = text.trim();
  if (text.length > 19) {
    text = text.slice(0, 19);
  }

  return text;
};
