


// Moving noise into the global scope so its not attached to P5
let noise = () => {}
const canvasW = 640
const canvasH = 480
const dimensions = 10
let offset = new Vector(0,0)


let masks = {}


let SLIDER = {
	zoom: 0,
	voronoiLerp: .9,
	trails: 0,
	hue: .5,
	sat: .5,
	light: .5, 
}

let app = {
	zoom: 1,
	smooth: 0,

	// Use static data
	inputting: true,
	inputVector: undefined,
	paused: false,
	useHandsFree: true,
	staticPlayback: false,
	recording: false,
	recordingData: {hand:[],face:[]},
	mouse: new Vector(),


	// Store the mask instance, if its a class-based mask
	maskInstance: undefined,
	maskFxn: undefined,
	maskID: undefined,

	setMask(id) {
		app.maskID = id
		
		app.maskInstance = undefined
		app.maskFxn = undefined
		if (typeof masks[id] === "function") {
			 if (isClass(masks[id])) {
			 	app.maskInstance = new masks[id]()
			 } else {
			 	app.maskFxn = masks[id]
			 }
			console.log("set to fxn")
		}
	},


	init() {
	
		if (app.useHandsFree)
			initHandsFree()
		else {
			initTestData()
		}

		document.getElementById("emotionInput").focus();

		//app.setMask(app.startMask)

		// initVideo()
		// document.getElementById('image').appendChild(app.image);
	},

	submitInput() {
		str = document.getElementById("emotionInput").value;
		if (str !== "") {
			app.buildArray(str);
			document.getElementById("input-modal").hidden = true;
			app.inputting = false;
			words = str.split(" ");
			// Remove duplicates from array
			words = [...new Set(words)];
			for (label of document.querySelectorAll("td.label")) {
				let i = Math.floor(Math.random()*words.length);
				label.innerText = words[i];
				if (words.length > 3) {
					words.splice(i, 1);
				}
			}
			app.startMask();
			
		}
	},

	startMask() {
		// Plug in calculated array
		SLIDER.trails = (app.inputVector.coords[0]/5)%1 + 0.2;
		SLIDER.hue = app.inputVector.coords[1] % 360;
		SLIDER.sat = (app.inputVector.coords[2]*5) % 100;
		SLIDER.light = app.inputVector.coords[3]*5 % 80;
		SLIDER.voronoiLerp = (app.inputVector.coords[4] / 19.0) % 1 + 0.05;
		tracery.setRng(new Math.seedrandom(app.inputVector.coords[5]*8));

		app.setMask("voronoiMask");
	},

	getInput() {
		document.getElementById("emotionInput").value = "";
		document.getElementById("input-modal").hidden = false;
		document.getElementById("emotionInput").focus();
		app.inputting = true;
		app.setMask(0);
	},

	buildArray(str) {
		app.inputVector = new Vector.empty(6);
		for (i = 0; i < str.length; i++) {
			app.inputVector.coords[i % 6] = (app.inputVector.coords[i % 6] + str.charCodeAt(i));
		}
		
	},

	draw(p, t) {
		if (!app.inputting) {
			let frameCount = p.frameCount
			// console.log(frameCount)
			let dt = p.deltaTime*.001
			

			p.push()
			p.translate(p.width/2, p.height/2)
			
			let relOffset = Vector.add(offset, app.mouse.dragOffset)
			relOffset.mult(-1)
			p.translate(...relOffset.coords)
			
			app.zoom = (SLIDER.zoom*8)**1.5 + 1
			p.scale(app.zoom, app.zoom)

		
		
			if (app.maskFxn) {
				app.maskFxn(p, t)
			}

			if (app.maskInstance) {
				app.maskInstance.update(t, dt, frameCount)	
				app.maskInstance.draw(p, t)	
			}
			// drawTestPoints(p)
		}

		

	}


}





// Setup and Vue things
document.addEventListener("DOMContentLoaded", function(){
	

	// CONTROLS
	// UI to control things *not* handled by individual AOFs
	new Vue({
		el : "#controls",
		template: `
		<div id="controls" class="row">

			<!--<select @change="setMask" val="app.startMask">	
				<option v-for="id in Object.keys(masks)" >{{id}}</option>
			</select>-->
			<p>
			Recording:
			{{app.recordingData.face.length}}
			</p>
			
			<div class="btn-group" role="group" aria-label="Controls">
				<button class="btn btn-outline-secondary" @click="app.recording=!app.recording" :class="{toggled:app.recording}">Record</button>
				<button class="btn btn-outline-secondary" @click="saveData()">Copy</button>
				<button class="btn btn-outline-secondary" @click="saveHandData()">Copy Hands</button>
				<button class="btn btn-outline-secondary" @click="app.getInput()">New Mask</button>
			</div>
			<table>	
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['zoom']}}</div>
						<input type="range" min="0" max="1" :step=".001" class="slider" v-model="sliders['zoom']"  />
					</td>
				</tr>
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['voronoiLerp']}}</div>
						<input type="range" min="0" max="1" :step=".001" class="slider" v-model="sliders['voronoiLerp']"  />
					</td>
				</tr>
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['trails']}}</div>
						<input type="range" min="0.2" max="1" :step=".001" class="slider" v-model="sliders['trails']"  />
					</td>
				</tr>
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['hue']}}</div>
						<input type="range" min="0" max="359" :step="1" class="slider" v-model="sliders['hue']"  />
					</td>
				</tr>
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['sat']}}</div>
						<input type="range" min="0" max="100" :step="1" class="slider" v-model="sliders['sat']"  />
					</td>
				</tr>
				<tr>
					<td class="label"></td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders['light']}}</div>
						<input type="range" min="0" max="100" :step="1" class="slider" v-model="sliders['light']"  />
					</td>
				</tr>
			</table>
			
		</div>`, 

		methods: {

			setMask(ev) {
				console.log(ev.target.value)
				app.setMask(ev.target.value)
			},
			saveData() {
				let output = 'let testFaceData = ' + neatJSON(app.recordingData.face, {decimals:1})
				console.log(output)
				navigator.clipboard.writeText(output);
			},
			saveHandData() {
				let output = 'let testHandData = ' + neatJSON(app.recordingData.hand, {decimals:1})
				console.log(output)
				navigator.clipboard.writeText(output);
			}
		},
		computed: {
		},
		data() {
			return {
				sliders: SLIDER,
				app: app,
				masks: masks,
			}
		}
	})

	// P5
	new Vue({
		el : "#app",
		template: `<div id="app">
			<div id="p5-holder" ref="p5"></div>

		</div>`,


		mounted() {
			app.p5 = new p5((p) => {
				// Save the noise fxn
				noise = p.noise
				// Save a mouse position
				
				app.mouse.dragStart = new Vector()
				app.mouse.dragOffset = new Vector()

				// Basic P5 setup
				p.setup = () => {
					p.createCanvas(canvasW, canvasH)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)
				}

				//-------------------------------------------
				// Mouse things

				// Utility fxn to test if mouse in p5
				function mouseInP5() {
					return !app.inputting && p.mouseX > 0 && p.mouseX < canvasW && p.mouseY > 0 && p.mouseY < canvasH
				}

				p.mousePressed = () => {
					if (mouseInP5()) {
						app.mouse.dragging = true
						app.mouse.dragStart.setTo(p.mouseX, p.mouseY)
					}
				}
				p.mouseReleased = () => {
					app.mouse.dragging = false
					offset.add(app.mouse.dragOffset)
					app.mouse.dragOffset.setTo(0, 0)
				}
				
				p.mouseMoved = () => { app.mouse.setTo(p.mouseX, p.mouseY) }
				p.mouseDragged = () => {
					app.mouse.setTo(p.mouseX, p.mouseY)
					if (app.mouse.dragging) {
						app.mouse.dragOffset.setToDifference(app.mouse.dragStart, app.mouse)
						console.log(app.mouse.dragOffset.toFixed(2))
					}
				}
				p.doubleClicked = () => {}

				p.mouseClicked = () => {}

				//-------------------------------------------
				// Draw

				p.draw = () => {
					
					//-------------------
					// UPDATES
					let frameCount = p.frameCount
					let t = p.millis()*.001
					let dt = p.deltaTime*.001
					
					for (key in SLIDER) {
						if (typeof SLIDER[key] === "string")
							SLIDER[key] = parseFloat(SLIDER[key])
					}

					// Run some update code every frame
					if (app.recording) {
						app.recordingData.face.push(face.points.map(pt => pt.coords.slice(0)))

						let handData = hand.map(h => h.points.map(pt => pt.coords.slice(0)))
						app.recordingData.hand.push(handData)
					}

					//-------------------------
					// DRAWING
					
					// p.background(190, 80, 30)
					app.draw(p, t)
					
				}

			}, this.$refs.p5)


			app.init()
		},
		
		data() {
			return {
				output: "",
				app: app,
			}
		}
		
	}) 
})

//============
// Utilities
// Returns a value between 0 and 1, but never reaching either

// https://zaiste.net/posts/javascript-class-function/
function isClass(func) {
  return typeof func === 'function'
    && /^class\s/.test(Function.prototype.toString.call(func));
}

function sigmoid(v) {
	return 1 / (1 + Math.pow(Math.E, -v));
}

function unitSigmoid(v, range=1) {
	return 1 / (1 + Math.pow(Math.E, -range*(v - .5)));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

document.addEventListener('keydown', function(e){
	if (app.inputting) {
		if (e.code === "Enter") {
			app.submitInput();
		}
	}
	else {
		if (e.code === "Space") {
			app.paused = !app.paused
			console.log("paused", app.paused)
		}
	}
});
