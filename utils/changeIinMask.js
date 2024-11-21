export default (phone) => {
  let text = String(phone).replaceAll(/[\D]+/gi, "");
  let new_text = "";

  new_text = text.substring(0, 12);

  return new_text;
};
