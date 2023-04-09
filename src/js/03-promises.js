import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('.form');

formRef.addEventListener('submit', onCreatePromisesBtnClick);

function onCreatePromisesBtnClick(e) {
  e.preventDefault();

  const refsInput = {
    delayValue: Number(e.target.elements.delay.value),
    stepValue: Number(e.target.elements.step.value),
    amountValue: Number(e.target.elements.amount.value),
  };

  for (let i = 1; i <= refsInput.amountValue; i += 1) {
    let currentDelay = refsInput.delayValue + (i - 1) * refsInput.stepValue;

    createPromise(i, currentDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`, {});
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`, {});
      });
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
