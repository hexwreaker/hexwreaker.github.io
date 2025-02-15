var points = [],
    velocity2 = 25, // velocity squared
    canvas = document.getElementById('container'),
    context = canvas.getContext('2d'),
    radius = 5,
    boundaryX = window.innerWidth,
    boundaryY = window.innerHeight,
    numberOfPoints = 30;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    boundaryX = canvas.width;
    boundaryY = canvas.height;
}

function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create points
    for (var i = 0; i < numberOfPoints; i++) {
        createPoint();
    }
    // Create connections
    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        if (i === 0) {
            points[i].buddies = [points[points.length - 1]];
        } else {
            points[i].buddies = [points[i - 1]];
        }
        // Add random additional connections
        var numConnections = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        for (var j = 0; j < numConnections; j++) {
            var randomIndex = Math.floor(Math.random() * points.length);
            if (randomIndex !== i && !point.buddies.includes(points[randomIndex])) {
                point.buddies.push(points[randomIndex]);
            }
        }
    }

    // Add event listeners
    canvas.addEventListener('click', resetHalfVelocities);
    window.addEventListener('scroll', resetHalfVelocities);

    // Animate
    animate();
}

function getRandomVelocity() {
    return (Math.random() - 0.5) / 5;
}

function getRandomPosition(margin) {
    var x = Math.random() * (boundaryX + 2 * margin) - margin;
    var y = Math.random() * (boundaryY + 2 * margin) - margin;
    return [x, y];
}

function createPoint() {
    var point = {}, vx2, vy2;
    var pos = getRandomPosition(1000);
    point.x = pos[0];
    point.y = pos[1];
    // Random vx
    point.vx = getRandomVelocity();
    vx2 = Math.pow(point.vx, 2);
    // vy^2 = velocity^2 - vx^2
    vy2 = velocity2 - vx2;
    point.vy = getRandomVelocity();
    point.lineWidth = Math.random(); // Random line width between 0 and 1
    points.push(point);
}

function resetVelocity(point) {
    point.vx = getRandomVelocity();
    point.vy = getRandomVelocity();
}

function resetHalfVelocities() {
    // Reset velocities for half of the points
    for (var i = 0; i < points.length / 2; i++) {
        var randomIndex = Math.floor(Math.random() * points.length);
        resetVelocity(points[randomIndex]);
        points[randomIndex].lineWidth = Math.random(); // Random line width between 0 and 1
    }
}

function drawCircle(x, y) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#97badc';
    context.fill();
}

function drawLine(x1, y1, x2, y2, lineWidth) {
    context.lineWidth = lineWidth; // Set line width
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = '#8affff';
    context.stroke();
}

var time = 0; // Global time variable

function draw() {
    time += 0.001; // Increment time for smooth variation

    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        point.x += point.vx;
        point.y += point.vy;

        for (var j = 0; j < point.buddies.length; j++) {
            var buddy = point.buddies[j];

            // Vary lineWidth between 0 and 1 over time
            var dynamicLineWidth = 0.5 + 0.5 * Math.sin(time + i * 0.5);

            drawLine(point.x, point.y, buddy.x, buddy.y, dynamicLineWidth);
        }

        // Check for edge collisions
        if (point.x < 0 + radius || point.x > boundaryX - radius ||
            point.y < 0 + radius || point.y > boundaryY - radius) {
            resetVelocity(point);
        }
    }
}

function animate() {
    context.clearRect(0, 0, boundaryX, boundaryY);
    draw();
    requestAnimationFrame(animate);
}

init();
