/****
ARGUMENTS
{
	form_id:{

		field_id:{
					
			validation_event: focus_change / keypress

			validate_with: [{validator_name: arg},..more validators] / function  

			on_success: framework_name / function 

			on_failure: framework_name / function

			do_before_validating: [list of ids to check if valid] / function

			do_after_validating: [list of ids to enable if this one is valid] / function
						
		},
		...more field ids
	},
	....more form ids
}

---------------------------------------

acceptable validator names for "validate_with"
================================================

format: email

required:

min-length: length

remote-url: url

should_equal: id_of_other_element

----------------------------------------

****/
function WJ_Validator(args){
	this.args = args;
	this.valid_ids = {};
}

prototype.WJ_Validator = function(){
	constructor: WJ_Validator,
	register_handlers: function(){
		var focus_change_fields = [];
		var keypress_fields = [];
		_.each(Object.keys(this.args),function(form_id){
			var form = $("#" + form_id);
			_.each(Object.keys(this.args[form_id]),function(field_id){
				var field = $("#" + field_id);
				if(field["validation_event"] == "focus_change"){
					focus_change_fields.push(field_id);
				}
				else if(field["validation_event"] == "keypress"){
					keypress_fields.push(field_id);
				}
			});
		});
		focus_change_fields = focus_change_fields.join(",");
		keypress_fields = keypress_fields.join(",");

		$(document).on("focus",focus_change_fields,function(e){
			validate(e);
		});

		$(document).on("keydown",keypress_fields,function(e){
			validate(e);
		});
	},
	/***
	passes in click event.
	***/
	validate: function(e){
		var form = $("#" + e.target.id).closest("form");
		var field_definition = this.args[form.id][e.target.id];

		/***
		do before validate
		check if function or array.
		***/
		if("do_before_validating" in field_definition){
			if($.isFunction(field_definition["do_before_validating"])){
				field_definition["do_before_validating"];
			}
			else{

			}
		}
	}
}