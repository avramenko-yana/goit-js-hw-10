import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let timerId = null;

const startBtn = document.querySelector('[data-start]');
const datePickerInput = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  closeOnSelect: true,  
  onClose(selectedDates) { 
    const selectedDate = selectedDates[0];
    const now = new Date();  

    if (selectedDate <= now) {
       
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true; 
      userSelectedDate = null;  
    } else {
      
      userSelectedDate = selectedDate;  
      startBtn.disabled = false;  
    }
  },
};



flatpickr(datePickerInput, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  datePickerInput.disabled = true;

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();
    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datePickerInput.disabled = false;
      return;
    }

    const time = convertMs(diff);
    updateTimerUI(time);
  }, 1000);
});

function updateTimerUI({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);  
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
//test