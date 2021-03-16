import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

import DateTimePicker from "react-datetime-picker";

export default forwardRef((props, ref) => {
  const [selectedDate, setSelectedDate] = useState(null);

  function handleDateChange(d) {
    if (d) {
      d = new Date(d);
      setSelectedDate(d);
    } else {
      setSelectedDate(null);
    }
  }

  useEffect(props.onDateChanged, [selectedDate]);

  useImperativeHandle(ref, () => {
    return {
      getDate: () => {
        return selectedDate;
      },
      setDate: d => {
        handleDateChange(d);
      }
    };
  });

  return (
    <>
      <DateTimePicker
        onChange={handleDateChange}
        value={selectedDate}
        maxDetail="second"
        disableCalendar={true}
        disableClock={true}
      />
    </>
  );
});
