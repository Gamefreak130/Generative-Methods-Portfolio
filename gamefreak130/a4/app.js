

// Outermost scope, 
// You can access these variables from *anywhere*, in fxns, or in html

// These get created when P5 is initialized
let SLIDERS = {

}

let FLAGS = {
	drawBusybodyDebug: false,
	drawObjectDebug: false,
	drawLazybonesDebug: false,
	showClock: false
}


let drawMode = "busybody"

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


let simulationWidth = 810
let simulationHeight = 486


const busybodyStartCount = 10
let busybodyFlock = new BoidFlock()
for (var i = 0; i < busybodyStartCount; i++) {
	new Busybody()
}

const lazybonesStartCount = 4
let lazybonesFlock = new BoidFlock()
for (var i = 0; i < lazybonesStartCount; i++) {
	new Lazybone()
}


const coffeeStartCount = 4
let coffeeCups = []
for (var i = 0; i < coffeeStartCount; i++) {
	coffeeCups.push(new ObjectParticle('☕'))
}


const homeworkStartCount = 4
let homeworkPages = []
for (var i = 0; i < homeworkStartCount; i++) {
	homeworkPages.push(new ObjectParticle('📄'))
}

let simTime = new Date(0)
simTime.setHours(10)
simTime.setMinutes(0)


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

// Show/Hide the Lightmap in the corner
function toggleLightmap() {
	let lm = document.getElementById('lightmap')
	if (lm.style.visibility == 'hidden') {
		console.log('unhiding')
		lm.style.visibility = 'visible';
	}
	else {
		console.log('hiding')
		lm.style.visibility = 'hidden'
	}
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

			coffeeCups.forEach(cup => lightmap.drawBlurryLight({
				pt: cup.position, 
				channels: [0, 255, 0], 
				intensity: .4,
				size: 1.8
			}))

			homeworkPages.forEach(page => lightmap.drawBlurryLight({
				pt: page.position, 
				channels: [255, 0, 0], 
				intensity: .4,
				size: 1.8
			}))

			busybodyFlock.boids.forEach(boid => lightmap.drawBlurryLight({
				pt: boid.position, 
				channels: [0, 0, 255], 
				intensity: 1,
				size: 0.5
			}))

			lazybonesFlock.boids.forEach(boid => lightmap.drawBlurryLight({
				pt: boid.position, 
				channels: [0, 255, 255], 
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


				// CREATE SLIDERS!!
				createSlider({label:"BusybodyCohesion", min:0, max: 200, defaultValue: 30})
				createSlider({label:"LazybonesCohesion", min:0, max: 200, defaultValue: 100})
				createSlider({label:"CoffeeAttraction", min:0, max: 200, defaultValue: 100})
				createSlider({label:"HomeworkAttraction", min:0, max: 200, defaultValue: 100})
				createSlider({label:"Drag", min:.001, max: .1, defaultValue: .02, step: .001})
				
			}

			p.mouseClicked = () => {

				// Processing likes to greedily respond to *all* mouse events, 
				// even when outside the canvas
				// This code checks to see if we're *actually* in the P5 window before responding
				// Use this code if you implement dragging, too
				// From https://stackoverflow.com/questions/36767196/check-if-mouse-is-inside-div
				
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {
					//Mouse is inside element
						
					let mousePos = new Vector(p.mouseX, p.mouseY)
							

					// Place a new thing onto the canvas
					switch(drawMode) {
						case "busybody": 
							new Busybody(mousePos)
							break;
						case "coffee": 
							coffeeCups.push(new ObjectParticle('☕', mousePos))
							break;
						case "homework": 
							homeworkPages.push(new ObjectParticle('📄', mousePos))
							break;
						case "lazybone": 
							new Lazybone(mousePos)
							break;
					}
				} 
			}


			p.draw = () => {

				let t = p.millis()*.001
				let dt = p.deltaTime*.001

				// UPDATE! 
				if (!paused) {
					if (p.frameCount % 4 == 0) {
						simTime.setSeconds(simTime.getSeconds() + 60);
					}
					busybodyFlock.update(t, dt)			
					lazybonesFlock.update(t, dt)	
					coffeeCups.forEach(cup => cup.update(t, dt))
					homeworkPages.forEach(page => page.update(t, dt))		
				}

				let dayLevel = (Math.sin((simTime.getTime()*.0000000727)+2.15)*30)+30
				p.background(210, 70, dayLevel, 1)

				// Draw busybodies
				busybodyFlock.draw(p)
				if (FLAGS.drawBusybodyDebug) {
					busybodyFlock.debugDraw(p)
				}

				// Draw lazybones
				lazybonesFlock.draw(p)
				if (FLAGS.drawLazybonesDebug) {
					lazybonesFlock.debugDraw(p)
				}

				// Draw objects
				coffeeCups.forEach(cup => cup.draw(p))
				homeworkPages.forEach(page => page.draw(p))

				// Draw windmap
				if (FLAGS.drawObjectDebug) {
					//lightmap.debugDraw(p)
					debugDrawWindmap(p, t)
				}
				
				if (FLAGS.showClock) {
					p.fill(0, 0, 100, .8)
					p.noStroke()
					p.rect(0, 0, 80, 20)
					p.fill("black")
					p.text(simTime.toLocaleTimeString('en-US', { timeStyle: "short" }), 8, 15)
				}
					
			}
		}, 

	// A place to put the canvas
	document.getElementById("main"));
})
