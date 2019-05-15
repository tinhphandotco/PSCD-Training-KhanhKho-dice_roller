$(document).ready(function () {
	//elements
	const eleTextNumber = $('#textNumber');
	const eleDice = $('#dice');
	const eleText = $('#text');

	//variables
	const delayTime = 300;
	let output;
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
		rollTheDice()
		.then((number) =>{
		if ((number)==2)
		{
			eleText.html(textSnake);
		} 
		else {
			eleText.html(number);
		}
		$('#text').removeClass('shake');
		})
		.catch((err) => {
			console.log("ERROR: ", err.message)
		})
	}

	//function xu li khi nhan nut shake
	const rollTheDice = () => {
		let i,
		number=0,
		faceValue,
		output = '';
		let diceCount = eleTextNumber.val() || 2;
		for (i = 0; i < diceCount; i++) {
			faceValue = Math.floor(Math.random() * 6);
			number+=(faceValue+1);
			output += point + faceValue + "; ";
		}
		eleDice.html(output) ;
		return new Promise ((resolve,reject) =>{
			setTimeout(() => {
				resolve(number)
			}, delayTime);
		})
	}
	//Function init
	const init = () => {
		pressBtn('#shaker');   	
		output ="&#x2685; "+"&#x2685; ";
		eleDice.html(output);
	}
	
	init();
	$('#shaker').on('click', clickButton);
	
});