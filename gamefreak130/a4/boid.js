let Boid = class {
	constructor(flock, position, velocity) {
		this.flock = flock
		flock.boids.push(this)

		if (!position)
			position = Vector.random([0,simulationWidth],[0,simulationHeight])
		if (!velocity)
			velocity = Vector.randomPolar(50)
		

		this.position = position
		this.velocity = velocity
		this.forces = {
			cohesion: new Vector(0, 0),
			alignment: new Vector(0, 0),
			separation: new Vector(0, 0),
			selfPropulsion: new Vector(0, 0)
		}
	}

	calculateForces(t, dt) {
		// The boid gets a boost in the direction of the flocks average speed
		this.forces.alignment.copy(this.flock.averageVelocity).mult(.5)

		// It also gets a boost in its own direction
		this.forces.selfPropulsion.setToPolar(20, this.velocity.angle)
	}

	// dt: 	How much time has elapsed? 
	// t: 	What is the current time
	update(t, dt) {
		dt = Math.min(1, dt) // Don't ever update more than 1 second at a time, things get too unstable
		

		// Position2 = Position1 + (Elapsed time)*Velocity
	    this.position.addMultiples(this.velocity, dt)
		 
		// Wrap around
		this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
		this.position[1] = (this.position[1] + simulationHeight)%simulationHeight

 		// Add up all the forces
 		// Velocity2 = Velocity1 + (Elapsed time)*Force
 		for (let forceKey in this.forces) {
 			let force = this.forces[forceKey]
 			this.velocity.addMultiples(force, dt)
 		}

 		// Clamp the maximum speed, to keep the boids from running too fast (or too slow)
		this.velocity.clampMagnitude(4, 50)

 		// Apply some drag.  This keeps them from getting a runaway effect
 		let drag = 1 - SLIDERS.Drag.value()
 		this.velocity.mult(drag)
		
	}

	debugDraw(p) {

		let forceDisplayMultiple = 1

		// Get a list of all force names, then 
		// for each one, draw the force
		Object.keys(this.forces).map((forceKey, index) => {
			let force = this.forces[forceKey]
 			force.drawArrow({
 				p:p,
 				arrowSize: 6,
 				center: this.position,
 				multiple: forceDisplayMultiple,
				color: [index*30 + 240, 100, 70, 1],
				//label: forceKey
 			})
		})
	}

	draw(p) {
		throw new Error("Subclasses of Boid must provide their own implementation of draw()")
	}
}



let busybodyCount = 0
let lazybonesCount = 0


let Busybody = class extends Boid {
	constructor(position, velocity) {
		super(busybodyFlock, position, velocity)

		// Each boid gets a unique number, 
		//  useful for giving each one its own behavior or label
		this.idNumber = busybodyCount++ 

		this.heldObject = ''


		// What forces does this boid have?
		// Have as many empty vectors as there are types of forces
		// Because this is where we will store them

		this.forces.hunger = new Vector(0, 0)
		this.forces.homework = new Vector(0, 0)
		this.forces.lazybones = new Vector(0, 0)
	}

	toString() {
		return `Busybody${this.idNumber} p:(${this.position.toFixed(2)})  v:(${this.velocity.toFixed(2)})`
	}

	calculateForces(t, dt) {
		super.calculateForces(t, dt)

		// This force pulls the boid toward the center of the flock
		this.forces.cohesion
			.setToDifference(this.position, this.flock.center)
			.mult(-.05* SLIDERS.BusybodyCohesion.value())

		// The addition of all forces relative to other boids
		this.forces.separation.mult(0)
		this.flock.boids.forEach(boid => {
			if (boid !== this) {
				let offset = Vector.getDifference(this.position, boid.position)
				let d = offset.magnitude
				let range = 100
				// How close am I to this boid?

				if (d < range) {		
					let pushStrength = -150*(range - d)/range		
					offset.normalize().mult(pushStrength)
					this.forces.separation.add(offset)
				}
			}
		})

		this.forces.hunger.mult(0)
		coffeeCups.forEach(food => {
			let vectorToFood = Vector.getDifference(this.position, food.position)
			let hungerRange = 200
			if (vectorToFood.magnitude < hungerRange) {
				let multiplier = SLIDERS.CoffeeAttraction.value() 
				if (this.heldObject === '☕') { 
					multiplier *= -1/2
				}
				let pushStrength = multiplier*(hungerRange - vectorToFood.magnitude)/hungerRange
				vectorToFood.normalize().mult(pushStrength)
				this.forces.hunger.add(vectorToFood)
			}
		})

		this.forces.homework.mult(0)
		homeworkPages.forEach(page => {
			let vectorToHomework = Vector.getDifference(this.position, page.position)
			let homeworkRange = 200
			if (vectorToHomework.magnitude < homeworkRange) {
				let multiplier = SLIDERS.HomeworkAttraction.value() 
				if (this.heldObject === '📝') { 
					multiplier *= -1/2
				}
				let pushStrength = multiplier*(homeworkRange - vectorToHomework.magnitude)/homeworkRange
				vectorToHomework.normalize().mult(pushStrength)
				this.forces.homework.add(vectorToHomework)
			}
		})

		this.forces.lazybones.mult(0)
		lazybonesFlock.boids.forEach(lazybone => {
			let vectorToLazybone = Vector.getDifference(this.position, lazybone.position)
			let lazyboneRange = 100
			if (vectorToLazybone.magnitude < lazyboneRange) {
				let multiplier = -1000
				let pushStrength = multiplier*(lazyboneRange - vectorToLazybone.magnitude)/lazyboneRange
				vectorToLazybone.normalize().mult(pushStrength)
				this.forces.lazybones.add(vectorToLazybone)
			}
		})
	}

	update(t, dt) {
		super.update(t, dt)

		
	}

	draw(p) {
		// bookmark the matrix position before we move to draw this
		p.push()
		
		p.translate(...this.position)
		p.rotate(this.velocity.angle)

		p.fill((this.idNumber*20) % 360, 80, 80)
		p.stroke((this.idNumber*20) % 360, 100, 10)
		p.circle(0, 0, 20)
		p.strokeWeight(1)
		if (this.heldObject == '') {
			p.line(0, -10, 7, -13)
			p.line(0, 10, 7, 13)
		}
		else {
			p.line(5, -10, 15, -5)
			p.line(5, 10, 15, 5)
			p.rotate(p.HALF_PI)
			p.text(this.heldObject, -10, -15)
		}

		coffeeCups.some(food => {
			if (Vector.getDifference(this.position, food.position).magnitude < 20) {
				this.heldObject = '☕'
				return true
			}
			return false
		})

		homeworkPages.some(page => {
			if (Vector.getDifference(this.position, page.position).magnitude < 20) {
				this.heldObject = '📝'
				return true
			}
			return false
		})

		// return to the original drawing position
		p.pop()

	}
};

let Lazybone = class extends Boid {
	constructor(position, velocity) {
		super(lazybonesFlock, position, velocity)
		this.forces.avoidance = new Vector(0, 0)
		this.forces.border = new Vector(0, 0)
	}

	toString() {
		return `Lazybone${this.idNumber} p:(${this.position.toFixed(2)})  v:(${this.velocity.toFixed(2)})`
	}

	calculateForces(t, dt) {
		super.calculateForces(t, dt)

		// This force pulls the boid toward the center of the flock
		this.forces.cohesion
			.setToDifference(this.position, this.flock.center)
			.mult(-.05* SLIDERS.LazybonesCohesion.value())

		// The addition of all forces relative to other boids
		this.forces.separation.mult(0)
		this.flock.boids.forEach(boid => {
			if (boid !== this) {
				let offset = Vector.getDifference(this.position, boid.position)
				let d = offset.magnitude
				let range = 50
				// How close am I to this boid?

				if (d < range) {		
					let pushStrength = -150*(range - d)/range		
					offset.normalize().mult(pushStrength)
					this.forces.separation.add(offset)
				}
			}
		})

		this.forces.avoidance.mult(0)
		coffeeCups.forEach(food => {
			let vectorToFood = Vector.getDifference(this.position, food.position)
			let hungerRange = 100
			if (vectorToFood.magnitude < hungerRange) {
				let multiplier = -2000
				let pushStrength = multiplier*(hungerRange - vectorToFood.magnitude)/hungerRange
				vectorToFood.normalize().mult(pushStrength)
				this.forces.avoidance.add(vectorToFood)
			}
		})
		homeworkPages.forEach(page => {
			let vectorToHomework = Vector.getDifference(this.position, page.position)
			let homeworkRange = 100
			if (vectorToHomework.magnitude < homeworkRange) {
				let multiplier = -2000
				let pushStrength = multiplier*(homeworkRange - vectorToHomework.magnitude)/homeworkRange
				vectorToHomework.normalize().mult(pushStrength)
				this.forces.avoidance.add(vectorToHomework)
			}
		})
		busybodyFlock.boids.forEach(busybody => {
			let vectorToBusybody = Vector.getDifference(this.position, busybody.position)
			let busybodyRange = 100
			if (vectorToBusybody.magnitude < busybodyRange) {
				let multiplier = -500
				let pushStrength = multiplier*(busybodyRange - vectorToBusybody.magnitude)/busybodyRange
				vectorToBusybody.normalize().mult(pushStrength)
				this.forces.avoidance.add(vectorToBusybody)
			}
		})
	}

	draw(p) {
		// bookmark the matrix position before we move to draw this
		p.push()
		
		p.translate(...this.position)
		p.rotate(this.velocity.angle)

		p.fill(0, 0, 50)
		p.stroke(0, 0, 20)
		p.circle(0, 0, 20)
		p.strokeWeight(1)
		p.line(5, -10, 15, -5)
		p.line(5, 10, 15, 5)
		p.rotate(p.HALF_PI)
		p.text('🎮', -10, -15)

		// return to the original drawing position
		p.pop()

	}
};