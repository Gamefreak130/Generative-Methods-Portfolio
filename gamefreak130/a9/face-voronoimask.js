const grammar = tracery.createGrammar(moodGrammar)

class WordParticle {
	constructor(point, word) {
		this.pt = point;
		this.word = word;
	}

	draw(p) {
		p.fill(this.pt.color);
		p.textFont("cursive");
		p.textSize(24);
		p.textStyle(p.BOLD);
		p.text(this.word, ...this.pt.coords);
	}

	update(t, dt, frameCount) {
		this.pt.addMultiples(this.pt.velocity, dt)
		this.pt.setToLerp(this.pt, this.pt.attachPoint, .1)
	}
}

class VoronoiMask {
	constructor() {
		this.particles = []
		this.edges = []

		for (var j = 0; j < 2; j++) {
			for (var i = 0; i < 5; i++) {
				let pt = new Vector()
				pt.id = `hand-${j}-${i}`
				pt.radius = 10 + Math.random()*10
				pt.idNumber = j*5 + i
				pt.velocity =  new Vector()
				pt.force =  new Vector()
				pt.color = [(app.inputVector.coords[1]*10 + pt.idNumber*(app.inputVector.coords[1]%20))%360, 100, 50]
				pt.attachPoint = hand[j].fingers[i][3]
				let particle = new WordParticle(pt, grammar.flatten("#moods#"))
				this.particles.push(particle)
			}
		}

		let ringPoints = []
		let count = 40
		for (var i = 0; i < count; i++) {
			let theta  = i*Math.PI*2/count
			ringPoints.push(Vector.polar(200 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(300 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(400 + (i%2)*20, theta))
		}
		this.voronoiPoints = face.points.concat(ringPoints).concat(hand[0].points).concat(hand[1].points)
		
	}

	draw(p) {
		p.background(100, 100, 100, SLIDER.trails)

		p.fill(0)
		p.noStroke()
		// drawTestFacePoints(p)
		// drawTestHandPoints(p)

		this.particles.forEach(particle => {
			particle.draw(p)
		})

		// p.fill(0)
		// this.voronoiPoints.forEach(pt => pt.draw(p, 2))

	
		// Convert to a simpler array of vectors 
		let pts = this.voronoiPoints.map(p => p.coords)

		// Create the diagram
		const delaunay = Delaunator.from(pts);
		// if (Math.random() > .98)
		// 	console.log(delaunay)

		p.stroke(0)
		p.strokeWeight(.1)

		let vpct = SLIDER.voronoiLerp

		forEachVoronoiCell(pts, delaunay, (centerIndex, verts) => {

			if (centerIndex%1 == 0) {
				let pt = this.voronoiPoints[centerIndex]
				p.noStroke()
				p.fill((SLIDER.hue + centerIndex)%360, SLIDER.sat, SLIDER.light, .4)
				// pt.draw(p, 1)
				p.beginShape()
				// verts.forEach(vert => p.vertex(...vert))
				verts.forEach(vert => Vector.lerpVertex(p, pt, vert, vpct))
				p.endShape(p.CLOSE)

				p.fill((SLIDER.hue + centerIndex + 50)%360, SLIDER.sat, SLIDER.light, .4)
				p.beginShape()
				// verts.forEach(vert => p.vertex(...vert))
				verts.forEach(vert => Vector.lerpVertex(p, pt, vert, vpct-.2))
				p.endShape(p.CLOSE)
			}
			
		})
	



	}

	update(t, dt, frameCount) {
		console.log("update")
		this.particles.forEach(particle => {
			particle.update(t, dt, frameCount)
		})
	}
}


masks.voronoiMask = VoronoiMask