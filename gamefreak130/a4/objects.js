// Get the wind force at this time and position
function getWindForce(t, x, y) {
	let scale = .002
	let theta = 20*noise(x*scale*.5, y*scale*.5, t*.07)
	let strength = noise(x*scale, y*scale, t*.1 + 100)
	let r = 100 + 1900*strength*strength
	return Vector.polar(r, theta)

}

// Draw a windmap at the current time
function debugDrawWindmap(p, t) {

	// How many columns and rows of points do we want?
	let tileSize = 20
	let tileX = Math.floor(simulationWidth/tileSize)
	let tileY = Math.floor(simulationHeight/tileSize)

	let drawScale = .04
	for (var i = 0; i < tileX; i++) {
		for (var j = 0; j < tileY; j++) {

			// What point are we at?
			let x = tileSize*(i + .5)
			let y = tileSize*(j + .5)

			// Calculate the force here
			let force = getWindForce(t, x, y)

			// Draw the current wind vector
			p.fill(240, 70, 50)
			p.noStroke()
			p.circle(x, y, 2)
			p.stroke(240, 70, 50, .8)
			p.line(x, y, x + drawScale*force[0], y + drawScale*force[1])
		}	
	}
}

// ObjectParticles are particles pushed around by a wind vectorfield
class ObjectParticle {
	constructor(type, position) {		
		if (position === undefined)
			position = new Vector(Math.random()*simulationWidth, Math.random()*simulationHeight)
		
		// Create an object... somewhere
		this.position = new Vector(...position)
		this.velocity = Vector.randomPolar(5)
		this.type = type

		// Give each object a random weight
		// To keep them from bunching together
		this.weight = 10 + Math.random()*20

		this.windForce = new Vector(0, 0)
		this.gravity = new Vector(0, 25)
	}


	draw(p) {
		p.textSize(15)
		p.fill(0)
		p.noStroke()
		p.text(this.type, ...this.position)
	}


	// Time and delta time
	update(t, dt) {
		dt = Math.min(1, dt) // Don't ever update more than 1 second at a time, things get too unstable

		this.windForce = getWindForce(t, ...this.position)

		this.velocity.addMultiples(this.gravity, dt)

		this.velocity.addMultiples(this.windForce, dt/this.weight)
		this.position.addMultiples(this.velocity, dt)

		this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
		this.position[1] = (this.position[1] + simulationHeight)%simulationHeight
		


		/*const maxSpeed = 100
		let speed = this.velocity.magnitude
		if (speed > maxSpeed)
			this.velocity.mult(maxSpeed/speed)*/

		// Apply some drag.  This keeps them from getting a runaway effect
		let drag = 1 - SLIDERS.Drag.value()
		this.velocity.mult(drag)
	}
}