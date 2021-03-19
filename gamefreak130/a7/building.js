class Building {
	constructor(aof) {
		this.aof = aof
		this.center = new Vector()
        this.theta = 0
	}


	update(t, dt) {
        this.theta -= 0.02
	}

	draw(p) {
		p.push()
        let hue = this.aof.get("Building Hue")
        let light = this.aof.get("Building Lightness")
        let height = (this.aof.get("Height")*150)+60
        let gableHeight = this.aof.get("Roof Gabling")*30
        let activityPct = this.aof.get("Activity")
        p.fill(hue*360, 30, light*70+30)
        p.stroke(hue*360, 30, light*30)
        // Draw chimney
        p.strokeWeight(1.25)
        p.rect(35, -height, 15, -(gableHeight*0.8 + 10))
        // If sufficiently active, make smoke come out of the chimney
        if (activityPct > 0.3) {
            p.push()
            p.translate(37.25, -(gableHeight*0.8 + height + 3))
            p.rotate(-p.PI/2)
            p.noFill()
            p.stroke(0, 0, 45)
            p.strokeWeight(2)
            for (var i = 0; i < 3; i++) {
                p.beginShape()
                p.curveVertex(0, 2*p.sin(this.theta))
                p.curveVertex(10, 2*p.sin(p.QUARTER_PI + this.theta))
                p.curveVertex(20, 2*p.sin(p.HALF_PI + this.theta))
                p.curveVertex(30, 2*p.sin(3*p.QUARTER_PI + this.theta))
                p.curveVertex(40, 2*p.sin(p.PI + this.theta))
                p.curveVertex(50, 2*p.sin(5*p.QUARTER_PI + this.theta))
                p.endShape()
                p.translate(0, 5)
            }
            p.pop()
        }

        // Draw roof
        p.fill(hue*360, 30, light*70+30)
        p.stroke(hue*360, 30, light*30)
        p.strokeWeight(6)
        p.triangle(-60, -(height - 2), 0, -(height + gableHeight - 2), 60, -(height - 2))

        // Draw main structure
        p.strokeWeight(1)
		p.rect(-60, 0, 120, -height)

        // Draw windows
        let numStories = Math.floor(height/50)
        let numWindows = Math.round((this.aof.get("Number of Windows")*4)+1)
        // Based on the activity, we will light up every X windows
        let unlitPerLit = Math.round(activityPct*-5 + 6)
        p.stroke(0)
        p.strokeWeight(0.75)
        for (var i = 0; i < numStories; i++) {
            for (var j = 0; j < numWindows; j++) {
                let pct = numWindows == 1 ? 0.5 : j/(numWindows - 1) 
                let isLit = unlitPerLit >= 6 ? false : (i*numWindows + j) % unlitPerLit == 0
                p.fill(isLit ? 58 : 193, 100, 50)
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
	"Office Building": [1, 0, 1, 0.575, 0, 0],
	"Cottage": [0.2, 0.487, 0.3, 0.133, 0.788, 0.5],
	"Lighthouse": [1, 0.399, 0, 1, 1, 1],
	"Family Home": [0.3, 0.85, 0.5, 0.55, 0.65, 0.8],
    "Shack": [0, 0.41, 0, 0.1, 0.15, 0.31]
}
Building.labels = ["Height", "Roof Gabling", "Number of Windows", "Building Hue", "Building Lightness", "Activity"]