export default (phone) => {
  let text = String(phone).replaceAll(/[\D]+/gi, "");
  text = Number(text).toString();
  text = text.split("").reverse().join(""); // Reverse the string
  text = text.replace(/(.{3})/g, "$1 "); // Insert spaces every 3 characters
  text = text.split("").reverse().join(""); // Reverse it back
  text = text.trim(); // Remove leading/trailing spaces
  return text;
};
