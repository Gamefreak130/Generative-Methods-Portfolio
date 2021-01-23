const WIDTH = 500
const HEIGHT = 500

// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function(){
	console.log("Hello, animation!")

	// Rename your drawing here if you want
	let drawingTitles = ["Breathing Circles", 
		"The Hex", 
		"##TOKEN_NOT_FOUND##"
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
		// The diameter to expand out to starts as the canvas width
		maxDiameter = p.width;
	};

	let draw = p => {
		// Super low opacity means really long trails
		p.background(0, 100, 100, 0.009);

		let t = p.millis();
		// Diameter expands and contracts according to absolute value sine wave,
		// Giving an interesting breathing effect
		let diameter = Math.abs(Math.sin(t*0.0005))*maxDiameter;
		// Randomize the circle color and the next diameter to expand out to 
		// Once it stops contracting and starts expanding
		if (diameter < 10) {
			let h = p.random(360);
			let s = p.random(30, 50);
			let b = p.random(50, 70);
			p.fill(h,s,b, 0.5);
			p.strokeWeight(2);
			p.stroke(h, s-20, b+20);
			maxDiameter = Math.random()*p.width;
		}
		// Circle is always drawn in the center of the canvas
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
		// WebGL required for drawing 3D graphics
		p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
		// Get rid of jaggies
		p.setAttributes('antialias', true);
	};

	let draw = p => {
		let t = p.millis();
		// Lightness of the background is calculated according to a sine wave
		let lightMag = (Math.sin(t*0.001)*0.25)+0.5;
		p.background(0, 0, 0, lightMag);
		// 3D object position seems to be static, no matter when it's drawn
		// So we rotate the camera around it instead
		p.rotateX(t*0.001);
		p.rotateY(t*0.0015);
		// Make hex gold
		p.fill(50, 100, 50);
		// Allow the hex to be shiny and reflective
		// By setting the shininess and allowing the specular material to reflect gold
		p.shininess(5);
		p.specularMaterial(50, 100, 50);
		// Shine light on hex from a specific position
		// Allowing for neat reflection things
		p.ambientLight(128, 128, 128);
		p.directionalLight(128, 128, 128, 25, 25, -25);
		// Disable stroke so that wireframes are not drawn around the objects
		p.noStroke();
		// A torus with 6 x-axis vertices creates the basic hexagon shape
		p.torus(100, 10, 6, 24);
		// The sphere is reflective, but only in grayscale and not as much as the hex
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
	// Latin and Greek characters, katakana, and some hiragana are valid for the matrix code
	const matrixCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzΕΡΤΥΘΙΟΠΑΣΔΦΓΗΞΚΛΖΧΨΩΒΝΜςερτυθιοπασδφγηξκλζχψωβνμアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワウィいうえくけこさしたちつてとにのひんンれろわよらり';

	// Each cascading line has exactly one "head" which starts at a random height on the canvas
	// The initial head offset of each line is stored in this array
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
		// Only draw new characters and fade out existing ones every five frames
		// This keeps animation pretty smooth while also avoiding drawing characters too fast or too close together
		if (p.frameCount % 5 == 0) {
			p.background(0, 0, 0, 0.11);
			// Draw each cascading line
			for (var i = 0; i < offsets.length; i++) {
				let t = p.millis();
				// Get a random character from the valid code characters
				let randomChar = matrixCharacters.charAt(Math.floor(p.random(0, matrixCharacters.length)));
				let pct = i/offsets.length;
				let y = (offsets[i] + (t*0.3)) % HEIGHT;
				// Make the lines equally spaced apart (plus some offset to keep them centered in the canvas)
				let x = (pct*WIDTH) + 12;
				p.strokeWeight(2);
				p.stroke(150, 80, 100, .25); // When the alpha is reduced, this stroke creates a cool "glowing" effect
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