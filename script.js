// Referencias a elementos HTML
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');
const difficultySelect = document.getElementById('difficulty');

// Configuración del juego
let selectedDifficulty = difficultySelect.value;
let snakeSpeed;
const boardSize = 10;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

// Variables del juego
let isGameRunning = false;
let snake, score, direction, boardSquares, emptySquares, moveInterval;

// Función para limpiar el tablero
const clearBoard = () => {
    board.textContent = '';
}

// Función para inicializar el juego
const initializeGame = () => {
    clearBoard();
    createBoard();
    isGameRunning = true;
}

// Función para dibujar la serpiente
const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Función para dibujar un cuadrado en el tablero
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        const index = emptySquares.indexOf(square);
        if (index !== -1) {
            emptySquares.splice(index, 1);
        }
    }
}

// Función para manejar el movimiento de la serpiente
const moveSnake = () => {
    const head = Number(snake[snake.length - 1]) + directions[direction];
    const [row, column] = String(head).padStart(2, '0').split('');

    if (
        head < 0 ||
        head >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

// Función para agregar comida al juego
const addFood = () => {
    score++;
    updateScore();

    // Limpia el cuadrado de comida anterior
    const previousFoodSquare = emptySquares.pop();
    if (previousFoodSquare) {
        drawSquare(previousFoodSquare, 'emptySquare');
    }

    createRandomFood();
}

// Función para manejar el fin del juego
const gameOver = () => {
    gameOverSign.style.display = 'block';

    // Detener el intervalo
    clearInterval(moveInterval);

    // Desvincular el evento del teclado
    document.removeEventListener('keydown', handleKeyEvent);

    // Limpiar el tablero eliminando la serpiente y la comida
    clearBoard();

    // Habilitar el botón de inicio
    startButton.disabled = false;
}

// Función para establecer la dirección de la serpiente
const setDirection = newDirection => {
    direction = newDirection;
}

// Función para manejar el evento de tecla
const handleKeyEvent = event => {
    // Evitar el cambio de dirección opuesto al movimiento actual
    event.preventDefault(); 
    const key = event.code;
    switch (key) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

// Función para crear comida aleatoria en el tablero
const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

// Función para actualizar el marcador de puntuación
const updateScore = () => {
    scoreBoard.innerText = score;
}

// Función para crear el tablero inicial
const createBoard = () => {
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];

    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }

    // Dibuja la serpiente despues de crear el tablero
    drawSnake();
}

// Funcion para configurar el juego
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    createBoard();
}

// Función para cambiar la velocidad de la serpiente
const changeSnakeSpeed = (speed) => {
    snakeSpeed = speed;
    clearInterval(moveInterval);
    moveInterval = setInterval(moveSnake, snakeSpeed);
    alert(speed);
}

// Función para cambiar la dificultad del juego
const changeDifficulty = (difficulty) => {
    selectedDifficulty = difficulty;
    switch (difficulty) {
        case 'easy':
            changeSnakeSpeed(1000); // Velocidad lenta
            break;
        case 'medium':
            changeSnakeSpeed(100);  // Velocidad media (valor original)
            break;
        case 'hard':
            changeSnakeSpeed(10);   // Velocidad rápida
            break;
        default:
            console.error('Dificultad no válida');
            break;
    }
}

// Funcion para iniciar el juego
const startGame = () => {
    // Configura la velocidad según la dificultad seleccionada
    switch (selectedDifficulty) {
        case 'easy':
            changeSnakeSpeed('slow');
            break;
        case 'medium':
            changeSnakeSpeed('medium');
            break;
        case 'hard':
            changeSnakeSpeed('fast');
            break;
        default:
            console.error('Dificultad no válida');
            break;
    }

    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', handleKeyEvent);
    moveInterval = setInterval(moveSnake, snakeSpeed);
}

// Evento al hacer clic en el boton de inicio
startButton.addEventListener('click', startGame);
