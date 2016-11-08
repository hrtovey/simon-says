var ss,
SimonSays;

SimonSays = {
	settings: {
		buttons: ['green', 'red', 'yellow', 'blue'],
		buttonPresses: [],
		buttonsPressed: [],
		greenSound: new Audio('sounds/simonSound1.mp3'),
		redSound: new Audio('sounds/simonSound2.mp3'),
		yellowSound: new Audio('sounds/simonSound3.mp3'),
		blueSound: new Audio('sounds/simonSound4.mp3'),
		errorSound: new Audio('sounds/error.mp3'),
		greenButton: document.getElementById('green'),
		redButton: document.getElementById('red'),
		yellowButton: document.getElementById('yellow'),
		blueButton: document.getElementById('blue'),
		window: document,
		startButton: document.getElementById('start-button'),
		restartButton: document.getElementById('restart-button'),
		counter: 0,
		counterDisplay: document.getElementById('counter-display'),
		strictToggle: document.getElementById('strict-toggle'),
		playStrict: document.getElementById('play-strict'),
		strictMode: false,
		lose: '<img class="icon" src="images/frown.svg">',
		win: '<img class="icon" src="images/smile.svg">'
	},

	init: function() {
		ss = SimonSays.settings;
		SimonSays.bindUIActions();

		
	},

	bindUIActions: function() {

		ss.startButton.addEventListener('click', function() {
			SimonSays.addClass(ss.startButton, 'hide');
			SimonSays.removeClass(ss.restartButton, 'hide');
			SimonSays.chooseNextButton();
		});

		ss.strictToggle.addEventListener('change', function() {
			SimonSays.playStrict();
		});

	},

	pressRestart: function() {
		SimonSays.restartGame();
	},

	listenForClicks: function() {
		ss.greenButton.addEventListener('mousedown', SimonSays.pressGreen);
		ss.redButton.addEventListener('mousedown', SimonSays.pressRed);
		ss.yellowButton.addEventListener('mousedown', SimonSays.pressYellow);
		ss.blueButton.addEventListener('mousedown', SimonSays.pressBlue);
		ss.restartButton.addEventListener('click', SimonSays.pressRestart);

		SimonSays.addClass(ss.greenButton, 'clickable');
		SimonSays.addClass(ss.redButton, 'clickable');
		SimonSays.addClass(ss.yellowButton, 'clickable');
		SimonSays.addClass(ss.blueButton, 'clickable');
		SimonSays.removeClass(ss.restartButton, 'unclickable');



		ss.window.addEventListener('mouseup', function() {
			SimonSays.unpressButton('green');
			SimonSays.unpressButton('red');
			SimonSays.unpressButton('yellow');
			SimonSays.unpressButton('blue');
		});
	},

	restartGame: function() {
		SimonSays.stopListeningForClicks();
		ss.buttonPresses = [];
		SimonSays.resetCount();

		setTimeout(function() {
			SimonSays.chooseNextButton();
			}, 1000);

	},

	playStrict: function() {

		if (ss.playStrict.checked) {
			ss.strictMode = true;
		} else {
			ss.strictMode = false;
		}

	},

	pressGreen: function() {
		SimonSays.stopListeningForClicks();
		var position = ss.buttonsPressed.length;
		SimonSays.isButtonPressCorrect(position, 'green');
	},

	pressRed: function() {
		SimonSays.stopListeningForClicks();
		var position = ss.buttonsPressed.length;
		SimonSays.isButtonPressCorrect(position, 'red');
	},

	pressYellow: function() {
		SimonSays.stopListeningForClicks();
		var position = ss.buttonsPressed.length;
		SimonSays.isButtonPressCorrect(position, 'yellow');
	},

	pressBlue: function() {
		SimonSays.stopListeningForClicks();
		var position = ss.buttonsPressed.length;
		SimonSays.isButtonPressCorrect(position, 'blue');
	},

	stopListeningForClicks: function() {

		ss.greenButton.removeEventListener('mousedown', SimonSays.pressGreen);
		ss.redButton.removeEventListener('mousedown', SimonSays.pressRed);
		ss.yellowButton.removeEventListener('mousedown', SimonSays.pressYellow);
		ss.blueButton.removeEventListener('mousedown', SimonSays.pressBlue);
		ss.restartButton.removeEventListener('click', SimonSays.pressRestart);

		SimonSays.removeClass(ss.greenButton, 'clickable');
		SimonSays.removeClass(ss.redButton, 'clickable');
		SimonSays.removeClass(ss.yellowButton, 'clickable');
		SimonSays.removeClass(ss.blueButton, 'clickable');
		SimonSays.addClass(ss.restartButton, 'unclickable');

		ss.window.removeEventListener('mouseup', function() {
			SimonSays.unpressButton('green');
			SimonSays.unpressButton('red');
			SimonSays.unpressButton('yellow');
			SimonSays.unpressButton('blue');
		});

	},

	addClass: function(el, className) {
		if (el.classList) {
		  el.classList.add(className);
		}
		else {
		  el.className += ' ' + className;
		}
	},

	removeClass: function(el, className) {
		if (el.classList) {
		  el.classList.remove(className);
		}
		else {
		  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	inputSequence: function() {
		// unlocks ability to click

		SimonSays.listenForClicks();


	},

	isSequenceFinished: function(sequence) {
		if (sequence.length === ss.buttonPresses.length) {
			return true;
		} else {
			return false;
		}
	},

	outputSequence: function(sequence) {
		ss.buttonsPressed = [];
		for (var i=0; i<sequence.length; i++) {

			SimonSays.setDelay(sequence[i], i);
			
		}

		
		setTimeout(function() {
				SimonSays.inputSequence(sequence);
			}, (1000 * sequence.length) - 500);
	},


	setDelay: function(color, timing) {
		setTimeout(function() {
				SimonSays.playButton(color);
			}, 1000 * timing);
	},

	pressButton: function(color) {

		var button = document.getElementById(color);
		SimonSays.playSound(color);
		SimonSays.addClass(button, 'pressed');
	},

	isButtonPressCorrect: function(position, color) {
		ss.buttonsPressed.push(color);
		if (ss.buttonPresses[position] === color && ss.buttonPresses.length !== ss.buttonsPressed.length) {
			SimonSays.pressButton(color);
			SimonSays.inputSequence();
		} else if (ss.buttonPresses[position] === color) {
			if (ss.counter < 20) {
				SimonSays.pressButton(color);
				setTimeout(function() {
				SimonSays.chooseNextButton();
				}, 1500);
			} else {

				SimonSays.pressButton(color);
				SimonSays.gameWon();
			}
		} else {
			SimonSays.playSound('error');
			if (ss.strictMode) {
				SimonSays.gameLost();
			} else {
				SimonSays.gameOver();
			}
		}
	},

	gameWon: function() {
		ss.counterDisplay.innerHTML = ss.win;
		setTimeout(function() {
			SimonSays.restartGame();
		}, 2000);
	},

	gameLost: function() {
		ss.counterDisplay.innerHTML = ss.lose;
		setTimeout(function() {
			SimonSays.restartGame();
		}, 2000);
	},

	gameOver: function() {
		SimonSays.stopListeningForClicks();
		setTimeout(function() {
			SimonSays.outputSequence(ss.buttonPresses);
			}, 1000);
	},

	unpressButton: function(color) {
		var button = document.getElementById(color);
		SimonSays.removeClass(button, 'pressed');
	},

	chooseNextButton: function() {
		if (ss.counter < 20) {
			SimonSays.addToCount();
			var chosenButton = ss.buttons[Math.floor(Math.random() * 4)];
			ss.buttonPresses.push(chosenButton);
			SimonSays.outputSequence(ss.buttonPresses);
		} else {
			console.log("congratulations, you win!");
		}
	},

	playButton: function(chosenButton) {

		SimonSays.pressButton(chosenButton);
		setTimeout(function() {
				SimonSays.unpressButton(chosenButton);
			}, 600);
	},

	resetCount: function() {
		ss.counter = 0;
		SimonSays.displayCounter();
	},

	addToCount: function() {
		ss.counter++;
		SimonSays.displayCounter();
	},

	displayCounter: function() {
		ss.counterDisplay.textContent = ss.counter.toString();
	},

	playSound: function(button) {
		switch (button) {
			case "green":
				ss.greenSound.play();
				break;
			case "red":
				ss.redSound.play();
				break;
			case "yellow":
				ss.yellowSound.play();
				break;
			case "blue":
				ss.blueSound.play();
				break;
			case "error":
				ss.errorSound.play();
				break;
			default:
				break;
		} 
	}
};


function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(SimonSays.init);