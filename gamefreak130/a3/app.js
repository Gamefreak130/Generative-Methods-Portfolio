// Outermost scope, 
// You can access these variables from *anywhere*, in fxns, or in html
let myP5;
// modeFun corresponds to a function called by the processing object to draw the tool effect
let modeFun = pencil;
let mousePositions = []
let pencilColor;
let electricityColor;
let DEBUG = false;

function changeCursor(text) {
	console.log(`Changing cursor to ${text}`);
	document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="32" style="font-size: 20px;"><text x="-1" y="18">${text}</text></svg>'), auto`;
}

function clearCanvas() {
	console.log("Clearing");
	myP5.background("white");
}

// Totally clearing the canvas with one click is boring
// The ghost makes increases the transparency of everything in the canvas while the mouse is clicked in the canvas
// But will not totally erase anything; there will still be a faint grey outline no matter what
function ghost() {
	if (myP5.mouseX >= 0 && myP5.mouseY >= 0) {
		console.log("Ghosting...");
		myP5.background(0, 100, 100, 0.1);
	}
}

// Just your standard mouse draw
// With selectable colors and splines to smooth out curves
function pencil() {
	drawCurve(pencilColor.color());	
}

// Repeatedly places filled circles, cycling through hue based on mouse position
// Any two circles placed in the same position will have (approximately) the same hue
function rainbow() {
	if (mousePositions.length > 0) {
		console.log("Rainbowing...");
		myP5.stroke((myP5.mouseX + myP5.mouseY)%360, 90, 60);
		myP5.strokeWeight(50);
		myP5.point(...mousePositions[mousePositions.length - 1]);
	}
}

// Takes a big ol' square around the current mouse position
// And inverts the color of all the pixels in it
function negative() {
	if (myP5.mouseX >= 0 && myP5.mouseY >= 0) {
		console.log("Negativeing...");
		const radius = 50;
		myP5.loadPixels();
		for (x = myP5.mouseX - radius; x <= myP5.mouseX + radius; x++) {
			for (y = myP5.mouseY - radius; y <= myP5.mouseY + radius; y++) {
				// p.set() is fine performance-wise, but p.get() is WAY too slow for this many pixels
				// So we have to access the pixel buffer directly to get an [R, G, B, A] array
				let off = (Math.floor(y) * myP5.width + Math.floor(x)) * 4 * myP5.pixelDensity();
				let c = [
					myP5.pixels[off],
					myP5.pixels[off + 1],
					myP5.pixels[off + 2],
					myP5.pixels[off + 3]
				];
				c[0] = 255 - c[0];
				c[1] = 255 - c[1];
				c[2] = 255 - c[2];
				myP5.set(x, y, c);
			}
		}
		myP5.updatePixels();
		console.log("Done");
	}
}

// It's shocking!
function electricity() {
	if (!electricityColor || myP5.frameCount % 10 == 0) {
		// The color of the curve you're drawing changes every 10 frames
		electricityColor = myP5.color((myP5.millis()*30)%360, 100, 20+Math.random()*40, Math.random()*.4 + .3);
	}

	// We start with a simple mouse draw curve, just like the pencil
	// Only with moar colorz
	drawCurve(electricityColor);

	let maxRecursion = 10;

	let drawLine = (p0, timesRecursed) => {
		if (timesRecursed == maxRecursion) return;
		let length = (10 + 30*Math.random())*2.5 / timesRecursed;
		let p1 = vector.getAddPolar(p0, length, 30*myP5.noise(...p0));

		if (DEBUG) {
			myP5.noStroke();
			myP5.fill(150, 100, 40);
			myP5.circle(...p0, 5);
			myP5.circle(...p1, 5);
			console.log(p0, p1);
		}

		myP5.noFill();
		myP5.strokeWeight(5 - (timesRecursed/2));
		// Randomness in the strokes for variety
		myP5.stroke((myP5.millis()*30)%360, 100, 20+Math.random()*40, Math.random()*.4 + .3);
		myP5.line(...p0, ...p1);
		drawLine(p1, timesRecursed + 1);
	}

	// Starting from the current mouse position,
	// Draw a series of lines outward in a random direction from the end of the last line,
	// With each line thinner and shorter than the last, up to a max of 10
	if (myP5.frameCount % 10 == 0 && mousePositions.length > 0) {
		drawLine(mousePositions[mousePositions.length - 1], 1);
	}
}


document.addEventListener("DOMContentLoaded", function(){
	// The default tool is pencil, so change the cursor accordingly
	changeCursor('✏');
	
	// Add a processing instance

	// Create the processing instance, and store it in myP5, 
	// where we can access it anywhere in the code
	let element = document.getElementById("main");
	myP5 = new p5(
		// Run after processing is initialized
		function(p) {
			p.setup = () => {

				console.log("Do setup", p);

				p.createCanvas(768, 768);
				// Hue, Sat, Light
				// (0-360,0-100,0-100)
				p.colorMode(p.HSL);
				
				// The default tool is pencil, and its default color is black
				// This adds a color picker button below the canvas so the user can change the pencil color later
				pencilColor = p.createColorPicker('black');
				pencilColor.position((myP5.width / 2) + 75, myP5.height + 27);
				p.background('white');

			}

			p.mousePressed = () => {
				// Negative is like a stamp tool, run exactly once every time the mouse is clicked
				if (modeFun == negative) {
					modeFun();
				}
			}

			p.mouseDragged = () => {

				// Save this current mouse position in an array
				mousePositions.push([p.mouseX, p.mouseY]);

				// Negative and ghost run in places other than mouseDragged()
				if (modeFun != negative && modeFun != ghost) {
					modeFun();
				}
				
			}

			// Clear the mouse positions when the mouse is released
			// So the user can draw multiple curves without seeing weird glitches
			p.mouseReleased = () => mousePositions = [];

			p.draw = () => {
				// The ghost function runs in draw() and not mouseDragged()
				// Because mouseDragged() will not capture a clicked mouse that is not moving, but this will
				if (modeFun == ghost && p.mouseIsPressed) {
					modeFun();
				}

				// Draw the text box to label the tool (OPTIONAL)
				if (DEBUG) {
					p.noStroke()
					p.fill("white")
					p.rect(0, 0, 90, 30)
					p.fill("black")
					p.textSize(10)
					p.text("TOOL " + modeFun.name, 5, 20)
				}
			}
		}, 

		// A place to put the canvas
		element);
});

function drawCurve(color) {
	if (mousePositions.length > 1) {
		console.log("Penciling...");
		 if (DEBUG) {
			myP5.strokeWeight(10);
			myP5.stroke('red');
			mousePositions.filter((_, i) => i % 4 == 0).forEach(point => myP5.point(...point));
		} 
		myP5.strokeWeight(2);
		myP5.stroke(color);
		myP5.noFill();
		myP5.beginShape();
		mousePositions.filter((_, i) => i % 4 == 0).forEach(point => myP5.curveVertex(...point));
		myP5.endShape();
	}
}