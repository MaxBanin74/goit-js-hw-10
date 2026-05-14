import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const toastOpt = {
  messageColor: 'white',
  messageSize: '20',
  position: 'topRight',
  progressBar: false,
  timeout: 0,
  close: false,
  imageWidth: 20,
};

const fulfillOpt = {
  ...toastOpt,
  backgroundColor: 'green',
  image: '../img/1.jpg',
};

const rejectOpt = {
  ...toastOpt,
  backgroundColor: 'red',
  image: '../img/2.jpg',
};

const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  document.querySelectorAll('.iziToast').forEach(t => {
    iziToast.hide({}, t);
  });
  const isSuccess = form.elements.state.value === 'fulfilled';
  const delay = Number(form.elements.delay.value);
  form.reset();
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  promise
    .then(delay =>
      iziToast.show({
        message: `Fulfilled promise in ${delay}ms`,
        ...fulfillOpt,
      })
    )
    .catch(delay =>
      iziToast.show({ message: `Rejected promise in ${delay}ms`, ...rejectOpt })
    );
}
