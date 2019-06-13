$(document).ready(function () {
	const eleDice = $('#dice');
	const eleText = $('#text');
	const textShake = 'Shake, shake, shake...';
	const stateEven = "Chan";
	const stateOdd = "Le";
	let result;
	let socket = io();

	socket.on('connect', () => {
		$('#loadingscreen').css("display", "none");
		$('#mainscreen').show();
		listen();
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

	const listen = () => {
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
						clearInterval(interval);
					}
				}, 100);
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
	}

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