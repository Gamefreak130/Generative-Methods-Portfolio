// Outermost scope, 
// You can access these variables from *anywhere*, in fxns, or in html
let myP5 = undefined
let mode = "mountains"
let modeFun = pencil;
let mousePositions = []
let pencilColor;
let electricityColor;
let DEBUG = false;

function clearCanvas() {
	myP5.background("white");
}

function rainbowClearCanvas() {
	myP5.background(Math.random()*360, 80, 80);
}

function changeCursor(text) {
	console.log(`Changing cursor to ${text}`);
	document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="32" style="font-size: 20px;"><text x="-1" y="18">${text}</text></svg>'), auto`;
}

function pencil() {
	drawCurve(pencilColor.color());	
}

function rainbow() {
	if (mousePositions.length > 0) {
		console.log("Rainbowing...");
		myP5.stroke((myP5.mouseX + myP5.mouseY)%360, 90, 60);
		myP5.strokeWeight(50);
		myP5.point(...mousePositions[mousePositions.length - 1]);
	}
}

function ghost() {
	if (myP5.mouseX >= 0 && myP5.mouseY >= 0) {
		console.log("Ghosting...");
		myP5.background(0, 100, 100, 0.1);
	}
}

function negative() {
	if (myP5.mouseX >= 0 && myP5.mouseY >= 0) {
		console.log("Negativeing...");
		const radius = 50;
		myP5.loadPixels();
		for (x = myP5.mouseX - radius; x <= myP5.mouseX + radius; x++) {
			for (y = myP5.mouseY - radius; y <= myP5.mouseY + radius; y++) {
				// p.set() if fine performance-wise, but p.get() is WAY too slow for this many pixels
				// So we have to access the pixel buffer directly to get the color
				let off = (Math.floor(y) * myP5.width + Math.floor(x)) * 4;
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

function electricity() {
	if (!electricityColor || myP5.frameCount % 10 == 0) {
		electricityColor = myP5.color((myP5.millis()*30)%360, 100, 20+Math.random()*40, Math.random()*.4 + .3);
	}

	drawCurve(electricityColor);

	let maxRecursion = 10;

	let drawLine = (p0, timesRecursed) => {
		let length = (10 + 30*Math.random())*2.5 / timesRecursed;
		if (timesRecursed == maxRecursion) return;
		let p1 = vector.getAddPolar(p0, length, 20*myP5.noise(...p0));

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

	if (myP5.frameCount % 10 == 0 && mousePositions.length > 0) {
		drawLine(mousePositions[mousePositions.length - 1], 1);
	}
}


document.addEventListener("DOMContentLoaded", function(){
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
				p.colorMode(p.HSL);
				p.pixelDensity(1);
				
				// Hue, Sat, Light
				// (0-360,0-100,0-100)
				pencilColor = p.createColorPicker('black');
				pencilColor.position((myP5.width / 2) + 75, myP5.height + 27);
				p.background('white');

			}

			p.mousePressed = () => {
				if (modeFun == negative) {
					modeFun();
				}
			}

			p.mouseDragged = () => {
				// Save this current mouse position in an array
				// .... but what will you do with an array of vectors?
				mousePositions.push([p.mouseX, p.mouseY]);

				if (modeFun != negative && modeFun != ghost) {
					modeFun();
				}

				/*switch(mode) {
					case "garland":
						let speed = Math.sqrt(p.movedX*p.movedX + p.movedY*p.movedY)

						let allEmoji = ["🌸","🌷","🌹","🌼","🌺","✨","💖"]
						let emojiIndex = Math.floor(Math.random()*allEmoji.length)
						let emoji = allEmoji[emojiIndex]
						
						// Draw the emoji at the mouse
						p.textSize(2*speed + 6)

						// Try out some blend modes
						// p.blendMode(p.MULTIPLY);
						// p.blendMode(p.OVERLAY);
						// p.blendMode(p.SCREEN);
						// p.blendMode(p.DIFFERENCE);

						p.text(emoji, p.mouseX + Math.random()*speed, p.mouseY + Math.random()*speed)
						// Turn back to normal
						p.blendMode(p.BLEND);
						break;

					case "smudge":
						// Draw scattered circles
						p.noStroke()
						p.fill((Math.random()*30 + t*40)%360, 100, 50 + Math.random()*30)
						p.circle(p.mouseX + Math.random()*10, p.mouseY + Math.random()*10, 3 + Math.random())
					
						break;

					case "thread":
						
						// The current vector
						let p0 = [p.mouseX, p.mouseY]

						let hairCycle = t*1
							
						for (var i = 0; i < 10; i++) {
							let hairLength = 10 + 30*Math.random()
							let cp0 = vector.getAddPolar(p0, hairLength, 20*p.noise(hairCycle))
							let cp1 = vector.getAddPolar(cp0, hairLength, 20*p.noise(hairCycle + 10))
							let p1 = vector.getAddPolar(cp1, hairLength, 20*p.noise(hairCycle + 20))
						

							// p.noStroke()
							// p.fill(0)
							// p.circle(...p0, 5)
							// p.circle(...p1, 5)
							// p.fill(150, 100, 40)
							// p.circle(...cp0, 3)
							// p.circle(...cp1, 3)
							// console.log(p0, cp0, cp1, p1)

							p.noFill()
							p.strokeWeight(1 + Math.random())
							// Randomness in the strokes for variety
							p.stroke((t*30)%360, 100, 20+Math.random()*40, Math.random()*.4 + .3)
							p.bezier(...p0, ...cp0, ...cp1, ...p1)
						}
						break;

					case "mountains":
						drawBeziers(p, mousePositions)
						break;
				
					default: 
						console.warn("UNKNOWN TOOL");
				}*/
				
			}

			p.mouseReleased = () => mousePositions = [];

			p.draw = () => {
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
})


// Use the Pixel buffer to "smudge" pixels by 
// linearly interpolating their colors with some other color
function smearPixels(p) {
	// Smear the pixels down from here
	// console.log("smudge2")
	p.loadPixels();

	// Get the current mouse position
	let x = Math.floor(p.mouseX)
	let y = Math.floor(p.mouseY)

	for (var i = 0; i < 10; i++) {
		let x2 = x + i
		
		let lastColor = p.get(x2, y)


		let dripDistance = Math.random()* Math.random()*150
		for (var j = 0; j < dripDistance; j++) {
			let dripPct = j/dripDistance

			let y2 = y + j

			// Get the current color and blend it with the last color
			let pixelColor = p.get(x2, y2)
			let finalColor = vector.lerp(pixelColor, lastColor, 1 - dripPct)
			
			if (x2 > 0 && x2 < p.width && y2 > 0 && y2 < p.height)
				p.set(x2, y2, finalColor)
			
			// Save this color to blend with later pixels
			lastColor = finalColor

		}
	}
	p.updatePixels();
}

// Using a lot of mouse positions to do... something
function drawBeziers(p, mousePositions) {
	// Draw some vectors
	
	// Get every 7th point in the array
	let everyOther = mousePositions.filter((element, index) => {
		return (mousePositions.length - index) % 7 === 0;
	})

	// Take the last N positions
	let count = 2
	let pts = everyOther.slice(everyOther.length - count)

	// Now we have 5 points, sampled every 7th point, starting at the end
	// So we can draw "backward" from the end

	if (pts.length > 0) {
		p.stroke(0)
		p.fill(Math.random()*360, 100, 50, .2)

		p.beginShape()
		p.vertex(...pts[0])
		
		// Draw each segment of a bezier curve 
		// (start at index=1!)
		for (var i = 1; i < pts.length; i++) {
			// For this segment, we draw between 2 pts
			let pt0 = pts[i - 1]
			let pt1 = pts[i]
			let d = vector.getSub(pt1, pt0)
			let mag = vector.magnitude(d)
			let n = [-d[1], d[0]]

			let cp0 = pt0.slice(0)
			let cp1 = pt1.slice(0)
			cp0[1] -= mag
			cp1[1] -= mag
			
			// vector.addTo(cp1, n)


			p.bezierVertex(...cp0, ...cp1, ...pt1)
		}

		p.endShape()
	}
}

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