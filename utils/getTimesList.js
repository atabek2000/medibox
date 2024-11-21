export default (
  start_available_time,
  end_available_time,
  service_duration,
  start_break_time,
  end_break_time
) => {
  const startHour = Number(start_available_time?.split(":")[0]);
  const endHour = Number(end_available_time?.split(":")[0]);
  const startMinute = Number(start_available_time?.split(":")[1]);
  const endMinute = Number(end_available_time?.split(":")[1]);
  const durationHours = Number(service_duration?.split(":")[0]);
  const durationMinutes = Number(service_duration?.split(":")[1]);
  const breakStartHour = Number(start_break_time?.split(":")[0]);
  const breakStartMinute = Number(start_break_time?.split(":")[1]);
  const breakEndHour = Number(end_break_time?.split(":")[0]);
  const breakEndMinute = Number(end_break_time?.split(":")[1]);

  let times = [];
  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute <= endMinute)
  ) {
    // Проверяем, не попадает ли текущее время в промежуток перерыва
    if (
      (currentHour > breakStartHour ||
        (currentHour === breakStartHour &&
          currentMinute >= breakStartMinute)) &&
      (currentHour < breakEndHour ||
        (currentHour === breakEndHour && currentMinute < breakEndMinute))
    ) {
      // Увеличиваем минуты и часы на указанную продолжительность перерыва
      currentMinute = breakEndMinute;
      currentHour = breakEndHour;
    } else {
      // Форматируем часы и минуты с ведущими нулями
      let formattedHour = String(currentHour).padStart(2, "0");
      let formattedMinute = String(currentMinute).padStart(2, "0");

      // Добавляем текущее время в массив
      times.push(`${formattedHour}:${formattedMinute}`);

      // Увеличиваем минуты и часы на указанную продолжительность
      currentMinute += durationMinutes;
      currentHour += durationHours;

      // Обрабатываем переход на следующий час
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }

    // Прерываем цикл, если достигли конца диапазона
    if (
      currentHour > endHour ||
      (currentHour === endHour && currentMinute > endMinute)
    ) {
      break;
    }
  }

  return times;
};
