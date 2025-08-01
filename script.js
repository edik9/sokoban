// типы для базового слоя карты
const baseTypes = {
  empty: 0, // пустое пространство (за пределами карты)
  wall: 1, // стена 
  back: 2, // пол
  target: 3 // цель
};

// типы для объектного слоя
const objectTypes = {
  none: 0, // пустота - там, где нету объекта на карте
  box: 1, // коробка
  player: 2 // игрок
};

// базовый слой карты (0-пусто,1-стена,2-пол,3-цель)
const baseMap = [
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  [1, 3, 3, 2, 2, 1, 0, 1, 1, 2, 1, 1],
  [1, 3, 3, 2, 2, 1, 1, 1, 2, 2, 2, 1],
  [1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 3, 2, 2, 1, 2, 1, 2, 2, 2, 1],
  [1, 3, 3, 1, 1, 1, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1],
  [0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 2, 1],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// слой карты с подвижными объектами (0-пусто,1-коробка,2-игрок)
const objectMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// находим позицию игрока
let playerPosition = {x: 0, y: 0}; //объект для хранения координат игрока
for(let y=0; y<objectMap.length; y++){ // перебор строк
  for(let x=0; x<objectMap[0].length; x++){ // перебор столбцов
    if(objectMap[y][x] === objectTypes.player){ // если нашли игрока
      playerPosition = {x, y}; // сохраняем его координаты
    }
  }
}

const cellElements = []; //массив, в котором будет отрисовываться карта

// отрисовываем карту с учетом двух слоев
function drawMap() {
  const gameContainer = document.getElementById('map1'); // получаем контейнер для карты по ID
  gameContainer.innerHTML = ''; //очищаем контейнер

  for(let y=0; y<baseMap.length; y++){ // перебираем строки базовой карты
    const rowDiv = document.createElement('div'); // создаём div для строки
    rowDiv.classList.add('row'); // добавляем класс "row" для стилизации
    cellElements[y] = []; // инициализируем массив для хранения элементов ячеек

    for(let x=0; x<baseMap[0].length; x++){ // перебираем ячейки в строке
      const cellDiv = document.createElement('div'); // создаём div для ячейки
      cellDiv.classList.add('cell'); // добавляем класс cell для стилизации
      rowDiv.appendChild(cellDiv); // добавляем ячейку в строку
      cellElements[y][x] = cellDiv; // сохраняем ссылку на ячейку в массив

      updateCellVisual(x, y); //обновляем внешний вид ячейки
    }

    gameContainer.appendChild(rowDiv); // добавляем строку в контейнер
  }
}

// функция, обновляющая визуальное состояние одной клетки
function updateCellVisual(x, y) {
  const cellDiv = cellElements[y][x]; // получаем элемент ячейки
  const base = baseMap[y][x]; // получаем тип базового слоя
  const obj = objectMap[y][x]; // получаем тип объекта

  cellDiv.className = 'cell'; // тут сбрасываем все текущие классы ячейки, оставляя только cell

  // добавляем класс в зависимости от базового слоя
  switch(base){
    case baseTypes.empty: cellDiv.classList.add('empty'); break; // пустое пространство
    case baseTypes.wall: cellDiv.classList.add('wall'); break; // стена
    case baseTypes.back: cellDiv.classList.add('back'); break; // пол
    case baseTypes.target: cellDiv.classList.add('target'); break; // цель
  }

  // слой с подвижными объектами — добавляем класс поверх базового
  if(obj === objectTypes.box){ //если в ячейке находится ящик
    cellDiv.classList.add('box'); // тут добавляем класс для ящика
    removePlayerImage(cellDiv); // удаляем изображение игрока, если оно есть чтобы оно не наложилось
  } else if(obj === objectTypes.player){ //если в ячейке находится игорк
    cellDiv.classList.add('player'); // добавляем класс для игрока
    addPlayerImage(cellDiv); // добавляем изображение игрока если его нет
  } else {
    removePlayerImage(cellDiv); //удаляем изображение игрока, если ячейка пуста
  }
}

// функция добавления изображения игрока
function addPlayerImage(cellDiv) {
  if(!cellDiv.querySelector('img')){ // если нет изображения игрока - создаем его
    const img = document.createElement('img'); 
    img.src = 'img/monstr.svg'; // путь к изображению
    img.alt = 'Игрок'; // альтернативный текст
    img.style.width = '100%'; // занимает всю ширину ячейки
    img.style.height = '100%'; // занимает всю высоту ячейки
    cellDiv.appendChild(img); // добавляем в ячейку
  }
}

// функция удаления изображения игрока
function removePlayerImage(cellDiv) {
  const img = cellDiv.querySelector('img');
  if(img) img.remove(); //удаляем изображение, если оно есть
}

// проверка выхода за границы карты
function isInsideMap(x, y) {
  return y >= 0 && y < baseMap.length && x >= 0 && x < baseMap[0].length;
}

// обновление счётчика ходов и запуск таймера при первом ходе
function incrementMoveCount() {
  moveCount++;
  //Свойство .textContent задаёт или получает текстовое содержимое этого элемента.
  //Здесь мы присваиваем ему текущее значение переменной moveCount.
  document.getElementById('moveCount').textContent = moveCount; //обновляем отображение счетчика в интерфейсе
  if(moveCount === 1) startTimer(); // если это первый ход, то запускаем таймер
}

// функция движения игрока. принимает два параметра - смещение по оси Х и У
function movePlayer(dx, dy) {
  // получаем текущие координаты игрока
  const x = playerPosition.x;
  const y = playerPosition.y;
  // вычисляем новые координаты, куда игрок хочет переместиться
  const nx = x + dx;
  const ny = y + dy;

  if(!isInsideMap(nx, ny)) return; // проверяем выход новых координат за границы карты, если мы вышли то движение невозможно
  if(baseMap[ny][nx] === baseTypes.wall) return; // проверка на стену, если далее стена - движение невозможно

  const nextObj = objectMap[ny][nx]; // получаем объект, который находится в новой позиции на карте объектов

  if(nextObj === objectTypes.none){ // если новая позиция пуста, там нет объекта
    movePlayerToPosition(x, y, nx, ny);
    checkWinCondition(); // проверяем условие победы
  } 
  else if(nextObj === objectTypes.box){ // если в новой позиции ящик
    tryPushBox(x, y, nx, ny, dx, dy);
  }
}

// перемещение игрока на новую позицию
function movePlayerToPosition(fromX, fromY, toX, toY) {
  objectMap[fromY][fromX] = objectTypes.none; // освобождаем текущую позицию
  objectMap[toY][toX] = objectTypes.player; // занимаем игроком новую позицию

  //обновляем отображение старой и новой клетки на карте
  updateCellsVisual([[fromX, fromY], [toX, toY]]);

  playerPosition = {x: toX, y: toY}; // обновляем координаты игрока
  incrementMoveCount(); // обновляем счётчик ходов
}

// попытка толкнуть ящик
function tryPushBox(playerX, playerY, boxX, boxY, dx, dy) {
  // координаты за ящиком, пытаемся его толкнуть
  const newBoxX = boxX + dx;
  const newBoxY = boxY + dy;

  //проверка что клетка за ящииком
  if(!isInsideMap(newBoxX, newBoxY)) return; // в пределах карты
  if(baseMap[newBoxY][newBoxX] === baseTypes.wall) return; // не стена
  if(objectMap[newBoxY][newBoxX] !== objectTypes.none) return; // пустая(нет других объектов)
  
  //если хоть одно из этих условий не выполнено, то толкнуть ящик нельзя, движение отменяется
  // толкаем коробку вперед
  objectMap[newBoxY][newBoxX] = objectTypes.box; // перемещаем ящик на новую позицию
  objectMap[boxY][boxX] = objectTypes.player; // перемещаем игрока на место ящика
  objectMap[playerY][playerX] = objectTypes.none; // освобождаем старую позицию - она пустая теперь

  // обновляем отображение всех затронутых клеток
  updateCellsVisual([[playerX, playerY], [boxX, boxY], [newBoxX, newBoxY]]);

  playerPosition = {x: boxX, y: boxY}; // обновляем координаты игрока
  incrementMoveCount(); // обновляем счетчик ходов
  checkWinCondition(); // проверяем условие победы
}

// проверяем победу: все коробки на целях
function checkWinCondition() {
  if(checkWin()){ // проверяем условие победы
    handleWin(); // обрабатываем победу
  }
}

// проверка всех коробок на целевых позициях
function checkWin() {
  for(let y=0; y<baseMap.length; y++){ // перебираем все строки карты
    for(let x=0; x<baseMap[0].length; x++){ // перебираем все столбцы в строке
      if(objectMap[y][x] === objectTypes.box && baseMap[y][x] !== baseTypes.target){ // если в этой клетке есть ящик и при этом эта клетка не является целью
        return false; //игра не закончена
      }
    }
  }
  return true; // если все ящики на целях, то возвращаем true
}

// обработка нажатий клавиш для управления
document.addEventListener('keydown', e => { // добавляем обработчик события на объект document
  const key = e.key.toLowerCase(); // приводим код клавиш к нижнему регистру
  switch(key){
    case 'arrowup':
    case 'w': movePlayer(0, -1); break;
    case 'arrowdown':
    case 's': movePlayer(0, 1); break;
    case 'arrowleft':
    case 'a': movePlayer(-1, 0); break;
    case 'arrowright':
    case 'd': movePlayer(1, 0); break;
  }
});

let moveCount = 0; // счетчик ходов
let timerInterval = null; //идентификатор интервала таймера, null значит что он не запущен
let secondsElapsed = 0; //прошедшие секунды

// функция обновления таймера в формате mm:ss
function updateTimerDisplay() {
  //вычисляем целое число минут, прошедших за время secondsElapsed, преобразуем число в строку
  const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0'); //.padStart(2, '0') — дополняет строку слева нулями, чтобы всегда было минимум 2 символа. Например, 5 → "05".
  const seconds = (secondsElapsed % 60).toString().padStart(2, '0'); //Аналогично для секунд: secondsElapsed % 60 — остаток от деления на 60, то есть количество секунд, не вошедших в полные минуты.
  document.getElementById('timer').textContent = `${minutes}:${seconds}`; // обновляем текст в элементе c id timer
}

// запуск таймера
function startTimer() {
  if(timerInterval) return; // если уже запущен(не null), то выходим
  timerInterval = setInterval(() => { //если не запущен, то устанавливаем интервал обновления каждую секунду
    secondsElapsed++; // увеличиваем счетчик секунд на 1
    updateTimerDisplay(); // обновляем отображения
  }, 1000);
}

// остановка таймера
function stopTimer() {
  clearInterval(timerInterval); // останавливает выполнение функции, которая была запущена через setInterval.
  timerInterval = null; // сбрасываем идентификатор, чтобы указать что таймер не работает сейчас
}

// вывод сообщения о победе и остановка таймера
function handleWin() {
  stopTimer();
  setTimeout(() => { // показываем оповещение о победе с небольшой задержкой в 10 мс, чтобы браузер успел обновить интерфейс перед появлением alert
    alert(`Поздравляем! Вы выиграли за ${moveCount} ходов и время ${document.getElementById('timer').textContent}`);
  }, 10);
}

// обновление нескольких ячеек на карте
//функция принимает параметр cells — это массив, каждый элемент которого — массив из двух чисел [x, y], представляющих координаты ячейки на карте (x — горизонтальная позиция, y — вертикальная).
function updateCellsVisual(cells) {
  cells.forEach(([x, y]) => updateCellVisual(x, y)); 
}
//cells.forEach(...) — метод массива, который перебирает все элементы массива cells.
//для каждого элемента вызывается функция-обработчик.
//в качестве параметра обработчик получает текущий элемент — в нашем случае это массив [x, y].
//синтаксис ([x, y]) — это деструктуризация массива: мы сразу извлекаем из массива первый элемент в переменную x, второй — в y.
//для каждой пары координат вызывается функция updateCellVisual(x, y).
//функция updateCellVisual обновляет визуальное отображение конкретной ячейки с координатами (x, y) на карте игры

// запускаем отрисовку карты
drawMap();