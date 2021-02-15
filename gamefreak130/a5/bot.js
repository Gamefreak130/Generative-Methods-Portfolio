class PetBot {
	constructor() {
		this.avatar = "❔"
		this.choosingPet = false
		this.choosingName = false

		this.grammar = tracery.createGrammar(petGrammar)
		this.grammar.addModifiers(baseEngModifiers)
		console.log("A type of coffee:", this.grammar.flatten("#coffeeType#"))
	}

	respondTo(s) {
		if (s.toLowerCase() === "new pet") {
			this.avatar = "❔"
			this.choosingPet = true
			return "What kind of pet would you like? Type \"random\" to select a friendly critter at random!"
		}

		if (this.choosingPet) {
			return this.parsePet(s)
		}
		if (this.choosingName) {
			// TODO set pet name
		}

		/*if (s.includes("drink")) {
			if (this.coffeeAmount  == 0)
				return "No coffee, brew more"
			
			this.coffeeAmount -= 1
			return this.grammar.flatten("The flavor is #flavor#")
		}

		// Brew new coffee
		if (s.includes("brew")) {

			// Create new values
			this.coffeeFlavor = this.grammar.flatten("#coffeeName#")
			this.coffeeDescription = this.grammar.flatten("#coffeeDesc#")

			let interval = setInterval(() => {
				this.coffeeAmount = Math.min(this.coffeeAmount + 1,  this.maxCoffee)
				if (this.coffeeAmount >= this.maxCoffee)
					clearInterval(interval)


				console.log("post to chat")
				this.post("... ")
			}, 200)
			

			return `Brewing ${this.coffeeFlavor}, ${this.coffeeDescription}`

		}

		if (s.includes(418))
			return `I'm a coffee pot`
		return `'${s}' isn't a type of coffee`*/
	}

	parsePet(s) {
		s = s.toLowerCase()
		this.choosingPet = false
		if (s.includes("random")) {
			s = this.grammar.flatten("#availableAnimal#")
		}

		// Holy switch cases Batman
		switch (s) {
			case "monkey":
			case "chimpanzee":
				this.avatar = "🐵"
				break
			case "dog":
			case "puppy":
				this.avatar = "🐶"
				break
			case "raccoon":
				this.avatar = "🦝"
				break
			case "cat":
				this.avatar = "🐱"
				break
			case "horse":
				this.avatar = "🐴"
				break
			case "unicorn":
				this.avatar = "🦄"
				break
			case "cow":
			case "water buffalo":
				this.avatar = "🐮"
				break
			case "pig":
			case "boar":
				this.avatar = "🐷"
				break
			case "llama":
				this.avatar = "🦙"
				break
			case "giraffe":
				this.avatar = "🦒"
				break
			case "mouse":
			case "rat":
				this.avatar = "🐭"
				break
			case "hamster":
			case "guinea pig":
				this.avatar = "🐹"
				break
			case "rabbit":
			case "bunny":
				this.avatar = "🐰"
				break
			case "hedgehog":
				this.avatar = "🦔"
				break
			case "chipmunk":
				this.avatar = "🐿"
				break
			case "skunk":
				this.avatar = "🦨"
				break
			case "badger":
				this.avatar = "🦡"
				break
			case "turkey":
				this.avatar = "🦃"
				break
			case "kangaroo":
				this.avatar = "🦘"
				break
			case "bird":
				this.avatar = "🐦"
				break
			case "duck":
				this.avatar = "🦆"
				break
			case "parrot":
				this.avatar = "🦜"
				break
			case "frog":
				this.avatar = "🐸"
				break
			case "turtle":
			case "tortoise":
				this.avatar = "🐢"
				break
			case "lizard":
			case "salamander":
			case "gecko":
				this.avatar = "🦎"
				break
			case "snake":
				this.avatar = "🐍"
				break
			case "dragon":
				this.avatar = "🐉"
				break
			case "sauropod":
			case "dinosaur":
				this.avatar = "🦕"
				break
			case "t-rex":
				this.avatar = "🦖"
				break
			case "dolphin":
				this.avatar = "🐬"
				break
			case "whale":
				this.avatar = ["🐳", "🐋"][Math.floor(Math.random()*2)]
				break
			case "fish":
				this.avatar = ["🐟", "🐠", "🐡"][Math.floor(Math.random()*3)]
				break
			case "shark":
				this.avatar = "🦈"
				break
			case "octopus":
				this.avatar = "🐙"
				break
			case "snail":
				this.avatar = "🐌"
				break
			case "spider":
				this.avatar = "🕷"
				break
			case "scorpion":
				this.avatar = "🦂"
				break
			case "crab":
				this.avatar = "🦀"
				break
			case "lobster":
				this.avatar = "🦞"
				break
			case "shrimp":
				this.avatar = "🦐"
				break
			case "squid":
				this.avatar = "🦑"
				break
			default:
				this.choosingPet = true
				break 
		}

		if (this.choosingPet) {
			return this.grammar.flatten("\"" + s + "\"? #invalidChoice#")
		}
		else {
			this.choosingName = true
			return this.grammar.flatten("What #choiceAdjs.a# choice! And what will be this " + s + "'s name?")
		}
	}
}