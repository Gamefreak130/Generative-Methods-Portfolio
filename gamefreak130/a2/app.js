const WIDTH = 500
const HEIGHT = 500

// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function(){
	console.log("Hello, animation!")

	// Rename your drawing here if you want
	let drawingTitles = ["Breathing Circles", 
		"types of movement", 
		"text and trails", 
		"transformation matrixes",
		"polar coordinates",
		"looping noise",
		"shapes",
		"using functions",
		"SVGs and masking"
		]
	let mainElement = document.getElementById("main")
		
	// Ignore this section if you want
	// This is me adding a label and a canvas-holder to each swatch
	// For each drawing
	for (var i = 0; i < 9; i++) {
		let el = document.createElement("div")
		el.className = "drawing"
		el.id = "drawing" + i
		mainElement.append(el)


		// Add a label
		let label = document.createElement("div")
		label.className = "drawing-label"
		label.innerHTML = "Drawing #" + i + ": " + drawingTitles[i]
		el.append(label)

		// Add a div to hold the canvas (so we can resize it independently of the outer frame)
		let canvasHolder = document.createElement("div")
		canvasHolder.className = "drawing-p5holder"
		canvasHolder.style = `width:${WIDTH};height:${HEIGHT}`
		el.append(canvasHolder)
	}

	// Comment out these lines to not draw each
	setupDrawing0()
	setupDrawing1()
	setupDrawing2()
	// setupDrawing3()
	// setupDrawing4()
	// setupDrawing5()
	// setupDrawing6()
	// setupDrawing7()
	// setupDrawing8()

});

function getP5Element(index) {
	return document.getElementById("drawing" + index).getElementsByClassName("drawing-p5holder")[0]
}

function setupDrawing0() {
	let maxDiameter;

	let setup = p => {
		// Create the canvas in the right dimension
		p.createCanvas(WIDTH, HEIGHT);

		// Set the color mode 
		p.colorMode(p.HSL);

		// Set the background to black 
		p.background(0, 100, 100);

		maxDiameter = p.width;
	}

	let draw = p => {
		p.background(0, 100, 100, 0.009);
		let t = p.millis();
		let diameter = Math.abs(Math.sin(t*0.0005))*maxDiameter;
		if (diameter <= 10) {
			let h = p.random(360);
			let s = p.random(30, 50);
			let b = p.random(50, 70);
			p.fill(h,s,b, 0.5);
			p.strokeWeight(2);
			p.stroke(h, s-20, b+20);
			maxDiameter = p.random()*p.width;
		}
		p.translate(p.width/2, p.height/2);
		p.circle(0, 0, diameter);
	};

	let element = getP5Element(0) // My function to get the element for this index
	new p5(function(p) {
		p.setup = () => setup(p)
		p.draw = () => draw(p)
	}, element);
}

function setupDrawing1() {
	let element = getP5Element(1) // My function to get the element for this index
	new p5(function(p) {
		p.setup = () => setup(p)
		p.draw = () => draw(p)
	}, element);
}