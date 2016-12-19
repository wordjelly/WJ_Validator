/****
ARGUMENTS
{
	form_id:{

		field_id:{
					
			validation_event: focus_change / keypress
			
			validate_with: {validator_name: arg,...more validators} / function  

			on_success: framework_name / function 

			on_failure: framework_name / function

			do_before_validating: [list of ids to check if valid] / function

			do_after_validating: [list of ids to enable if this one is valid] / function
						
		},
		...more field ids
	},
	....more form ids
}
**/
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
				"validation_event":{
					"focus_change":true
				},
				"validate_with":[{
					"required":"true","failure_message":"this field is required"
				}]
			},
			"remote-field":{
				"validation_event":{
					"focus_change":true
				},
				"validate_with":[{
					"remote":"true","failure_message":"The server failed to validate your input.","ajax_settings":{
						"url": "http://www.mocky.io/v2/5857d33b120000800ac8ae62.jsonp",
						"dataType":"json"
					}
				}
				]
			}
		}
	};

	var validator = new WJ_Validator(args,"materialize");
	//validator.register_handlers();
	//validator.register_framework_specific_handlers();

});