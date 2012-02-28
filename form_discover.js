chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var isEmptyString = function(str) {
		return str == null || typeof str == "undefined" || str.length == 0;
	}

	var handleTag = function(form, inputs, tag) {
		var tags = form.getElementsByTagName(tag);
		for ( var i = 0; i < tags.length; i++) {
			var tag = tags[i];
			if (!isEmptyString(tag.name)) {
				var input = {};
				input.name = tag.name;
				input.value = tag.value;
				inputs.push(input);
			}
		}
	}

	var formElements = document.getElementsByTagName("form");
	var forms = [];
	for ( var i = 0; i < formElements.length; i++) {
		var formElement = formElements[i];
		var form = {};
		form.action = formElement.action;
		form.method = formElement.method;
		var inputs = [];
		handleTag(formElement, inputs, "input");
		handleTag(formElement, inputs, "textarea");
		handleTag(formElement, inputs, "select");
		handleTag(formElement, inputs, "button");
		form.inputs = inputs;
		forms.push(form);
	}
	sendResponse({
		forms : forms
	});
});
