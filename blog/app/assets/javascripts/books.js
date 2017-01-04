$(document).on("ready",function(){
	
	var ajax_settings = function(def,e){
		//from the event get the field value.
		var res = {
			"url": "check_name",
			"dataType":"json",
			"data":{
					"book":{
						"name":$("#" + e.target.id).val()
					}
				}
			}
		
		return res;
	}
	

	var args = {
		"new_book":{
			"book_name":{
				"validation_events":{
					"keyup" : true
				},
				"validate_with":[
					{"format" : "email",
					"failure_message": "Please enter a valid email address"
					}
				]
			},
			"book_password":{
				"validation_events":{
					"focus":true,
					"focusout":true
				},
				"validate_with":[{
					"should_be_equal":"true",
					"failure_message":"fields do not match",
					"field_array":["book_confirm_password"]
					}
				]
			}
		}
	};

	var validator = new WJ_Validator(args,"materialize",true);
});

/****
,
{
"required":true,
"failure_message":"this field is required"
},
{"format" : "email",
"failure_message": "Please enter a valid email address"
}
****/