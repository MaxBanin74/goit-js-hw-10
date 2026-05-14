import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
const btn = document.querySelector('button');
const date = document.querySelector('#datetime-picker');
btn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    btn.disabled = userSelectedDate <= Date.now();
    if (btn.disabled)
      iziToast.show({
        message: 'Please choose a date in the future',
        messageColor: 'white',
        messageSize: '20',
        backgroundColor: 'red',
        position: 'topRight',
        progressBar: false,
        timeout: 0,
      });
  },
  onOpen() {
    var toast = document.querySelector('.iziToast');
    if (toast) {
      iziToast.hide({}, toast);
    }
  },
};

const fp = flatpickr('#datetime-picker', options); // flatpickr

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const dayEl = document.querySelector('.field .value[data-days]');
const hourEl = document.querySelector('.field .value[data-hours]');
const minEl = document.querySelector('.field .value[data-minutes]');
const secEl = document.querySelector('.field .value[data-seconds]');

function displayLastTime({ days, hours, minutes, seconds }) {
  dayEl.textContent = String(days).padStart(2, '0');
  hourEl.textContent = String(hours).padStart(2, '0');
  minEl.textContent = String(minutes).padStart(2, '0');
  secEl.textContent = String(seconds).padStart(2, '0');
}

btn.addEventListener('click', event => {
  btn.disabled = true;
  date.disabled = true;
  const intId = setInterval(() => {
    const delta = userSelectedDate - Date.now();
    if (delta <= 0) {
      clearInterval(intId);
      date.disabled = false;
      displayLastTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    displayLastTime(convertMs(delta));
  }, 1000);
});
