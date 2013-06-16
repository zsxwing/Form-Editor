    function reload() {
        var forms = loadHistory();
        var historyBoard = $("#history").html("");
        for ( var i = 0; i < forms.length; i++) {
            var form = forms[i];
            var removeButton = $(
                    "<button type='button' title='Remove the history' value='"+i+"'>&nbsp;-&nbsp;</button>")
                    .click(function() {
                        removeHistory($(this).attr('value'));
                        reload();
                    });
            var tr = $("<tr/>").append($("<td/>").append(removeButton)).append(
                    $("<td/>", {
                        text : JSON.stringify(form)
                    }))
            historyBoard.append(tr);
        }
    }

    $(function() {
        reload();
        $("#history_size").val(getHistoryMaxSize());
    });

    function resizeHistory() {
        var size = parseInt($("#history_size").val());
        if (isNaN(size) || size<0 || size>100) {
        } else {
            setHistoryMaxSize(size);
            truncHistory();
            reload();
        }
        $("#history_size").val(getHistoryMaxSize());
    }
