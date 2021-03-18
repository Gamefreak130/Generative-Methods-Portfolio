class Building {
	// Create a branching system  Each branch can hold other branches
	constructor(aof) {
		
		this.aof = aof
		this.center = new Vector()
	}


	update(t, dt) {
		
		// Update this with the current value of the AOF and any other parameters, like time
		/*this.root.energy = this.aof.energy
		this.root.start.orientation = -Math.PI/2
		this.root.update(t, dt)

		this.flowerColor.setTo((300*hue + 100)%360, 100, 80)*/

	}

	draw(p) {
		p.push()
        let hue = this.aof.get("Building Hue")
        let light = this.aof.get("Building Lightness")
        let height = (this.aof.get("Height")*150)+60
        let gableHeight = this.aof.get("Roof Gabling")*30
        p.fill(hue*360, 30, light*70+30)
        p.stroke(hue*360, 30, light*30)
        p.strokeWeight(6)
        p.triangle(-60, -(height - 2), 0, -(height + gableHeight - 2), 60, -(height - 2))

        p.strokeWeight(1)
		p.rect(-60, 0, 120, -height)

        // Draw windows
        let numStories = Math.floor(height/50)
        let numWindows = Math.round((this.aof.get("Number of Windows")*4)+1)
        p.fill(193, 100, 50)
        p.stroke(0)
        p.strokeWeight(0.75)
        for (var i = 0; i < numStories; i++) {
            for (var j = 0; j < numWindows; j++) {
                let pct = numWindows == 1 ? 0.5 : j/(numWindows - 1) 
                p.rect((pct*80) - 45, (i*-50) - 10, 10, -20)
            }
        }

        // Door
        p.fill(30, 100, 15)
        p.rect(-11, 0, 22, -35)

        // Doorknob
        p.fill(55, 70, 50)
        p.circle(8, -15, 2)
		
		p.pop()
	}
}


// Static properties for this class
Building.landmarks = {
	"palm": [0.4, 0.5, 0.1, 0.5],
	"pine": [0.4, 0.5, 0.1, 0.5],
	"oak": [0.4, 0.5, 0.1, 0.5],
	"willow": [0.4, 0.5, 0.1, 0.5]
}
Building.labels = ["Height", "Roof Gabling", "Number of Windows", "Building Hue", "Building Lightness", "Activity"]

/*class LTreeBranch {
	constructor(parent) {

		this.idNumber = branchCount++
		
		
		if (parent instanceof LTreeBranch) {
			this.parent = parent
			this.depth = parent.depth + 1
			this.tree = this.parent.tree
		}
		else {
			this.depth = 0
			this.tree = parent
		}

		let spread = this.tree.aof.get("spread")

		this.start = new LTreeBranchNode()
		this.end = new LTreeBranchNode()
		this.length = 0



	
		this.branches = []

		

		if (this.depth < 3) {
			let numBranches = 2
			for (var i = 0; i < numBranches; i++) {
				
				this.branches.push(new LTreeBranch(this))
			}
		}

	}	

	update(t, dt) {

		let animatedLength = this.length * (1 + .3*Math.sin(t + this.idNumber))
		this.end.setToPolarOffset(this.start, animatedLength, this.start.orientation)
		// console.log(this.start, this.length, this.start.orientation)
		// console.log(this.end)
		let spread = this.tree.aof.get("spread")
		let energy = this.tree.aof.get("energy")
		let ldie = this.tree.aof.get("length_dieoff")
		let tdie = this.tree.aof.get("thickness_dieoff")
		

		this.end.orientation = this.start.orientation


		// Multiply by somewhere between .5  and .9
		
		if (this.parent) {
			this.length = this.parent.length * (.5 + .4*ldie)
		}
		
		else  {

			// TRUNK!
			this.start.color.setTo(20, 40, 50)
			this.start.radius = 30*(.9 - .4*tdie)
			this.length = 100*(.9 - .4*ldie)
		}

		this.end.radius = this.start.radius * (.5 + .4*tdie)
		this.end.color.copy(this.start.color)

		this.branches.forEach((b,i) => {
			let pct = this.branches.length==1?.5:i/(this.branches.length - 1) - .5

			let waving =  Math.sin(t + this.depth)*.1
			let theta = (1.8*spread + .5)*pct + waving


			b.start.copy(this.end)
			b.start.radius = this.end.radius 
			b.start.color.copy(this.end.color)

			b.start.orientation =  this.end.orientation + theta

			b.update(t, dt)
		})
	}

	draw(p) {
		let theta = this.orientation
		p.fill(...this.start.color.coords)

		// Draw a rhombus from one node to another
		// p.beginShape()
		// Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation + Math.PI/2)
		// Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation + Math.PI/2)
		// Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation - Math.PI/2)
		// Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation - Math.PI/2)
		// p.endShape()

		p.stroke(0)
		p.strokeWeight(1)
		p.beginShape()
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation - Math.PI/2)
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation - Math.PI/2)
		p.endShape()

		// this.start.draw(p)
		// this.end.draw(p)
		this.branches.forEach(b => b.draw(p))

		// Flower
		if (this.branches.length === 0) {
			p.push()

			p.translate(...this.end.coords)
			p.rotate(this.end.orientation)
			

			p.fill(...this.tree.flowerColor.coords)
			let petalSpread = this.tree.aof.get("petalSpread")
			let petalBalance = this.tree.aof.get("flowerSpikiness")
			let petalCount = 6
			for (var i = 0; i < petalCount; i++) {
				let theta = i*Math.PI*2/petalCount
				let r = this.tree.aof.get("flowerSize")*20 + 10
				p.beginShape()
				p.vertex(0, 0)
				Vector.polarVertex(p, r*petalBalance, theta - petalSpread)
				Vector.polarVertex(p, r, theta)
				Vector.polarVertex(p, r*petalBalance, theta + petalSpread)
				p.vertex(0, 0)
				p.endShape()
			}


			p.pop()
		}
		
	}
}*/


// Like a Vector but with orientation and radius
/*class LTreeBranchNode extends Vector {
	constructor() {
		super(0,0)
		this.radius = Math.random()*10 + 10
		this.orientation = Math.random()*6.15
		this.color = new Vector(0, 0, 0)
	}

	draw(p) {

		p.fill(100, 0, 100)
		p.stroke(0, 0, 0)
		p.circle(...this.coords, this.radius)
		let r = this.radius + 10
		p.line(...this.coords, this.coords[0] + r*Math.cos(this.orientation), this.coords[1] + r*Math.sin(this.orientation))
	}
}*/


