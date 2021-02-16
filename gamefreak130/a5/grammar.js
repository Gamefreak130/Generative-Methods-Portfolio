let petGrammar = {
    "personalityAdjs" : ["untrustworthy", "unreliable", "nauseous", "adventurous", "aggressive", "loyal", "smart", "funny", "noisy", "crazy", "loud", "proud", "depressed", "happy", "quiet", "obnoxious", "skittish", "easily-distracted", "grumpy", "divine", "pleasant", "sinister", "cowardly"],
    "choiceAdjs" : ["interesting", "weird", "absurd", "amazing", "wise", "intriguing", "odd", "weird", "cool", "neat", "exotic", "peculiar"],
    "invalidChoice" : ["I've never heard of it.", "Sounds #choiceAdjs#.", "Is that #language# or something?", "What's that?", "We don't have that available."],
    "language" : ["French", "Italian", "Spanish", "Estonian", "Russian", "Polish", "Esperanto"],
    "intro" : ["Congratulations on finding a new friend! It looks like #name.capitalize# is feeling #mood# right now. What would you like to do?"],
    "petTypes" : ["monkey", "chimpanzee", "dog", "puppy", "raccoon", "cat", "kitten", "horse", "pony", "unicorn", "cow", "water buffalo", "pig", "boar", "llama", "giraffe", "mouse", "rat", "hamster", "guinea pig", "rabbit", "bunny", "hedgehog", "chipmunk", "skunk", "badger", "turkey", "kangaroo", "bird", "duck", "parrot", "frog", "turtle", "tortoise", "lizard", "salamander", "gecko", "snake", "dragon", "sauropod", "dinosaur", "t-rex", "dolphin", "whale", "fish", "shark", "octopus", "snail", "spider", "scorpion", "crab", "lobster", "shrimp", "squid"],
    "moods" : ["playful", "excited", "happy", "hungry", "sleepy", "tired", "content", "weird", "grumpy", "sad", "lonely", "elated", "anxious", "nauseous"],
    "petNames" : ["Fido", "Alfredo", "Shredder", "Steel", "Saber", "Tex", "Rock", "Jackson", "Ace", "Knute", "Wolf", "Thorax", "Abs", "Burt", "Bret", "Duke", "Speedy", "Abby", "Admiral", "Amigo", "Astro", "Barkley", "Barnaby", "Birdie", "Bobo", "Isabelle", "Jingles", "Justice", "Courage", "Junior", "Klaus", "Kramer", "Lightning", "Monster", "Napoleon", "Snowball", "Noodles", "Nugget", "Nutmeg", "Peanut", "Phoenix", "Pickles", "Pluto", "Quincy", "Rosebud", "Sarge", "Skippy", "Snuggles", "Thor", "Truffles", "Wolfgang", "Zeus", "Zorro"],

    "surpriseActions" : ["feed #name# some #petFood#", "pet #name#", "give #name# a hug", "play with #name#", "read a story", "tuck #name# in for bedtime", "take #name# for a #motionVerb#", "brush #name#", "give #name# #gift#", "cuddle up with #name#"],
    "noChange" : ["You #tryVP# to #action#. #name# #dislikeVP#.", "You #action#. #name# #dislikeVP#.", "You #action#. It isn't very effective.", "You #tryVP# to #action#. #name# #likeVP#.", "You #action#. #name# #likeVP#.", "You #action#. #name# is still #mood#.", "You #tryVP# to #action#. #name# appreciates the thought, but is still #mood#.", "After thinking it over, you decide it's probably best not to #action#."],
    "yesChange" : ["You #action#. It's super effective! #name# is #mood# now.", "You #tryVP# to #action#. #name# #dislikeVP#. They're feeling #mood# now.", "You #action#. #name# #likeVP#. They're feeling #mood# now.", "You #action#. #name# seems #mood# now.", "After some thought, you decide it's probably best not to #action#. #name# is #mood# now."],

    "tryVP" : ["attempt", "try", "make an effort", "try your hardest", "reach out", "really, really try", "reluctantly try", "decide"],
    "dislikeVP" : ["is having none of it", "does not appreciate it", "is unmoved", "doesn't seem to like it", "is reminded of better days", "gives you a death stare", "wonders what its purpose in life is", "stares at you blankly"],
    "likeVP" : ["loves you", "couldn't be happier", "is pleased", "is pleased by your actions", "smiles appreciatively", "seems to enjoy it", "likes it", "#loveVP# as a sign of affection", "#loveVP# as a token of appreciation"],
    "loveVP" : ["waters your plants", "nibbles your #bodyPart#", "snuggles up to you", "offers to drive you to work", "cooks #meal#", "gives you #gift#", "#motionVerb.s# circles around you"],
    "motionVerb" : ["run", "walk", "swim"],
    "bodyPart" : ["finger", "toe", "nose", "eyeball", "calf", "shoulder", "knee"],
    "meal" : ["breakfast", "lunch", "dinner", "#petFood#"],
    "petFood" : ["#petTypes# food", "#petTypes# kibble", "cake", "vanilla ice cream", "bread crumbs", "bread", "carbonara", "mashed potatoes"],
    "gift" : ["two turntables and a microphone", "several pairs of socks", "a hand-knit sweater", "a surgical mask", "a Nintendo Switch", "a used copy of The Sims 4", "a shiny trash can", "way too many hugs", "a gift card to Applebee's", "a denim vest"]

}