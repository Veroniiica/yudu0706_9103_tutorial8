
let balls = []; // save ball info
let minNumber;
let song;
let rotationAngles = [0, 0, 0, 0]; // rotation angles for the big circles
let isMusicPlaying = false;

function preload() {
  song = loadSound('assets/ADOY - Simply.mp3'); // preload the music file
}

function setup() {
  let minNumber = Math.min(windowWidth, windowHeight);
  createCanvas(minNumber, minNumber); 
  setupBalls();
  song.setVolume(0.5);
}

function setupBalls() {
  balls = [];
  background(31, 74, 104); 
  
  let numBalls = 500; // Number of balls to generate
  
  // create balls at random locations
  for (let i = 0; i < numBalls; i++) {
    // calculate balls location
    let x = random(width); // Random x position within the canvas
    let y = random(height); // Random y position within the canvas
    
    // random balls color 
    let c = color(random(255), random(255), random(255)); 
    
    // save ball info
    balls.push({
      x: x,
      y: y,
      color: c
    });
  }
}

function windowResized() {
  let minNumber = Math.min(windowWidth, windowHeight);
  resizeCanvas(minNumber, minNumber);
  setupBalls(); // Recalculate ball positions based on new window size
}

function draw() {
  minNumber = Math.min(windowWidth, windowHeight);
  background(31, 74, 104); // clear the history

  // draw the balls
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    
    // draw balls
    fill(ball.color); 
    strokeWeight(2); // Set stroke width to 2 pixels
    ellipse(ball.x, ball.y, minNumber * 0.02, minNumber * 0.02); // Diameter is 2% of window width
  }

  // Draw the big circles with concentric circles inside them
  drawBigCircleWithCircles(minNumber * 0.30, minNumber * 0.25, minNumber * 0.55, ['#FFFFFF', '#4E9E48', '#FFFFFF', '#4E9E48', '#FFFFFF', '#4E9E48', '#FFFFFF', '#4E9E48', '#D449AC', '#F55060', '#000000', '#199B34', '#FFFFFF'], rotationAngles[0]); // Top-left big circle
  drawBigCircleWithCircles(minNumber * 0.85, minNumber * 0.2, minNumber * 0.4, ['#FFFFFF', '#ED6E0B', '#FFFFFF', '#ED6E0B', '#FFFFFF', '#ED6E0B', '#FFFFFF', '#ED6E0B', '#D449AC', '#4DADCE', '#000000', '#199B34', '#FFFFFF'], rotationAngles[1]); // Top-right big circle
  drawBigCircleWithCircles(minNumber * 0.20, minNumber * 0.85, minNumber * 0.5, ['#00238B', '#E0B155', '#00238B', '#E0B155', '#00238B', '#E0B155', '#00238B', '#E93B6E', '#FF3512', '#F363C5', '#000000', '#199B34', '#FF1B1D', '#FFFFFF'], rotationAngles[2]); // Bottom-left big circle
  drawBigCircleWithCircles(minNumber * 0.8, minNumber * 0.75, minNumber * 0.55, ['#FFFFFF', '#EB1D59', '#FFFFFF', '#EB1D59', '#FFFFFF', '#EB1D59', '#FFFFFF', '#EB1D59', '#D449AC', '#FC5E45', '#000000', '#FF1631', '#FF1B1D', '#FFFFFF', '#FFFFFF'], rotationAngles[3]); // Bottom-right big circle
  
  // Rotate big circles if music is playing
  if (isMusicPlaying) {
    for (let i = 0; i < rotationAngles.length; i++) {
      rotationAngles[i] += 0.01;
    }
  }
}

function drawBigCircleWithCircles(x, y, diameter, colors, rotationAngle) {
  push(); // save the current canvas state
  translate(x, y); // move the coordinate system to the center of the big circle
  rotate(rotationAngle); // rotate around the center of the big circle
  drawBigCircle(0, 0, diameter); // Draw the big circle
  drawCirclesInsideBigCircle(0, 0, diameter, colors); // Draw the concentric circles inside the big circle
  pop(); // restore the previously saved canvas state
}

function drawBigCircle(x, y, diameter) {
  fill(255); // Set fill color to white
  stroke(0); // Set the stroke color to black
  strokeWeight(minNumber * 0.02); // Set the stroke width relative to window width
  ellipse(x, y, diameter); // Draw the big circle
}

function drawCirclesInsideBigCircle(x, y, diameter, colors) {
  let numOfCircles = colors.length; // Use the number of colors provided
  let circleDiameter = diameter; // Start with the diameter of the big circle

  for (let i = 0; i < numOfCircles; i++) {
    drawCircle(x, y, circleDiameter, colors[i]); // Draw the concentric circles
    circleDiameter -= diameter / numOfCircles; // Decrease the diameter to create concentric circles
  }
}

function drawCircle(x, y, diameter, strokeColor) {
  noFill();
  stroke(strokeColor); // Set the stroke color to the provided color
  strokeWeight(minNumber * 0.05); // Set the stroke width relative to window width
  ellipse(x, y, diameter); // Draw the circle
}

function mouseClicked() {
  // Check if the mouse is inside any of the big circles
  for (let i = 0; i < 4; i++) {
    let centerX, centerY, diameter;

    // Get the parameters for the current big circle
    switch (i) {
      case 0:
        centerX = minNumber * 0.30;
        centerY = minNumber * 0.25;
        diameter = minNumber * 0.55;
        break;
      case 1:
        centerX = minNumber * 0.85;
        centerY = minNumber * 0.2;
        diameter = minNumber * 0.4;
        break;
      case 2:
        centerX = minNumber * 0.20;
        centerY = minNumber * 0.85;
        diameter = minNumber * 0.5;
        break;
      case 3:
        centerX = minNumber * 0.8;
        centerY = minNumber * 0.75;
        diameter = minNumber * 0.55;
        break;
    }

    // Calculate the distance between the mouse click and the center of the circle
    let d = dist(mouseX, mouseY, centerX, centerY);

    // Check if the mouse click is inside the circle
    if (d < diameter / 2) {
      // Toggle music play/pause
      if (!song.isPlaying()) {
        song.play();
        isMusicPlaying = true; // Set music playing flag
      } else {
        song.pause();
        isMusicPlaying = false; // Set music playing flag
        // Reset rotation angles when music is paused
        for (let i = 0; i < rotationAngles.length; i++) {
          rotationAngles[i] = 0;
        }
      }
    }
  }
}
