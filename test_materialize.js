$(document).on("ready",function(){
	$("body").prepend("<div style='margin-bottom:30px;'>document ready</div>");
	
	
	var args = {
		"test":{
			"email":{
				"validation_event": {
					"focus_change":true,
				},
				"validate_with":[
					{"format":"email","failure_message":"this is not a valid email", "skip_empty":false}
				]
			},
			"password":{

			},
			"confirm-password":{

			},
			"required-field":{

			},
			"remote-field":{

			}
		}
	};

	var validator = new WJ_Validator(args,"materialize");
	//validator.register_handlers();
	//validator.register_framework_specific_handlers();

});