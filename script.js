const snakeboard = document.getElementById('gameBoard')
const snakeboard_ctx = gameBoard.getContext('2d')

//snake is first created in the board
let snake = [{ x: 200, y: 200 }]
let changing_direction = false

//snake is not moving when page is reloaded
let dx = 0
let dy = 0

//generate first food when page is reloaded
let food
generateFood()

//add a picture snake in the snake's body
let snakePic = new Image()
snakePic.src = 'snake.png'

//show score and store to get highest score
let score = 0
let scores = []

//Make a pause button
let isPaused = false
document.addEventListener('keydown', function (evt) {
  if (evt.code === 'Space') {
    isPaused = !isPaused
    if (!isPaused) {
      main()
    }
  }
})

main()
document.addEventListener('keydown', changingDirection)

// main function called repeatedly to keep the game running
function main() {
  if (isPaused) {
    return
  }

  if (collision()) {
    alert('Game is over')
    scores.push(score)
    document.getElementById('highScore').innerHTML = `Highest Score: ${findMax(
      scores
    )}`
    return
  }

  changing_direction = false
  setTimeout(function () {
    clearBoard()
    drawFood()
    updateSnake()
    drawSnake()
    main()
  }, 100) // Delay between each frame
}

// draw a border around the canvas
function clearBoard() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = 'white'
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = 'black'
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height)
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height)
}

function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = 'white'
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = 'dark-blue'
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
  snakeboard_ctx.drawImage(snakePic, snakePart.x, snakePart.y)
}

function updateSnake() {
  // Create the new Snake's head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }
  // Add the new head to the beginning of snake body
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    // Snake ate the food
    score += 10
    document.getElementById('score').innerHTML = `Score: ${score}`
    generateFood()
  } else {
    snake.pop()
  }
}

function changingDirection(evt) {
  if (changing_direction) return
  changing_direction = true
  const keyPressed = evt.key
  const goingUp = dy === -10
  const goingDown = dy === 10
  const goingRight = dx === 10
  const goingLeft = dx === -10
  evt.preventDefault()
  switch (keyPressed) {
    case 'ArrowLeft':
      if (!goingRight) {
        dx = -10
        dy = 0
      }
      break
    case 'ArrowUp':
      if (!goingDown) {
        dx = 0
        dy = -10
      }
      break

    case 'ArrowRight':
      if (!goingLeft) {
        dx = 10
        dy = 0
      }
      break

    case 'ArrowDown':
      if (!goingUp) {
        dx = 0
        dy = 10
      }
      break
  }
}

function collision() {
  let head = snake[0]

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }

  if (
    head.x < 0 ||
    head.x > snakeboard.width - 10 ||
    head.y < 0 ||
    head.y > snakeboard.height - 10
  ) {
    return true
  } else {
    return false
  }
}

function randomCor(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

function generateFood() {
  food = {
    x: randomCor(0, snakeboard.width - 10),
    y: randomCor(0, snakeboard.height - 10),
  }
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      generateFood() // Generate food again
      break
    }
  }
}

function drawFood() {
  snakeboard_ctx.fillStyle = 'lightgreen'
  snakeboard_ctx.strokestyle = 'darkgreen'
  snakeboard_ctx.fillRect(food.x, food.y, 10, 10)
  snakeboard_ctx.strokeRect(food.x, food.y, 10, 10)
}

function findMax(arr) {
  let current = 0
  for (let i = 0; i < arr.length; i++) {
    if (current < arr[i]) {
      current = arr[i]
    }
  }
  return current
}

document.getElementById('reset').onclick = restartGame

function restartGame() {
  score = 0
  snake = [
    {
      x: 300,
      y: 300,
    },
  ]
  dx = 0
  dy = 0
  generateFood()
  drawFood()
  drawSnake()
  main()
}
