export default (price) => {
  const formatted = new Intl.NumberFormat("kz-KZ", {
    maximumFractionDigits: 2,
  }).format(price);

  return formatted + " ₸";
};
