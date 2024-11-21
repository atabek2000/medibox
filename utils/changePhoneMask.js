export default (phone) => {
  let text = String(phone).replaceAll(/[\D]+/gi, "");
  let new_text = "+7";

  if (text.length > 11) {
    new_text +=
      " (" +
      text.substring(1, 4) +
      ") " +
      text.substring(4, 7) +
      "-" +
      text.substring(7, 9) +
      "-" +
      text.substring(9, 11);
  } else if (text.length > 9) {
    new_text +=
      " (" +
      text.substring(1, 4) +
      ") " +
      text.substring(4, 7) +
      "-" +
      text.substring(7, 9) +
      "-" +
      text.substring(9);
  } else if (text.length > 7) {
    new_text +=
      " (" +
      text.substring(1, 4) +
      ") " +
      text.substring(4, 7) +
      "-" +
      text.substring(7);
  } else if (text.length > 4) {
    new_text += " (" + text.substring(1, 4) + ") " + text.substring(4, 7);
  } else if (text.length >= 2) {
    new_text += " (" + text.substring(1, 4);
  }

  return new_text;
};
