$(document).ready(function () {
	const eleDice = $('#dice');
	const eleText = $('#text');
	const textShake = 'Shake, shake, shake...';
	const stateEven = "Chan";
	const stateOdd = "Le";
	let result,tmp;
	let socket = io();

	socket.on('connect', () => {
		$('#loadingscreen').css("display", "none");
		$('#mainscreen').show();
		socket.on('time', function (data) {
			if (typeof data.start == 'undefined') {
				$('#text').text('Pending...pending...pending');
			}
			else {
				let interval = setInterval(function () {
					milliseconds = Date.now() - data.start;
					$('#text').text(10 - Math.round(milliseconds / 1000));
					if (milliseconds >= 10000) {
						clickButton();
						$("#even").attr("disabled", true);
						$("#odd").attr("disabled", true);
						clearInterval(interval);
					}
				}, 100);
				$("tbody").empty();
				$("#even").attr("disabled", false);
				$("#odd").attr("disabled", false);
			}
		});
		socket.on('detailOrder', function (data) {
			$("#table tbody").append(
				"<tr>" +
				"<td>" + data.username + "</td>" +
				"<td>" + data.moneyOrder + "</td>" +
				"<td>" + data.stateOrder + "</td>" +
				"</tr>"
			);
		});

		socket.on('resultStarted', function (data) {
			tmp=data.number;
			eleDice.html(data.point);
			eleText.html(data.number);
		})
		socket.on('listbet', function (data) {
			let array = new Array();
			array = data;
			if (array.length != 0) {
				$("#even").attr("disabled", true);
				$("#odd").attr("disabled", true);
				for (let i = 0; i < array.length; i++) {
					$("#table tbody").append(
						"<tr>" +
						"<td>" + array[i].username + "</td>" +
						"<td>" + data[i].bet + "</td>" +
						"<td>" + data[i].choose + "</td>" +
						"</tr>"
					);
					if (array[i].username == username) {
						$('#monney').val(array[i].bet)
					}
					socket.on('result', function (data) {
						if (array[i].username == username) {
							let choice = array[i].choose;
							let coin = parseInt($('#coin').text());
							if (data.number % 2 == 0) {
								if (choice == "Chan") {
									$('#coin').html(parseInt(array[i].bet + coin));
								}
								else {
									$('#coin').html(parseInt(coin - array[i].bet));
								}
							}
							else {
								if (choice == "Le") {
									$('#coin').html(parseInt(array[i].bet + coin));
								}
								else {
									$('#coin').html(parseInt(coin - array[i].bet));
								}
							}
							array[i].bet = 0;
						}
					});
				}
			}
		})
	});

	socket.on('disconnect', () => {
		$('#mainscreen').hide();
		$('#loadingscreen').css("display", "block");
	});

	const clickButton = () => {	
		$('#text').text(textShake);
		$('#text').addClass('shake');
		if(tmp!=0){
			$('#text').removeClass('shake');
			$('#text').text(tmp);
			tmp=0;
		}
		socket.on('result', function (data) {
			number = data.number;
			point = data.point;
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
			$('#text').removeClass('shake');
		});
	}
	//when click button even
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
				}
				else {
					$('#coin').html(parseInt(coin - moneyOrder));
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
	//when click button odd
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
				}
				else {
					$('#coin').html(parseInt(coin - moneyOrder));
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