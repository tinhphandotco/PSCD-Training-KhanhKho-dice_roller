$(document).ready(function () {
	//elements
	const eleTextNumber = document.querySelector('input[type=number]');
	const eleDice = document.getElementById('dice');
	const eleText =document.getElementById('text');

	//variables
	const delayTime = 300;
	var output;
	const point = "&#x268" ;
	const textSnake = "Snake eyes!";
	const textShake = 'Shake, shake, shake...';

	//function press button Shake
	const pressBtn =(button) => {
		$('#shaker').on('mousedown', function() {
			$(this).removeClass('btn_up');
			$(this).addClass('btn_down');
		});
		$('#shaker').on('mouseup', function() {
			$(this).removeClass('btn_down');
			$(this).addClass('btn_up');
		});
	}

	//function callback when click
	const clickButton = () => {
		$('#text').text(textShake);
		$('#text').addClass('shake');
		setTimeout(function(){
			rollTheDice();
			$('#text').removeClass('shake');
		}, delayTime);
	}

	//function xu li khi nhan nut shake
	const rollTheDice = () => {
		let i,
		number=0,
		faceValue,
		output = '';
		var diceCount = eleTextNumber.value || 2;
		for (i = 0; i < diceCount; i++) {
			faceValue = Math.floor(Math.random() * 6);
			number+=(faceValue+1);
			output += point + faceValue + "; ";
		}
		eleDice.innerHTML = output;
		if ((number)==diceCount)
		{
			eleText.innerHTML = textSnake;
		} 
		else {
			eleText.innerHTML = number;
		}

	}
	//Function init
	const init = () => {
		pressBtn('#shaker');   	
		output ="&#x2685; "+"&#x2685; ";
		eleDice.innerHTML = output;
	}
	
	init();
	$('#shaker').on('click', function(){
		clickButton();
	});
});