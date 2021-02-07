

// Outermost scope, 
// You can access these variables from *anywhere*, in fxns, or in html

// These get created when P5 is initialized
let SLIDERS = {

}

let FLAGS = {
	drawBugDebug: false,
	drawBoidDebug: false,
	drawRocketDebug: true,
	drawSnowDebug: false
}


let drawMode = "bug"

// Pause button, also pause on spacebar
let paused = false
document.onkeyup = function(e){
    if(e.key == " "){
        paused = !paused
    }
}



// Store our two Processing instances in the global scope
// so we can refer to them seperately when we want
let mainP5 = undefined
let lightmap = undefined


let simulationWidth = 600
let simulationHeight = 360


// an object to hold boids
const boidParticlesStartCount = 10
let boidFlock = new BoidFlock()

let coffeeCups = []
let coffeeCount = 3


let homeworkPages = []
let homeworkCount = 3


// Hold some snow
const snowParticleStartCount = 0
let snowParticles = []

// Rocket things
const rocketStartCount = 0
let rockets = []
for (var i = 0; i < rocketStartCount; i++) { 
	rockets.push(new Rocket())
}

// Initialize bug things
let bugs = []
let bugFood = []
let bugFoodCount = 0
let bugStartCount = 0
for (var i = 0; i < bugFoodCount; i++) {
	let pos = new Vector(Math.random()*simulationWidth, Math.random()*simulationHeight)
	bugFood.push(pos)
}
for (var i = 0; i< bugStartCount; i++) {
	let pos = [Math.random()*simulationWidth, Math.random()*simulationHeight]
	bugs.push(new Braitenbug(pos))
}


// Moving noise into the global scope so its not attached to P5 
let noise = function() {
	console.warn("Noise not yet initialized")
}



// Create a p5 slider, but ALSO, label it and append it to the controls object
function createSlider({label, min,max, defaultValue, step=1}) {
	SLIDERS[label] = mainP5.createSlider(min, max, defaultValue, step)

	let controls = document.getElementById("controls")
	let holder = document.createElement("div");
	holder.className = "slider"
	holder.innerHTML = label

	// Add things to the DOM
	controls.append(holder)
	holder.append(SLIDERS[label].elt)
}

// random point returns a point somewhere in this processing object
function randomPoint(p) {
	return [(Math.random())*p.width, (Math.random())*p.height]
}



// Do setup
document.addEventListener("DOMContentLoaded", function(){
	console.log("Steering")

	

	// Create the processing instances, and store it in mainP5 and lightmapP5, 
	// where we can access it anywhere in the code

	// Having two *separate canvases means we can draw into one and use it in the other
	
	// Create a new lightmap
	// It holds a red, green and blue channel.  You can draw into it
	lightmap = new Lightmap({
		fadeSpeed: 10, // 0: no fading, 100 instant fade
		drawChannels: function() {

			// A function that calls
			bugFood.forEach(spot => lightmap.drawBlurryLight({
				pt: spot, 
				channels: [0, 255, 0], 
				intensity: .4,
				size: 1.8
			}))


			bugs.forEach(boid => lightmap.drawBlurryLight({
				pt: boid.position, 
				channels: [0, 0, 255], 
				intensity: .4,
				size: 1.2
			}))

			coffeeCups.forEach(spot => lightmap.drawBlurryLight({
				pt: spot, 
				channels: [0, 255, 0], 
				intensity: .4,
				size: 1.8
			}))

			homeworkPages.forEach(spot => lightmap.drawBlurryLight({
				pt: spot, 
				channels: [255, 0, 0], 
				intensity: .4,
				size: 1.8
			}))

			boidFlock.boids.forEach(boid => lightmap.drawBlurryLight({
				pt: boid.position, 
				channels: [0, 0, 255], 
				intensity: 1,
				size: 0.5
			}))

		}
	})


	mainP5 = new p5(

		// Run after processing is initialized
		function(p) {

			// Set the noise function to P5's noise
			noise = p.noise

			p.setup = () => {

				// Basic setup tasks
				p.createCanvas(simulationWidth, simulationHeight);
				p.colorMode(p.HSL);
				p.background("white")


				for (var i = 0; i < snowParticleStartCount; i++) {
					let pt = new SnowParticle()
					snowParticles.push(pt)
				}

				for (var i = 0; i < coffeeCount; i++) {
					let pos = new Vector(p.random()*simulationWidth, p.random()*simulationHeight)
					coffeeCups.push(pos)
				}

				for (var i = 0; i < homeworkCount; i++) {
					let pos = new Vector(p.random()*simulationWidth, p.random()*simulationHeight)
					homeworkPages.push(pos)
				}


				// CREATE SLIDERS!!
				//createSlider({label:"forceDisplay", min:.1, max: 4, defaultValue: .4, step: .1})
				createSlider({label:"boidCohesion", min:0, max: 200, defaultValue: 40})
				createSlider({label:"boidAlignment", min:0, max: 200, defaultValue: 50})
				//createSlider({label:"boidWander", min:0, max: 200, defaultValue: 50})

				//createSlider({label:"katesNoiseScale", min:.1, max: 4, defaultValue: .4, step: .1})
				//createSlider({label:"katesWiggleForce", min:.1, max: 4, defaultValue: .4, step: .1})
				createSlider({label:"Drag", min:.001, max: .1, defaultValue: .02, step: .001})
				//createSlider({label:"katesBorder", min:1, max: 100, defaultValue: 30, step: 1})
				
			}

			p.mouseClicked = () => {
				let t = p.millis()*.001

				// Processing likes to greedily respond to *all* mouse events, 
				// even when outside the canvas
				// This code checks to see if we're *actually* in the P5 window before responding
				// Use this code if you implement dragging, too
				// From https://stackoverflow.com/questions/36767196/check-if-mouse-is-inside-div
				
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {
					//Mouse is inside element
						
					let mousePos = new Vector(p.mouseX, p.mouseY)
							

					// Make a new boid
					switch(drawMode) {
						case "boid": 
							boidFlock.addBoid(mousePos)
							break;
						case "bug": 
							bugs.push(new Braitenbug(mousePos))
							break;
						case "snow": 
							snowParticles.push(new SnowParticle(mousePos))
							break;
						case "spring": 
							springSystem.add(mousePos)
							break;
						case "rocket": 
							rockets.push(new Rocket(mousePos))
							break;
					}
				} 
			}


			p.draw = () => {
				p.background(210, 70, 60, 1)

				// Not updating the background
				let t = p.millis()*.001
				let dt = p.deltaTime*.001


				//-------------------
				// Kateparticles 

				// UPDATE! 
				if (!paused) {
					bugs.forEach(b => b.update(t, dt))
					boidFlock.update(t, dt)				
					snowParticles.forEach(pt => pt.update(t, dt))		
					rockets.forEach(pt => pt.update(t, dt))		
				}

				// Draw bugs
				if (FLAGS.drawBugDebug) {
					lightmap.debugDraw(p)


					bugs.forEach(b => b.debugDraw(p))
				}

				// Move the food around
				bugFood.forEach((food, index) => {
					food[0] = (3*simulationWidth*noise(t*.025, index))%simulationWidth
					food[1] = (3*simulationHeight*noise(t*.025, index + 100))%simulationHeight
				})

				coffeeCups.forEach((food, index) => {
					food[0] += 2*(noise(t*0.1, index) - 0.5)
					food[0] = (food[0] + simulationWidth)%simulationWidth
					food[1] += 2*(noise(t*0.1, index + 100) - 0.5)
					food[1] = (food[1] + simulationHeight)%simulationHeight
				})

				homeworkPages.forEach((page, index) => {
					page[0] += 2*(noise(t*0.1, index) - 0.5)
					page[0] = (page[0] + simulationWidth)%simulationWidth
					page[1] += 2*(noise(t*0.1, index + 100) - 0.5)
					page[1] = (page[1] + simulationHeight)%simulationHeight
				})

				p.fill(130, 100, 50)
				p.stroke(170, 100, 30)
				bugFood.forEach(food => p.circle(...food, 10))
				bugs.forEach(b => b.draw(p))

				p.textSize(15)
				coffeeCups.forEach(food => p.text('☕', ...food))
				homeworkPages.forEach(page => p.text('📝', ...page))

				// Draw boids
				boidFlock.draw(p)
				if (FLAGS.drawBoidDebug) {
					boidFlock.debugDraw(p)
				}
				
				// Draw snow things
				snowParticles.forEach(pt => pt.draw(p))
				if (FLAGS.drawSnowDebug) {
					debugDrawSnow(p, t)
				}
					
				// Draw rockets
				rockets.forEach(rocket => rocket.draw(p, t))
				if (FLAGS.drawRocketDebug) {
					rockets.forEach(rocket => rocket.debugDraw(p))
				}

				//Uncomment for the detail window, if you want it
				// p.fill(0, 0, 100, .8)
				// p.noStroke()
				// p.rect(0, 0, 100, 50)
				// p.fill("black")
				// p.text(drawMode, 5, 10)
					
			}
		}, 

	// A place to put the canvas
	document.getElementById("main"));
})
