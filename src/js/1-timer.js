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
    btn.disabled = userSelectedDate < Date.now();
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

function decodeMs(delta) {
  const secMs = 1000;
  const minMs = 60 * secMs;
  const hourMs = 60 * minMs;
  const dayMs = 24 * hourMs;

  const day = Math.floor(delta / dayMs);
  delta %= dayMs;
  const hour = Math.floor(delta / hourMs);
  delta %= hourMs;
  const min = Math.floor(delta / minMs);
  delta %= minMs;
  const sec = Math.floor(delta / secMs);
  return { day, hour, min, sec };
}

const dayEl = document.querySelector('.field .value[data-days]');
const hourEl = document.querySelector('.field .value[data-hours]');
const minEl = document.querySelector('.field .value[data-minutes]');
const secEl = document.querySelector('.field .value[data-seconds]');

function displayLastTime({ day, hour, min, sec }) {
  dayEl.textContent = String(day).padStart(2, '0');
  hourEl.textContent = String(hour).padStart(2, '0');
  minEl.textContent = String(min).padStart(2, '0');
  secEl.textContent = String(sec).padStart(2, '0');
}

btn.addEventListener('click', event => {
  btn.disabled = true;
  date.disabled = true;
  const intId = setInterval(() => {
    const delta = userSelectedDate - Date.now();
    if (delta <= 0) {
      clearInterval(intId);
      btn.disabled = false;
      date.disabled = false;
      displayLastTime({ day: 0, hour: 0, min: 0, sec: 0 });
      return;
    }
    displayLastTime(decodeMs(delta));
  }, 1000);
});
