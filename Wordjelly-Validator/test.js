$(document).on("ready",function(){
	$("body").prepend("<div style='margin-bottom:30px;'>document ready</div>");
	
	var on_success = function(){
		alert("success");
	};
	var on_failure = function(){
		alert("failure");
	}
	var args = {
		"test":{
			"email":{
				"validation_event": {
					"focus_change":true,
				},
				"validate_with":{
					"format":"email",
					"required":true
				},
				"on_success":{
					"function": on_success
				},
				"on_failure":{
					"function": on_failure
				}
			},
			"password":{

			},
			"confirm-password":{

			},
			"required":{

			},
			"remote":{

			}
		}
	};

	var validator = new WJ_Validator(args);
	validator.register_handlers();

})