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
function WJ_Validator(args,css_framework){
	this.args = args;
	this.css_framework = css_framework;
	/***
	key -> field_id(with prefixed hash)
	value -> form_id(without prefixed hash)
	***/
	this.field_locs = {};
	

	/****
	defaults for field definitions.
	****/
	this.validation_event_defaults = {
		"focus_change" : false,
		"keypress" :  false
	};

	this.validate_with_defaults = {

	};

	this.on_success_defaults = function(){

	};

	/***
	this function is called when a validation fails.
	***/
	this.on_failure_defaults = function(validator_name,validator_arg){

	};

	this.do_before_validating_defaults = {
		
	};

	this.do_after_validating_defaults = {

	};

	this.field_defaults = {
		"validation_event" : this.validation_event_defaults,
		"validate_with" : this.validate_with_defaults,
		"on_success": this.on_success_defaults,
		"on_failure": this.on_failure_defaults,
		"do_before_validating" : this.do_before_validating_defaults,
		"do_after_validating" : this.do_after_validating_defaults
	};



	/***
	defaults end
	***/

}

WJ_Validator.prototype = {
	constructor: WJ_Validator,
	register_handlers: function(){
		var focus_change_fields = [];
		var keypress_fields = [];
		var _this = this;
		_.each(Object.keys(_this.args),function(fo){
			
			/***
			the form hash.
			***/
			var form_obj = _this.args[fo];

			_.each(Object.keys(_this.args[fo]),function(f){
				
				/***
				the id of the field.
				***/	
				var field_id = "#" + f;
				this.field_locs[field_id] = fo;
				/***
				merge the defaults with the incoming field definition.
				use jquery extend.
				***/
			
				var field_obj = $.extend(true,{},_this.field_defaults,form_obj[f]);

				if(field_obj["validation_event"]["focus_change"]){
					focus_change_fields.push(field_id);
				}

				if(field_obj["validation_event"]["keypress"]){
					keypress_fields.push(field_id);
				}

			});
		});

		focus_change_fields = focus_change_fields.join(",");
		keypress_fields = keypress_fields.join(",");

		$(document).on("focus",focus_change_fields,function(e){
			this.main(e);
		});

		$(document).on("keydown",keypress_fields,function(e){
			this.main(e);
		});
	},
	/****
	given the field_id get its definition from the form definition.
	****/
	get_field_object: function(field_id){
		return this.args[this.field_locs[field_id]][field_id];
	}
	/***
	passes in click event.
	***/
	main: function(e){
		var field_object = this.get_field_object(e.target.id);
		var _this = this;
		validate_with(field_object["validate_with"]);

	},
	/****	
	basically calls each validator specified and returns true or false
	finally returns true if all are true, otherwise false.
	****/
	validate_with: function(validate_with){
		_.each(Object.keys(validate_with),function(def){

		});
	},
	format: function(regex_or_predefined_format){

	},
	required: function(bool){

	},
	remote: function(remote_url){

	}

}