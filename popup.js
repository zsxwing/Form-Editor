$(function() {
    var isEmptyString = function(str) {
        return str == null || typeof str == "undefined" || str.length == 0;
    }

    function emptyStringCheck(str) {
        return isEmptyString(str) ? "" : str;
    }

    function loadForms(forms) {
        var formSelect = $("#form_select").html("");
        for ( var i = 0; i < forms.length; i++) {
            var form = forms[i];
            $("<option/>", {
                val : i,
                text : emptyStringCheck(form.action)
            }).appendTo(formSelect);
        }
        formSelect.change(function() {
            loadForm(forms[$(this).val()]);
        });
        if (forms.length > 0) {
            loadForm(forms[0]);
        }
    }

    function loadForm(form) {
        var action = emptyStringCheck(form.action);
        var method = emptyStringCheck(form.method);
        $("#form_action").val(action);
        $("#form_method").val(method);
        $("#form_charset").val(form.acceptCharset);
        $("#form_editor").submit(function() {
            $(this).attr({
                "action" : $("#form_action").val(),
                "method" : $("#form_method").val(),
                "accept-charset" : $("#form_charset").val(),
                "target" : "_blank"
            });

            var formHidden = $("#form_hidden").html("");
            var inputs = $("#form_detail input");
            for ( var i = 0; i < inputs.length; i += 2) {
                if (!isEmptyString(inputs[i].value)) {
                    formHidden.append($("<input/>", {
                        "name" : inputs[i].value,
                        "value" : inputs[i + 1].value,
                        "type" : "text"
                    }));
                }
            }
            return true;
        });

        var formDetail = $("#form_detail").html("");
        for ( var i = 0; i < form.inputs.length; i++) {
            var input = form.inputs[i];
            formDetail.append(getRow(emptyStringCheck(input.name),
                    emptyStringCheck(input.value)));
        }
    }

    function getRow(name, value) {
        return $("<tr/>").append($("<td/>").append($("<input/>", {
            "value" : name,
            "type" : "text"
        }))).append($("<td/>").append($("<input/>", {
            "value" : value,
            "type" : "text"
        }))).append(
                $("<td/>").append(
                        $("<button type='button' title='Remove this GET(POST) parameter' >&nbsp;-&nbsp;</button>")
                                .click(function() {
                                    $(this).parent().parent().remove();
                                })));
    }

    function reload() {
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

    reload();
});
