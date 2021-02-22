


// let emoji = "🌷 🐑 🌲 🌳 🌴 🐟 🐠 🐡 🌱 🦞 🐙 🦀 🦐 🐄".split(" ")
let emoji = "🌷 🐑 🌲".split(" ")

let simCount = 0
class Simulation {
	// Some number of grids
	constructor(mode) {
		// Mode can control various factors about the simulation

		this.mode = mode
		this.idNumber = simCount++
		this.noiseSeed = this.idNumber
		this.stepCount = 0
		
		// Set my size
		this.w = 40
		this.h = 18
		// But smaller if in emoji mode
		this.w = 20
		this.h = 10


		this.isWrapped = true
		this.isPaused = true
		this.selectedCell = undefined

		this.noiseScale = 1

		this.gameOfLifeGrid = new Grid(this.w, this.h, this.isWrapped)

		// You can make additional grids, too
		this.heightMap = new Grid(this.w, this.h, this.isWrapped)
		this.emojiGrid = new Grid(this.w, this.h, this.isWrapped)
		this.sickGrid = new Grid(this.w, this.h, this.isWrapped)
		this.sickGrid.setAll((x,y) => 0)

		// Tuning values for the continuous simulation
		this.backgroundRadiation = 1
		this.lifeThreshold = 1

		this.randomize()

	}

	randomize() {
		console.log("set to a random layout")
		this.noiseSeed += 10
		
		this.heightMap.setAll((x,y) => noise(x*this.noiseScale, y*this.noiseScale + 100*this.noiseSeed)/1.25)
		
		if (this.mode === "continuous")
			this.gameOfLifeGrid.setAll((x,y) =>(this.heightMap.get(x, y)))
		else
			this.gameOfLifeGrid.setAll((x,y) =>Math.round(this.heightMap.get(x, y)))
		

		// Add some random emoji
		if (this.mode == "noMask")
			this.emojiGrid.setAll((x,y) => this.gameOfLifeGrid.get(x,y) == 1 ? "🤒" : "🙂")
		else
			this.emojiGrid.setAll((x,y) => this.gameOfLifeGrid.get(x,y) == 1 ? "🤒" : "😷")
	}

	step() {
		this.stepCount++

		// Make one step
		// Set all the next steps, then swap the buffers
		
		this.gameOfLifeGrid.setNext((x, y, currentValue) => {
			//let neighbors = this.getNeighborPositions(x, y, true)
			let n0 = this.gameOfLifeGrid.get(x + 1, y)
			let n1 = this.gameOfLifeGrid.get(x - 1, y)
			let n2 = this.gameOfLifeGrid.get(x, y + 1)
			let n3 = this.gameOfLifeGrid.get(x, y - 1)
			let count = n0 + n1 + n2 + n3

			let e0 = this.emojiGrid.get(x + 1, y)
			let e1 = this.emojiGrid.get(x - 1, y)
			let e2 = this.emojiGrid.get(x, y + 1)
			let e3 = this.emojiGrid.get(x, y - 1)

			let sickCount  = 0
			for (const em of [e0, e1, e2, e3]) {
				if (em === "🤧")
					sickCount += 1
			}
			
			switch (this.mode) {
				case "noMask": {
					if (currentValue === 1) {
						if (this.stepCount >= this.sickGrid.get(x, y) + 14) {
							this.emojiGrid.set(x, y, "🙂")
							return 0
						}

						if (Math.random() > 0.25)
							this.emojiGrid.set(x, y, "🤧")
						else
							this.emojiGrid.set(x, y, "🤒")

						return 1
					} else {
						if (Math.random() > 0.99 - (0.2*sickCount)) {
							this.sickGrid.set(x, y, this.stepCount)
							this.emojiGrid.set(x, y, "🤒")
							return 1
						}
				
						this.emojiGrid.set(x, y, "🙂")
						return 0
					}
					return currentValue
				}

				
				case "mask": {
					if (currentValue === 1) {
						if (this.stepCount >= this.sickGrid.get(x, y) + 14) {
							this.emojiGrid.set(x, y, "😷")
							return 0
						}

						if (Math.random() > 0.75)
							this.emojiGrid.set(x, y, "🤧")
						else
							this.emojiGrid.set(x, y, "🤒")

						return 1
					} else {
						if (Math.random() > 0.99 - (0.11*sickCount)) {
							this.sickGrid.set(x, y, this.stepCount)
							this.emojiGrid.set(x, y, "🤒")
							return 1
						}
				
						this.emojiGrid.set(x, y, "😷")
						return 0
					}
					return currentValue
				}

				case "emoji": {
					let em = this.emojiGrid.get(x, y)
					if (currentValue === 1) {
						// "Any live cell with two or three live neighbours survives."
						if (this.stepCount >= this.sickGrid.get(x, y) + 5) {
							this.emojiGrid.set(x, y, "🙂")
							return 0
						}

						if (Math.random() > 0.5)
							this.emojiGrid.set(x, y, "🤧")
						else
							this.emojiGrid.set(x, y, "🤒")

						return 1
					} else {
						// "Any dead cell with three live neighbours becomes a live cell."
						if (Math.random() > 0.99 - (0.25*count)) {
							this.sickGrid.set(x, y, this.stepCount)
							this.emojiGrid.set(x, y, "🤒")
							return 1
						}
				
						this.emojiGrid.set(x, y, "🙂")
						return 0
					}
					return currentValue
				}

				case "continuous": {
					let bgRadiation = parseFloat(this.backgroundRadiation)
					//let threshold = parseFloat(this.lifeThreshold)
					
					let bgValue = (.2 + bgRadiation)*Math.pow(noise(x*this.noiseScale, y*this.noiseScale, .2*this.stepCount), 2)
					if (currentValue > .1) {
						// "Any live cell with two or three live neighbours survives."
						let dist = Math.abs(count - 2.5)

						// if (Math.random() > dist*threshold)
						// 	return 1

						return bgValue
					} else {
						// "Any dead cell with three live neighbours becomes a live cell."
						if (count === 3)
							return 1 + Math.random()
				
						return bgValue
					}
					return currentValue
				}
				

				default: {
					if (x == 0 && y == 0)
						console.warn("unknown mode:", this.mode)
					// Just copy the current values
					return currentValue
				}

			}
		})	

		// Show the whole grid for debugging
		// this.gameOfLifeGrid.debugPrintGrid()
	
		// Swap the new value buffer into the current value buffer
		this.gameOfLifeGrid.swap()
	}



	//==============
	// Draw a cell.  Add emoji or color it


	drawCell(p, x, y, cellX, cellY, cellW, cellH) {
		if (this.selectedCell && this.selectedCell[0] === x && this.selectedCell[1] === y) {
			p.strokeWeight(2)
			p.stroke("red")
		}
		else  {
			p.strokeWeight(1)
			p.stroke(0, 0, 0, .2)
		}

		let val = this.gameOfLifeGrid.get(x, y)

		p.fill(0, 100, 50 + (1-val)*50, 1)
		p.rect(cellX, cellY, cellW, cellH)

		let em = this.emojiGrid.get(x, y)
		p.text(em, cellX + (cellW/6.5), cellY + (cellH/1.5))


	}

	//=====================================================
	// Mouse interactions

	select(x, y) {
		this.selectedCell = [x, y]
	}

	click(x, y) {
		this.gameOfLifeGrid.set(x, y, 1)
	}



	//=====================================================
	// Utility functions

	
	getNeighborPositions(x1, y1, wrap) {
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + this.w)%this.w
			x2 = (x2 + this.w)%this.w
			y0 = (y0 + this.h)%this.h
			y2 = (y2 + this.h)%this.h
		}
		
		return [[x0,y0],[x1,y0],[x2,y0],[x2,y1],[x2,y2],[x1,y2],[x0,y2],[x0,y1]]
	}


}