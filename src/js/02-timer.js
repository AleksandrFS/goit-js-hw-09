import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/dark.css');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  position: 'center-top',
  cssAnimationStyle: 'zoom',
  fontSize: '18px',
  width: '350px',
});

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  body: document.querySelector('body'),
};

refs.btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {},
  onClose: function (selectedDates, dateStr, instance) {
    if (selectedDates[0] <= new Date()) {
      Notify.failure('Please choose a date in the future');
      refs.btnStart.disabled = true;
    } else {
      refs.btnStart.disabled = false;
    }
  },
};

const fp = flatpickr('#datetime-picker', options);

refs.btnStart.addEventListener('click', onBtnStartClick);

function onBtnStartClick() {
  const futureDate = fp.selectedDates[0].getTime();
  refs.inputDate.disabled = true;
  refs.btnStart.disabled = true;

  const intervalId = setInterval(() => {
    const currentDate = Date.now();
    const ms = futureDate - currentDate;
    if (ms < 0) {
      refs.inputDate.disabled = false;
      refs.btnStart.disabled = false;
      refs.body.insertAdjacentHTML(
        'beforeend',
        '<iframe src="https://gifer.com/embed/2DV" width=480 height=216.960 frameBorder="0" allowFullScreen></iframe>'
      );
      clearInterval(intervalId);
      return;
    }
    updateTimer(convertMs(ms));
  }, 1000);
}

function pad(value) {
  return String(value).padStart('2', 0);
}

const timer = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

function updateTimer({ days, hours, minutes, seconds }) {
  timer.days.textContent = `${days}`;
  timer.hours.textContent = `${hours}`;
  timer.minutes.textContent = `${minutes}`;
  timer.seconds.textContent = `${seconds}`;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
