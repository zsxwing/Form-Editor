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

	var forms = [];
	var discover = function(doc) {
		var formElements = doc.getElementsByTagName("form");
		for ( var i = 0; i < formElements.length; i++) {
			var formElement = formElements[i];
			var form = {};
			form.action = formElement.action;
			form.method = formElement.method;
			var inputs = [];
			handleTag(formElement, inputs, "input");
			handleTag(formElement, inputs, "textarea");
			handleTag(formElement, inputs, "select");
			form.inputs = inputs;
			forms.push(form);
		}
		var iframeElements = doc.getElementsByTagName("iframe");
		for ( var i = 0; i < iframeElements.length; i++) {
			var iframeElement = iframeElements[i];
			if (iframeElement.contentDocument) {
				discover(iframeElement.contentDocument);
			}
		}
	};
	discover(document);
	sendResponse({
		forms : forms,
		charset : document.charset
	});
});
