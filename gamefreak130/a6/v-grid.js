Vue.component("grid-p5", {
	template: '<div class="p5-grid"></div>',
	mounted() {
		console.log("mounted p5")
		console.log(this.sim)

		// Setup a p5 for this grid view
		let gridP5 = new p5(p => {
			
			p.setup = () => {
				let w = this.size*this.sim.w
				let h =  this.size*this.sim.h
				p.createCanvas(w, h);
				p.colorMode(p.HSL)
				
			}
			p.draw = () => {
				p.background("white")
				for (var i = 0; i < this.sim.h; i++) {

					for (var j = 0; j < this.sim.w; j++) {
						this.sim.drawCell(p, j, i, j*this.size, i*this.size, this.size, this.size)
					}
				}
			}
			
		}, this.$el)
	},
	
	props: {
		"sim": {required:true, type:Object}, "size":{default: 20, type:Number} 
	}

})


