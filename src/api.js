export function saveTaskOnServer(task) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (task.text.toLowerCase().includes('ошибка')) {
        reject(new Error('Сервер не смог сохранить задачу'));
      } else {
        resolve(task);
      }
    }, 1000);
  });
}

export function fetchTip() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Разбивайте большую задачу на маленькие шаги.'), 1500);
  });
}
