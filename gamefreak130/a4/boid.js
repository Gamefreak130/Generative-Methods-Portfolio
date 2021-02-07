

let boidCount = 0


let Boid = class {
	constructor(flock, position, velocity) {
		this.flock = flock

		// Each boid gets a unique number, 
		//  useful for giving each one its own behavior or label
		this.idNumber = boidCount++ 

		// Catch errors in case I pass something silly as an argument
		if (!Array.isArray(position))
			throw("position needs to be an array, got: " + position)
		if (!Array.isArray(velocity))
			throw("velocity needs to be an array, got:  " + velocity)
		

		this.position = position
		this.velocity = velocity

		this.heldObject = ''


		// What forces does this boid have?
		// Have as many empty vectors as there are types of forces
		// Because this is where we will store them

		this.forces = {
			cohesion: new Vector(0, 0),
			alignment: new Vector(0, 0),
			separation: new Vector(0, 0),
			selfPropulsion: new Vector(0, 0),
			hunger: new Vector(0, 0),
			homework: new Vector(0, 0)
		}


	
	}

	toString() {
		return `Boid${this.idNumber} p:(${this.position.toFixed(2)})  v:(${this.velocity.toFixed(2)})`
	}

	calculateForces(t, dt) {


		// This force pulls the boid toward the center of the flock
		this.forces.cohesion
			.setToDifference(this.position, this.flock.center)
			.mult(-.05* SLIDERS.boidCohesion.value())

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
			let hungerRange = this.heldObject === '☕' ? 200 : 200
			if (vectorToFood.magnitude < hungerRange) {
				let multiplier = this.heldObject === '☕' ? -100 : 100
				let pushStrength = multiplier*(hungerRange - vectorToFood.magnitude)/hungerRange
				vectorToFood.normalize().mult(pushStrength)
				this.forces.hunger.add(vectorToFood)
			}
		})

		this.forces.homework.mult(0)
		homeworkPages.forEach(page => {
			let vectorToHomework = Vector.getDifference(this.position, page.position)
			let homeworkRange = this.heldObject === '📝' ? 200 : 200
			if (vectorToHomework.magnitude < homeworkRange) {
				let multiplier = this.heldObject === '📝' ? -100 : 100
				let pushStrength = multiplier*(homeworkRange - vectorToHomework.magnitude)/homeworkRange
				vectorToHomework.normalize().mult(pushStrength)
				this.forces.homework.add(vectorToHomework)
			}
		})

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

 		// Add up all the forces
 		// Velocity2 = Velocity1 + (Elapsed time)*Force
 		for (let forceKey in this.forces) {
 			let force = this.forces[forceKey]
 			this.velocity.addMultiples(force, dt)
 		}

 		// Clamp the maximum speed, to keep the boids from running too fast (or too slow)
		this.velocity.clampMagnitude(4, 75)

 		// Apply some drag.  This keeps them from getting a runaway effect
 		let drag = 1 - SLIDERS.Drag.value()
 		this.velocity.mult(drag)

 		// Wrap around
 		this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
		this.position[1] = (this.position[1] + simulationHeight)%simulationHeight
		
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