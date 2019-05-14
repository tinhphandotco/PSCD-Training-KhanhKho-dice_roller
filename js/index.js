$(document).ready(function () {
	pressBtn('#shaker');   	
	output ="&#x2685; "+"&#x2685; ";
	document.getElementById('dice').innerHTML = output;
	$('#shaker').on('click', function() {
		$('#text').text('Shake, shake, shake...');
		$('#text').addClass('shake');
		setTimeout(function(){
			rollTheDice();
			$('#text').removeClass('shake');
		}, 200);
	});	
	function rollTheDice()
	{
		var i,
		number=0,
		faceValue,
		output = '';
		diceCount = document.querySelector('input[type=number]').value || 2;
        for (i = 0; i < diceCount; i++) {
        	faceValue = Math.floor(Math.random() * 6);
        	number+=(faceValue+1);
        	output += "&#x268" + faceValue + "; ";
        }
        document.getElementById('dice').innerHTML = output;
        if ((number)==diceCount)
        {
        	document.getElementById('text').innerHTML = "Snake eyes!";
        } 
        else {
        	document.getElementById('text').innerHTML = number;
        }
        
    }
	function pressBtn(button) {
		$('#shaker').on('mousedown', function() {
			$(this).removeClass('btn_up');
			$(this).addClass('btn_down');
		});
		$('#shaker').on('mouseup', function() {
			$(this).removeClass('btn_down');
			$(this).addClass('btn_up');
		});
	}
});