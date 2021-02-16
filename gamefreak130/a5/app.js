// Do setup
document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el: "#app",
		template: `<div id="app">
			<chat-widget :messages="messages" />

			<div id="controls">
				<div>
					<input ref="input" v-model="currentInput" @keyup.enter="enterInput">
					<button @click="enterInput">↩️</button>
				</div>
				<div>
					<button @click="handleInput('new pet')">New Pet</button>
					<button @click="handleInput('surprise me')">Surprise Me</button>
				</div>
			

			</div>
		</div>`,

		watch: {
			messages() {
				// console.log("messages", this.messages)
			}
		},

		methods: {

			postToChat(text, owner, isSelf) {
				this.messages.push({
					text: text,
					isSelf: isSelf,
					owner: owner,
				})
			},

			enterInput() {
				let text = this.currentInput
				this.currentInput = ""

				
				this.handleInput(text)

			},

			handleInput(text) {
				// Does bot things
				this.postToChat(text, "😐", true)

				// Add to the messages in chat
			
				// Bot does something
				let output = this.bot.respondTo(text)

				setTimeout(() => {
					this.bot.post(output)
					
				}, Math.random()*100 + 400)

			}
		},

		mounted() {

			console.log("Vue app is all set up....")
			setTimeout(() => {
				this.bot.post("Greetings!")
			}, 100)
			setTimeout(() => {
				this.bot.post("What kind of pet would you like? Type \"Surprise Me\" or click the button to select a friendly critter at random!")
			}, 1000)

			this.bot.post = (text) =>  {
				// this is now the vue object
				this.postToChat(text, this.bot.avatar)
			}

			this.bot.avatar = "❔"
			this.bot.choosingPet = true
		},
		

		data() {
			return {
				// Store the bot
				bot: new PetBot(),

				// And the message
				messages: [],

				// And the current thing in the input
				currentInput: ""
			}
		}
	})	
})
