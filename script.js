class Rectangle {
  constructor(x, y, w, h, speed, colour) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.speed = speed
    this.colour = colour
    this.dead = false
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
    if (!this.dead) {
      this.colour = 'red'
      this.speed = 0
      setTimeout(() => setup(), 3000)
      this.dead = true
    }
  }

  ride(what) {
    this.x = constrain(this.x + what.speed, 0, width - this.w)
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
  constructor(position, items, speed, colour, itemWidth, itemColour, itemPadding, attachable) {
    this.y = height - (position * gridSize)
    this.x = 0
    this.w = width
    this.h = gridSize
    this.colour = colour
    this.obstacles = []
    this.attachable = attachable
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
    let drowned = true
    this.obstacles.forEach(obstacle => {
      obstacle.move()
      obstacle.draw()
        if(!this.attachable && frog.intersects(obstacle)) {
          frog.die()
        } else if(this.attachable && frog.intersects(obstacle)) {
          frog.ride(obstacle)
        } if(this.attachable && frog.intersects(obstacle)) {
          drowned = false
      }
    })

    if (this.attachable && frog.intersects(this) && drowned) {
      frog.die()
    }
  }
}

const gridSize = 20

function reset() {
  frogger = new Frog(width/2 - gridSize/2, height - (gridSize * 1) , gridSize , gridSize , gridSize, 'green')
  lanes = [
    new Lane(1, 0, 0, 'lightgreen', 0, '', 0, false),

    new Lane(2, 4, 1.4, 'lightgray', 30, 'blue', 50, false),
    new Lane(3, 2, 2.4, 'lightgray', 20, 'yellow', 100, false),
    new Lane(4, 2, -2.1, 'lightgray', 75, 'black', 100, false),
    new Lane(5, 3, -0.5, 'lightgray', 50, 'cyan', 75, false),

    new Lane(6, 0, 0, 'lightgreen', 0, '', 0, false),

    new Lane(7, 2, -1.5, 'lightblue', 150, 'orange', 100, true),
    new Lane(8, 4, 0.5, 'lightblue', 30, 'pink', 105, true),
    new Lane(9, 2, -2.5, 'lightblue', 100, 'orange', 175, true),

    new Lane(10, 0, 0, 'lightgreen', 0, '', 0, false),
    new Lane(11, 0, 0, 'lightgreen', 0, '', 0, false)
  ]
}

function setup() {
  createCanvas (gridSize * 21, gridSize * 11)
  stroke(0)
  strokeWeight(0)

  reset()
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
