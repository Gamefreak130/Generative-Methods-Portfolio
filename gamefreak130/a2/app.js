const WIDTH = 500
const HEIGHT = 500

// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function(){
	console.log("Hello, animation!")

	// Rename your drawing here if you want
	let drawingTitles = ["Breathing Circles", 
		"The Hex", 
		"##TOKEN-NOT-FOUND##"
		]
	let mainElement = document.getElementById("main")
		
	// This is me adding a label and a canvas-holder to each swatch
	// For each drawing
	for (var i = 0; i < 3; i++) {
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

		maxDiameter = p.width;
	};

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

	let element = getP5Element(0); // My function to get the element for this index
	new p5(p => {
		p.setup = () => setup(p);
		p.draw = () => draw(p);
	}, element);
}

function setupDrawing1() {
	let setup = p => {
		p.colorMode(p.HSL);
		p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
		p.setAttributes('antialias', true);
	};

	let draw = p => {
		let t = p.millis();
		let lightMag = (Math.sin(t*0.001)*0.25)+0.5;
		p.background(0, 0, 0, lightMag);
		p.rotateX(t*0.001);
		p.rotateY(t*0.0015);
		p.fill(50, 100, 50);
		p.shininess(1);
		p.ambientLight(128, 128, 128);
		p.directionalLight(128, 128, 128, 25, 25, -25);
		p.specularMaterial(50, 100, 50);
		p.noStroke();
		p.torus(100, 10, 6, 24);
		p.specularMaterial(79);
		p.shininess(1);
		p.sphere(50, 10, 10);
	};

	let element = getP5Element(1);
	new p5(p => {
		p.setup = () => setup(p);
		p.draw = () => draw(p);
	}, element);
}

function setupDrawing2() {
	const matrixCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()?ΕΡΤΥΘΙΟΠΑΣΔΦΓΗΞΚΛΖΧΨΩΒΝΜςερτυθιοπασδφγηξκλζχψωβνμアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワウィいうえくけこさしたちつてとにのひんンれろわよらり';

	let offsets = new Array(15);
		for (var i = 0; i < offsets.length; i++) {
			offsets[i] = Math.floor(Math.random()*HEIGHT);
		}

	let setup = p => {
		p.createCanvas(WIDTH, HEIGHT);
		p.colorMode(p.HSL);
		p.background(0, 0, 0);
	};

	let draw = p => {
		if (p.frameCount % 5 == 0) {
			p.background(0, 0, 0, 0.1);
			for (var i = 0; i < offsets.length; i++) {
				let t = p.millis();
				let randomChar = matrixCharacters.charAt(Math.floor(p.random(0, matrixCharacters.length)));
				let pct = i/offsets.length;
				let y = (offsets[i] + (t*0.3)) % HEIGHT;
				let x = (pct*WIDTH) + 12;
				p.strokeWeight(3);
				p.stroke(150, 80, 70, .25); // Oh, this looks nice if I reduce the alpha
				p.fill(150, 100, 50);
				p.textFont('Trebuchet MS');
				p.text(randomChar, x, y);
			}
		}
	};

	let element = getP5Element(2);
	new p5(p => {
		p.setup = () => setup(p);
		p.draw = () => draw(p);
	}, element);
}