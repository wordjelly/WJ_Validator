$(document).on("ready",function(){
	var args = {
		"new_book":{
			"book_name":{
				"validation_event":{
					"focus_change":true
				},
				"validate_with":[{
					"remote":"true",
					"failure_message":"The server failed to validate your input.",
					"ajax_settings":{
						"url": "check_name",
						"dataType":"json",
						"data":{
								"name":$("#book_name").val()
							}
						}
					}
				]
			}
		}
	};

	var validator = new WJ_Validator(args,"materialize");
});