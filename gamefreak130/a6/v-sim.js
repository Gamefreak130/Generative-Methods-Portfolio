Vue.component("simulation", {
	template: `
	<div class="simulation">
		<!-- Draw the grid, and optionally specify the size -->
		<grid-p5 :sim="sim" :size="25" />

		<div class="controls">
			<div>
				<span class="production">Total Production: {{sim.totalProduction}}</span>
				<span class="production">Production This Step: {{sim.productionThisStep}}</span>
			</div>
			
			<div class="btn-group btn-group-sm" role="group" aria-label="Button Group">
				<button class="btn btn-outline-dark" @click="sim.randomize()">🎲</button>
				<button class="btn btn-outline-dark" @click="sim.step()">🥾</button>
				<button class="btn btn-outline-dark" @click="sim.isPaused=!sim.isPaused">{{sim.isPaused?"▶️":"⏸"}}</button>
			</div>
		</div>
	</div>
	`,
	mounted() {

		// Handle updating this simulation
		let count = 0
		setInterval(() => {
			if (count < 50000 && !this.sim.isPaused ) {

				this.sim.step()
			}
			count++
		}, 400)
	},
	
	props:["mode"],

	data() {
		return {
			sim: new Simulation(this.mode)
		}
	}


})