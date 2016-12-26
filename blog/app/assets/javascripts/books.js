$(document).on("ready",function(){
	
	var ajax_settings = function(field_val,args){
		var res = {
			"url": "check_name",
			"dataType":"json",
			"data":{
					"book":{
						"name":field_val
					}
				}
			}
		
		return res;
	}
	

	var args = {
		"new_book":{
			"book_name":{
				"validation_event":{
					"focus_change":true
				},
				"validate_with":[{
					"remote":"true",
					"failure_message":"that book name is taken, choose another.",
					"ajax_settings": ajax_settings
					}
				]
			}
		}
	};

	var validator = new WJ_Validator(args,"materialize",true);
});