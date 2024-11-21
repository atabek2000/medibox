export default (time) => {
  const time_obj = {
    hour: 0,
    minute: 0,
    second: 0,
  };
  if (time) {
    const time_arr = String(time).split(":");
    time_obj.hour = time_arr[0] ?? 0;
    time_obj.minute = time_arr[1] ?? 0;
    time_obj.second = time_arr[2] ?? 0;
  }
  return time_obj;
};
