$(function() {
    var globalForms = [];

    var isEmptyString = function(str) {
        return str == null || typeof str == "undefined" || str.length == 0;
    }

    function emptyStringCheck(str) {
        return isEmptyString(str) ? "" : str;
    }

    function loadForms(forms) {
        var formSelect = $("#form_select").html("");
        globalForms = [];
        for ( var i = 0; i < forms.length; i++) {
            var form = forms[i];
            $("<option/>", {
                val : i,
                text : emptyStringCheck(form.action)
            }).appendTo(formSelect);
            globalForms.push(form);
        }
        appendHistory();
    }

    function showForm(form) {
        var action = emptyStringCheck(form.action);
        var method = emptyStringCheck(form.method);
        $("#form_action").val(action);
        $("#form_method").val(method);
        $("#form_charset").val(form.acceptCharset);
        var formDetail = $("#form_detail").html("");
        for ( var i = 0; i < form.inputs.length; i++) {
            var input = form.inputs[i];
            formDetail.append(getRow(emptyStringCheck(input.name),
                    emptyStringCheck(input.value)));
        }
    }

    function getRow(name, value) {
        var removeButton = $(
                "<button type='button' title='Remove this GET(POST) parameter' >&nbsp;-&nbsp;</button>")
                .click(function() {
                    $(this).parent().parent().remove();
                });
        return $("<tr/>").append($("<td/>").append($("<input/>", {
            val : name,
            type : "text"
        }))).append($("<td/>").append($("<input/>", {
            val : value,
            type : "text"
        }))).append($("<td/>").append(removeButton));
    }

    function appendHistory() {
        var formSelect = $("#form_select");
        var optgroup = $("<optgroup/>").attr("label", "history");
        var history = loadHistory();
        var index = globalForms.length;
        for ( var i = 0; i < history.length; i++) {
            var form = history[i];
            $("<option/>", {
                val : index + i,
                text : emptyStringCheck(form.action)
            }).appendTo(optgroup);
            globalForms.push(form);
        }
        formSelect.append(optgroup);
        if (globalForms.length > 0) {
            showForm(globalForms[0]);
        }
    }

    function reload() {
        $("#form_action").val("");
        $("#form_charset").val("");
        $("#form_detail").html("");
        $("#form_select").html("");
        globalFroms = [];
        appendHistory();
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {}, function handler(response) {
                loadForms(response.forms);
            });
        });
    }

    $("#reload_button").click(function() {
        reload();
    });

    $("#add_button").click(function() {
        $("#form_detail").append(getRow("", ""));
    });

    $("#form_editor").submit(function() {
        if (isEmptyString($("#form_action").val())) {
            return false;
        }

        var form = {};
        form.action = $("#form_action").val();
        form.method = $("#form_method").val();
        form.acceptCharset = $("#form_charset").val();

        $(this).attr({
            "action" : form.action,
            "method" : form.method,
            "accept-charset" : form.acceptCharset,
            "target" : "_blank"
        });

        form.inputs = [];
        var formHidden = $("#form_hidden").html("");
        var inputs = $("#form_detail input");
        for ( var i = 0; i < inputs.length; i += 2) {
            if (!isEmptyString(inputs[i].value)) {
                formHidden.append($("<input/>", {
                    name : inputs[i].value,
                    val : inputs[i + 1].value,
                    type : "hidden"
                }));
                form.inputs.push({
                    name : inputs[i].value,
                    value : inputs[i + 1].value
                });
            }
        }
        addHistory(form);
        return true;
    });

    $("#form_select").change(function() {
        var index = $(this).val();
        if (index < globalForms.length) {
            showForm(globalForms[index]);
        }
    });

    reload();
});
