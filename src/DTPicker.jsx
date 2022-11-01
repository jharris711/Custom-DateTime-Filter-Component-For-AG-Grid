import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';

export default forwardRef((props, ref) => {
  const [date, setDate] = useState(null);
  const [picker, setPicker] = useState(null);
  const refFlatPickr = useRef(null);
  const refInput = useRef(null);

  const onDateChanged = (selectedDates) => {
    setDate(selectedDates[0]);
    props.onDateChanged();
  };

  useEffect(() => {
    setPicker(
      flatpickr(refFlatPickr.current, {
        onChange: onDateChanged,
        // dateFormat: 'Z',
        wrap: true,
        enableTime: true,
        enableSeconds: true,
      })
    );
  }, []);

  useEffect(() => {
    if (picker) {
      picker.calendarContainer.classList.add('ag-custom-component-popup');
    }
  }, [picker]);

  useEffect(() => {
    if (picker) {
      picker.setDate(date);
    }
  }, [date, picker]);

  useImperativeHandle(ref, () => ({
    getDate() {
      return date;
    },

    setDate(date) {
      setDate(date);
    },

    setInputPlaceholder(placeholder) {
      if (refInput.current) {
        refInput.current.setAttribute('placeholder', placeholder);
      }
    },

    setInputAriaLabel(label) {
      if (refInput.current) {
        refInput.current.setAttribute('aria-label', label);
      }
    },
  }));

  return (
    <div
      className="ag-input-wrapper custom-date-filter"
      role="presentation"
      ref={refFlatPickr}
    >
      <input type="text" ref={refInput} data-input style={{ width: '100%' }} />
      <a className="input-button" title="clear" data-clear>
        <i className="fa fa-times"></i>
      </a>
    </div>
  );
});
