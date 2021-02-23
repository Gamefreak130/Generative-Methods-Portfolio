	
let paused = false
document.addEventListener('keyup', function(e){
	if(e.keyCode == 32){
		paused = !paused
	}
	if(e.keyCode == 78){
		sim.step()
	}
});  

let noise = new p5().noise
console.log(noise)
let sim = new Simulation()

document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el : "#app",
		template: `<div id="app">
			<p>
				We all know that masks and social distancing can be very effective in reducing the spread of diseases, when the situation calls for it.
				But what happens when the vaccines have been distributed, and a virus is no longer an existential threat to our collective livelihoods? Should we just go back to the way things were?
			</p>
			<p>
				Say we have an office full of 200 workers, all of whom are now once again free to work in close proximity to each other without masks. 
				A healthy worker contributes 10 productivity points to the company per day, meaning a maximum possible 2000 productivity points per day across all workers.
				The only threat to productivity is the common cold, which halves a given worker's productivity, but is far less contagious for a far shorter length of time (specifically, about 5 days).
				Many people in the "Before Times" would be tempted -- or perhaps even required -- to go to work in spite of these minor illnesses. What happens in the office when they do?
			</p>

			<simulation mode="noMask"/>

			<p>It doesn't take long before we've dropped to around 80-85% of our maximum production capacity. That's not ideal for anyone's bottom line.</p>
			<p>
				Well, we're not in a position to hire more workers, and we can't force our employees to work longer hours. How else can we maximize our production?
				What if everyone wears masks when they're feeling ill? Since most face coverings aren't really designed to protect you as much as they are to protect those around you, those who aren't sick don't have to wear them.
			</p>
			<p>Let's make a conservative assumption and say that this is, on average, about 33% effective at preventing infection. How does the office look now?</p>

			<p class="small">btw I know the sick workers aren't actually wearing masks and the healthy workers are...just pretend it's the other way around pls</p>

			<simulation mode="mask"/>

			<p>Interesting...our employees are not working themselves any harder, yet it looks like we're now hovering at close to 90% of our maximum production capacity! Can we do even better?</p>

			<p>There is one last tactic we could try instead of masks: the nuclear option of working from home. "But working from home is awful!" you might say, "And it's way less productive! There are some jobs you just can't do unless you're in-person!"</p>
			<p>
				Alright, fine. No one likes working from home, so they will only do it after they begin to feel sick. 
				And since some jobs just can't be done unless you're in-person, let's say each worker who works from home will, on average, be one tenth as productive as their in-office colleagues.
			</p>

			<simulation mode="WFH"/>

			<p>Wow! Even without masks (and with barely any productivity when working at home), we hardly ever drop below 95% of our max production capacity!</p>
			<p>
				So what's the upshot? <b>Just because we can go back to our 2018-19 work habits doesn't mean we should be so quick to do so.</b>
				By continuing to support work from home (or even permitting more generous sick leave) and recommending the use of masks when one needs to work in-office while sick, employers can not only promote the health of those under them, but they could even boost their own bottom lines as well.
			</p>
			<p>No matter how bad things get, we should never aim to return to some status quo; we should always strive for <b>improvement</b> in our lives and the lives of those around us.</p>


		</div>`,
		
	}) 
})