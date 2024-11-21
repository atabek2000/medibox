export default (date, time) => {
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    const [year, month, day] = date.split("-").map(Number);
    const past_time = new Date();
    past_time.setHours(hours, minutes, 0, 0);
    past_time.setFullYear(year, month - 1, day);
    console.log(past_time);

    const current_time = new Date();

    return current_time > past_time;
  } else {
    return false;
  }
};
