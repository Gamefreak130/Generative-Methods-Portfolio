let SLIDERS = {}

// Moving noise into the global scope so its not attached to P5
let noise = () => {}
const canvasW = 800
const canvasH = 400


let app = {

	mutation: .3,

	// Toggles
	showGraph: false,
	
	// Selected individuals
	hovered: undefined,
	selected: undefined,

	audio: new AudioPlayer(),

	// All current individuals
	individuals: [],

	currentClass: Building,
	xaxis: Building.labels[0],
	yaxis: Building.labels[1],

	popCount: 5,
	
	// Create a bunch of individuals
	populate() {

		app.individuals = []
		for (var i = 0; i < app.popCount; i++) {

			// Create an array of floats

			// SET UP DNA
			let aof = new AoF(app.currentClass.labels)
			if (app.selected) {
				console.log("Evolve with parent", app.selected)
				aof.cloneParent(app.selected.aof, app.mutation)
			}
			

			console.log("CURRENT CLASS", app.currentClass)
			// Create an indivudual with this "dna"
			let individual = new app.currentClass(aof)
			console.log("MADE ", individual)
			//----
			// Layout...
			// You can change this if you want to draw your individuals laid out differently
			// Get the pct of this one for doing layout
			let pct = app.popCount==1?.5:i/(app.popCount - 1)
			let x = canvasW*.5 + (canvasW - 100)*.9*(pct - .5)
			individual.center.coords[0] = x
			individual.center.coords[1] = 280

			// Save to an array
			app.individuals.push(individual)
		}

		app.selected = app.individuals[0]
		
	},

	loadByAOF(vals) {
		console.log(vals)
		if (!app.selected)
			app.selected = app.individuals[0]
		app.selected.aof.setValues(vals)
	},

	update(t, dt) {
		app.individuals.forEach((individual,index) => {
			
			// Update my AOF
			individual.aof.update(t, dt)
			individual.update(t, dt)
		})			
	},

	draw(p) {
		// Sort individuals back to front for drawing multiples
		individualsSorted = app.individuals.sort((a,b) => {
			return a.center.coords[1] - b.center.coords[1]
		})

		// Draw everyone laid out
		individualsSorted.forEach((individual, index) => {
			p.push()
			p.translate(...individual.center.coords)

			// Draw a highlight at the base of the selected/hovered object
			p.noStroke()
			p.fill(0)
			if (app.hovered === individual) {
				p.stroke(100, 100, 100, .3)
				p.strokeWeight(10)
			}
			if (app.selected === individual) {
				p.stroke(100, 100, 100, 1)
				p.strokeWeight(10)
			}

			p.fill(...individual.aof.idColor, .4)
			p.ellipse(0, 0, 70, 20)


			individual.draw(p)
			p.pop()
		})
	}


}




// Setup and Vue things
document.addEventListener("DOMContentLoaded", function(){
	
	// CONTROLS
	// UI to control things *not* handled by individual AOFs
	new Vue({
		el : "#controls",
		template: `<div id="controls">
			<div class="input-group">
				<select class="form-select form-select-sm" v-model="app.xaxis">
					<option v-for="label in app.currentClass.labels">{{label}}</option>
				</select>
				<select class="form-select form-select-sm" v-model="app.yaxis">
					<option v-for="label in app.currentClass.labels">{{label}}</option>
				</select>
				<button class="btn btn-outline-secondary btn-sm" title="Reroll Graph Axes" @click="randomAxes">🎲</button>
			</div>

			<div>
				Mutation: <input type="range" min="0" max="1" :step=".001" class="slider" v-model="app.mutation" />
				<button class="btn btn-outline-secondary btn-sm" title="Reroll All" @click="reroll">🎲</button>
			</div>


			<aof-sliders :aof="aof" v-if="aof"/>

			<audio-player :audio="app.audio" />
			<p>Landmarks:</p>
			<div class="btn-group">
				<button class="btn btn-outline-secondary btn-sm" v-for="(landmarkAOF,landmarkName) in app.currentClass.landmarks" @click="app.loadByAOF(landmarkAOF, landmarkName)">{{landmarkName}}</button>
			</div>
			<div>

				<button class="btn btn-outline-secondary" title="Toggle Graph" @click="app.showGraph=!app.showGraph" :class="{toggled:app.showGraph}">📈</button>
			</div>
			
		</div>`, 
		methods: {
			randomAxes() {
				let axes = shuffleArray(app.currentClass.labels.slice(0))
				app.xaxis = axes[0]
				app.yaxis = axes[1]
			},

			reroll() {
				app.selected = undefined
				app.populate()
			}
		},
		computed: {
			aof() {
				if (app.selected)
					return app.selected.aof
			}
		},
		data() {
			return {
				app: app,
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
			let p = new p5((p) => {
				// Save the noise fxn
				noise = p.noise


				let mousePos = []
				// Basic P5 setup
				p.setup = () => {
					p.createCanvas(canvasW, canvasH)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)

					app.populate()
				}

				//-------------------------------------------
				// Mouse things

				// Utility fxn to test if mouse in p5
				function mouseInP5() {
					return p.mouseX > 0 && p.mouseX < canvasW && p.mouseY > 0 && p.mouseY < canvasH
				}

				p.mouseMoved = () => {
					
					if (mouseInP5()) {

						mousePos = [p.mouseX, p.mouseY]
			
						// Figure out what we're hovering over
						let minD = 100
						app.hovered = undefined

						app.individuals.forEach(ind => {
							let d = Vector.getDistance(ind.center, mousePos)
							if (d < minD) { 
								app.hovered = ind
								minD = d
							}
						})
					}
				}
				p.doubleClicked = () => {
					if (mouseInP5()) {
						let current = app.hovered

						// Set the selected and second selected
						if (current) {
							Vue.set(app, "selected" , current)
							app.populate()
						}
						
					}
				}

				p.mouseClicked = () => {
					// Set the selected and second selected
					if (mouseInP5()) {
						let current = app.hovered
						Vue.set(app, "selected" , current)
					}
				}
				//-------------------------------------------
				// Draw

				p.draw = () => {
					
					//-------------------
					// UPDATES
					let frameCount = p.frameCount
					let t = p.millis()*.001
					let dt = p.deltaTime*.001
					
					

					// Run some update code every frame
					app.update(t, dt, frameCount)

					//-------------------------
					// DRAWING
					
					p.background(190, 80, 90)

					// Draw static road and sidewalk
					p.fill(0, 0, 20)
					p.rect(0, 320, 800, 80)
					let numSquares = 10
					let squareWidth = canvasW/numSquares
					for (i = 0; i < numSquares; i++) {
						p.fill(0, 0, 50)
						p.rect(i*squareWidth, 280, squareWidth, 40)
						p.fill(57, 100, 50)
						p.rect(i*squareWidth + (squareWidth/5), 360, 3*squareWidth/5, 10)
					}
					
					// Deal with sound things
					/*if (app.audio.soundbar && app.soundMode) {

						app.audio.soundbar.update(t, dt, frameCount)
						app.audio.soundbar.draw(p)
					}*/

					app.draw(p)


					// Draw the graph
					if (app.showGraph) {
						let graphSize = 200
						p.push()
						p.translate(p.width - graphSize, 0)
						p.fill(0)
						p.rect(0, 0, graphSize, graphSize)

						app.individuals.forEach(ind => {
							let x = ind.aof.get(app.xaxis)
							let y = 1 - ind.aof.get(app.yaxis)
							p.fill(...ind.aof.idColor)
							p.circle(x*graphSize, y*graphSize, 10)
						})

						p.push()
						p.fill(100)
						p.text(app.xaxis, 10, graphSize)
						p.rotate(Math.PI/2)

						// p.fill(0)
						p.text(app.yaxis, 0, 0)
						p.pop()

						p.pop()
					}


					
				}

			}, this.$refs.p5)
		},
		
		data() {
			return {
				app: app,
			}
		}
		
	}) 
})

//============
// Utilities
// Returns a value between 0 and 1, but never reaching either
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