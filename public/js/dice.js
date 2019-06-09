
$(document).ready(function () {

	var socket = io();
	socket.on('detailOrder', function (data) {
		$("#table tbody").append(
			"<tr>" +
			"<td>" + data.username + "</td>" +
			"<td>" + data.moneyOrder + "</td>" +
			"<td>" + data.stateOrder + "</td>" +
			"</tr>"
		);
	});

	//elements
	const eleDice = $('#dice');
	const eleText = $('#text');
	const textShake = 'Shake, shake, shake...';
	const stateEven = "Chan";
	const stateOdd = "Le";
	var result;

	//function callback when click
	const clickButton = () => {
		$('#text').text(textShake);
		$('#text').addClass('shake');
		socket.on('result', function (data) {
			eleDice.html(data.point);
			eleText.html(data.number);
			result = parseInt(data.number);
			if (result % 2 == 0) {
				$('table tr td').each(function () {
					var texto = $(this).text();
					if (texto == 'Chan')
						$(this).parents("tr").css("color", "red");
				});
			}
			else {
				$('table tr td').each(function () {
					var texto = $(this).text();
					if (texto == 'Le')
						$(this).parents("tr").css("color", "red");
				});
			}
			setTimeout(function () {
				$("tbody").empty();
				$("#even").attr("disabled", false);
				$("#odd").attr("disabled", false);
			}, 4000);

			$('#text').removeClass('shake');
		});
	}

	socket.on('time', function (time) {
		let interval = setInterval(function () {
			milliseconds = Date.now() - time;
			$('#text').text(10 - Math.round(milliseconds / 1000));
			if (milliseconds >= 10000) {
				clickButton();
				clearInterval(interval);
			}
		}, 100);
	})

	$("#even").click(function () {
		if ($("#monney").val() != '') {
			let moneyOrder = parseInt($('#monney').val());
			let detailOrder = {
				username: username,
				moneyOrder: moneyOrder,
				stateOrder: stateEven
			};
			socket.emit('detailOrder', detailOrder);
			socket.on('result', function (data) {
				let coin = parseInt($('#coin').text());		
				if (parseInt(data.number) % 2 == 0) {				
					$('#coin').html(parseInt(moneyOrder + coin));
					var datails = {
						coin: parseInt(moneyOrder + coin),
						username: username
					}
					socket.emit('totalcoin', datails);
				}
				else {		
					$('#coin').html(parseInt(coin - moneyOrder));
					var datails = {
						coin: parseInt(coin - moneyOrder),
						username: username
					}
					socket.emit('totalcoin', datails);
				}
				moneyOrder = 0;
			});
			$("#even").attr("disabled", true);
			$("#odd").attr("disabled", true);
			$("#error").text("");
		}
		else {
			$("#error").text("Please input money order");
		}

	});

	$("#odd").click(function () {
		if ($("#monney").val() != '') {
			let moneyOrder = parseInt($('#monney').val());
			let detailOrder = {
				username: username,
				moneyOrder: moneyOrder,
				stateOrder: stateOdd
			};
			socket.emit('detailOrder', detailOrder);
			socket.on('result', function (data) {
				let coin = parseInt($('#coin').text());
				if (parseInt(data.number) % 2 == 1) {
					$('#coin').html(parseInt(moneyOrder + coin));
					var datails = {
						coin: parseInt(moneyOrder + coin),
						username: username
					}
					socket.emit('totalcoin', datails);
				}
				else {
					$('#coin').html(parseInt(coin - moneyOrder));
					var datails = {
						coin: parseInt(coin - moneyOrder),
						username: username
					}
					socket.emit('totalcoin', datails);
				}
				moneyOrder = 0;
			});
			$("#odd").attr("disabled", true);
			$("#even").attr("disabled", true);
			$("#error").text("");
		}
		else {
			$("#error").text("Please input money order");
		}
	});

});