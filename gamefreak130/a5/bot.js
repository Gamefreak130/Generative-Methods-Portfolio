class PetBot {
	constructor() {
		this.avatar = "❔"
		this.choosingPet = false
		this.choosingName = false
		this.petName = ""
		this.petType = ""
		this.petAdj = ""
		this.mood = ""
		this.timeToNextMood = 0

		this.grammar = tracery.createGrammar(petGrammar)
		this.grammar.addModifiers(baseEngModifiers)
	}

	respondTo(s) {
		if (s.toLowerCase() === "new pet") {
			this.avatar = "❔"
			this.choosingPet = true
			return "What kind of pet would you like?"
		}

		if (this.choosingPet) {
			return this.parsePet(s)
		}
		if (this.choosingName) {
			if (s.trim().toLowerCase().includes("surprise me")) {
				s = this.grammar.flatten("#petNames#")
			}
			this.petName = s
			this.petAdj = this.grammar.flatten("#personalityAdjs.capitalizeAll#")
			this.choosingName = false
			this.setNewMood()
			return this.grammar.flatten(`#[name:${this.petName} the ${this.petAdj} ${this.petType}][mood:${this.mood}]intro#`)
		}

		if (s.trim().toLowerCase() == "surprise me") {
			s = this.grammar.flatten(`#[name:${this.petName}]surpriseActions#`)
		}

		let useShortName = Math.random() >= 0.5
		let name = useShortName ? this.petName : `${this.petName} the ${this.petAdj} ${this.petType}`
		this.timeToNextMood--
		if (this.timeToNextMood == 0) {
			this.setNewMood()
			return this.grammar.flatten(`#[name:${name}][mood:${this.mood}][action:${s}]yesChange#`)
		}
		
		return this.grammar.flatten(`#[name:${name}][mood:${this.mood}][action:${s}]noChange#`)
	}

	setNewMood() {
		let prevMood = this.mood
		while (this.mood == prevMood) {
			this.mood = this.grammar.flatten("#moods#")
		}
		this.timeToNextMood = Math.ceil(Math.random()*5)
	}

	parsePet(s) {
		let sanitizedStr = s.trim().toLowerCase()
		let randomized = false
		this.choosingPet = false
		if (sanitizedStr.includes("surprise me")) {
			randomized = true
			s = sanitizedStr = this.grammar.flatten("#petTypes#")
		}

		// Holy switch cases Batman
		switch (sanitizedStr) {
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
			case "kitten":
				this.avatar = "🐱"
				break
			case "horse":
			case "pony":
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
			this.petType = sanitizedStr.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
			this.choosingName = true
			if (randomized) {
				return this.grammar.flatten("I found #choiceAdjs.a# " + s + " for you! What name would you like to give it?")
			}
			else {
				return this.grammar.flatten("\"" + s + "\"? What #choiceAdjs.a# choice! And what will be this " + s + "'s name?")
			}
		}
	}
}