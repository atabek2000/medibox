export default (date) => {
  const temp_date = new Date(date);
  const time_obj = {
    hour: 0,
    minute: 0,
    second: 0,
    day: 0,
    month: 0,
    year: 0,
    date: new Date(),
  };
  if (temp_date) {
    time_obj.hour = temp_date.getHours();
    time_obj.minute = temp_date.getMinutes();
    time_obj.second = temp_date.getSeconds();
    time_obj.day = temp_date.getDay();
    time_obj.month = temp_date.getMonth();
    time_obj.year = temp_date.getFullYear();
    time_obj.date = temp_date;
  }
  return time_obj;
};
