function reload() {
	var forms = loadHistory();
	var historyBoard = $("#history").html("");
	for ( var i = 0; i < forms.length; i++) {
		var form = forms[i];
		var removeButton = $(
				"<button type='button' class='btn btn-danger' title='Remove the history' value='"
						+ i + "'>&nbsp;-&nbsp;</button>").click(function() {
			removeHistory($(this).attr('value'));
			reload();
		});
		var tr = $("<tr/>").append($("<td/>").append(removeButton)).append(
				$("<td/>", {
					text : form.action
				})).append($("<td/>", {
			text : form.method
		})).append($("<td/>", {
			text : form.acceptCharset
		})).append($("<td/>", {
			text : JSON.stringify(form.inputs)
		}));
		historyBoard.append(tr);
	}
}

function resizeHistory() {
	var size = parseInt($("#history_size").val());
	if (isNaN(size) || size < 0 || size > 100) {
	} else {
		setHistoryMaxSize(size);
		truncHistory();
		reload();
	}
	$("#history_size").val(getHistoryMaxSize());
}

$(function() {
	reload();
	$("#history_size").val(getHistoryMaxSize());
	$("#clear_history").click(function() {
		cleanHistory();
		reload();
	});
	$("#save_history_size").click(resizeHistory);
});