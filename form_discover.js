chrome.extension.onRequest
		.addListener(function(request, sender, sendResponse) {
			var isEmptyString = function(str) {
				return str == null || typeof str == "undefined"
						|| str.length == 0;
			}

			var forms = [];
			var errors = [];

			var url = window.location.href;
			var questionMark = url.indexOf("?");
			if (questionMark >= 0) {
				try {
					var form = {};
					form.action = url.substring(0, questionMark);
					form.method = "GET";
					form.acceptCharset = document.charset;
					var inputs = [];
					var getParams = url.substring(questionMark + 1).split("&");

					for ( var i = 0; i < getParams.length; i++) {

						var getParam = getParams[i].split("=");
						if (getParam.length == 0) {
							continue;
						} else if (getParam.length == 1) {
							inputs.push({
								name : decodeURIComponent(getParam[0]),
								value : ""
							});
						} else {
							inputs.push({
								name : decodeURIComponent(getParam[0]),
								value : decodeURIComponent(getParam.slice(1,
										getParam.length).join("="))
							});
						}

					}

					form.inputs = inputs;
					forms.push(form);
				} catch (e) {
					errors
							.push("Sorry, there are some invalid charectors in the url. Form Editor can not help you extract the get parameters.");
				}
			}

			var handleTag = function(form, inputs, tag) {
				var tags = form.getElementsByTagName(tag);
				for ( var i = 0; i < tags.length; i++) {
					var tag = tags[i];
					if (!isEmptyString(tag.name)) {
						inputs.push({
							name : tag.name,
							value : tag.value
						});
					}
				}
			}

			var discover = function(doc) {
				var formElements = doc.getElementsByTagName("form");
				for ( var i = 0; i < formElements.length; i++) {
					var formElement = formElements[i];
					var form = {};
					form.action = formElement.action;
					form.method = formElement.method;
					form.acceptCharset = isEmptyString(formElement.acceptCharset) ? doc.charset
							: formElement.acceptCharset;
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
				charset : document.charset,
				errors : errors
			});
		});
