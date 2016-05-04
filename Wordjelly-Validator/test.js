$(document).on("ready",function(){
	$("body").prepend("<div style='margin-bottom:30px;'>document ready</div>");
	
	var on_success = function(e){
		alert("success");
	};
	var on_failure = function(validator_name,validator_arg,e,failure_message){
		alert("failure");
	}
	var args = {
		"test":{
			"email":{
				"validation_event": {
					"focus_change":true,
				},
				"validate_with":[
					{"format":"email","failure_message":"this is not a valid email"},
					{"required":true, "failure_message": "this field is required"}
				],
				"on_success": on_success,
				"on_failure": on_failure
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

});