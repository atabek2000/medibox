export default (inputDate) => {
  const { t } = useI18n();
  if (!inputDate) inputDate = new Date().toLocaleDateString("sv-SE");
  const parts = inputDate.split("-");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // Get the month name based on the month number (adjusted for zero-based index)
  const monthName = t(`month_names.${parseInt(month, 10)}`);

  // Return the formatted date string
  return `${day} ${monthName} ${year}`;
};
