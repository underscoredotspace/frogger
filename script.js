class Rectangle {
  constructor(x, y, w, h, speed, colour) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.speed = speed
    this.colour = colour || 'white'
  }

  draw() {
    fill(this.colour)
    rect(this.x, this.y, this.w, this.h)
  }
}

class Frog extends Rectangle {
  move(x, y) {
    this.x = constrain(this.x + (x * this.speed), 0, width - this.w)
    this.y = constrain(this.y + (y * this.speed), 0, height - this.h)
  }

  die() {
    this.colour = 'red'
  }

  intersects(that) {
    return !(
      this.x + this.w  <= that.x            ||
      this.x           >= that.x + that.w  ||
      this.y + this.h  <= that.y            ||
      this.y           >= that.y + that.h
    )
  }
}

class Obstacle extends Rectangle {
  constructor(xStart, y, width, speed, colour) {
    super(xStart, y, width, gridSize, speed, colour)
  }
  
  move() {
    this.x += this.speed
    if (this.speed > 0 && this.x > width) {
      this.x = 0 - this.w
    } else if (this.speed < 0 && this.x < 0 - this.w) {
      this.x = width
    }
  }
}

class Lane {
  constructor(position, items, speed, colour, itemWidth, itemColour, itemPadding) {
    this.y = height - (position * gridSize)
    this.colour = colour
    this.obstacles = []
    this.createObstacles(items, speed, itemWidth, itemColour, itemPadding)
  }

  createObstacles(count, speed, itemWidth, itemColour, itemPadding) {
    for (let oNdx = 0; oNdx < count; oNdx++) {
      let xStart = oNdx * (itemWidth + itemPadding) + itemPadding
      this.obstacles.push(new Obstacle(xStart, this.y, itemWidth, speed, itemColour))
    }
  }

  draw(frog) {
    fill(this.colour)
    rect(0, this.y, width, gridSize)
    this.obstacles.forEach(obstacle => {
      obstacle.move()
      obstacle.draw()
      if(frog.intersects(obstacle)) {
        frog.die()
      }
    })
  }
}

const gridSize = 20

function setup() {
  createCanvas (20 * 21, 20 * 21)
  stroke(0)
  strokeWeight(2)

  frogger = new Frog(width/2 - gridSize/2, height - gridSize , gridSize , gridSize , gridSize, 'lightgreen')
  lanes = [
    new Lane(2, 4, 1.4, 'lightgray', 30, 'lightblue', 50),
    new Lane(3, 2, 2.4, 'lightgray', 20, 'lightblue', 100),
    new Lane(4, 2, -2.1, 'lightgray', 75, 'lightblue', 100),
    new Lane(5, 3, -0.5, 'lightgray', 50, 'lightblue', 75)
  ]
}

function draw() {
  background(0)
  lanes.forEach(lane => lane.draw(frogger))
  frogger.draw()
}

function keyPressed(e) {
  switch (e.key) {
  case 'ArrowDown':
    frogger.move(0, 1)
    break
  case 'ArrowUp':
    frogger.move(0, -1)
    break
  case 'ArrowRight':
    frogger.move(1, 0)
    break
  case 'ArrowLeft':
    frogger.move(-1, 0)
    break
  }
}
