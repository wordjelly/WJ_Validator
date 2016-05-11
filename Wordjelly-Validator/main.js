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
function WJ_Validator(args,css_framework,log){
	this.args = args;
	this.log = log !== null ? log : true;
	this.logger = {};
	this.css_framework = css_framework;
	/***
	key -> field_id(without prefixed hash)
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

	/****
	default on success function.
	this function is called only when all the validators for a given field have passed.

	ARGUMENTS:
	---------
	e -> the event which triggered the validation
	
	RETURNS:
	--------
	null

	****/
	this.on_success_defaults = function(e){
		if(this.css_framework !== null && (this.css_framework in this.frameworks)){
			this.frameworks[this.css_framework]["on_success"](e);
		}
	};

	/***
	default on failure function.
	
	ARGUMENTS:
	---------
	validator_name -> eg: format,required,remote_url,any validator name.
	validator_arg -> the argument that was passed to the validator.
	e -> the event which triggered the validation.
	failure_message -> the message defined in the form definition or the default message for the field type if none has been defined.
	
	RETURNs:
	-----------
	null.

	***/
	this.on_failure_defaults = function(validator_name,validator_arg,e,failure_message){
		if(this.css_framework !== null && (this.css_framework in this.frameworks)){
			this.frameworks[this.css_framework]["on_failure"](validator_name,validator_arg,e,failure_message);
		}
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

	/****
	ARGUMENTS FOR ANY VALIDATOR ARE THE SAME
	def -> the validator defintion(should have a key->value(format -> email), and a key-value(failure_message -> message))
	e -> the event which triggered the validation.

	RETURN:
	return on_success , or on_failure function.

	If you want to define a new validator here, then make sure it returns on success or on failure functions.
	If instead you want to define a validation function in your js file, then it should simply return true/false.
	*****/
	this.validators = {
		format: function(def,e){
			console.log("came to format validator");
			//if the format is a predefined string, then ,
			//else if it is a 
		},
		required: function(def,e){
			console.log("came to required validator");
		},
		remote: function(def,e){
			console.log("came to remote validator");
		},
		min_length: function(def,e){
			console.log("came to min length validator");
		},
		max_length: function(def,e){
			console.log("came to max length validator");
		},
		should_equal: function(def,e){
			console.log("came to should equal validator");
		}	
	},
	/*****
	the framework on_success and on_failure functions are passed the same 
	*****/
	this.frameworks = {
		"materialize":{
			on_success: function(e){

			},
			on_failure: function(validator_name,validator_arg,e,failure_message){

			}
		}
	}


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
				_this.field_locs[f] = fo;
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
		
		this.field_locs = _this.field_locs;



		focus_change_fields = focus_change_fields.join(",");
		keypress_fields = keypress_fields.join(",");

		$(document).on("focus",focus_change_fields,function(e){
			_this.main(e);
		});

		$(document).on("keydown",keypress_fields,function(e){
			_this.main(e);
		});
	},
	/****
	given the field_id get its definition from the form definition.
	****/
	get_field_object: function(field_id){
		return this.args[this.field_locs[field_id]][field_id];
	},
	/***
	passes in click event.
	***/
	main: function(e){
		var field_object = this.get_field_object(e.target.id);
		var _this = this;
		this.validate_with(field_object["validate_with"],e);

	},
	/****	
	basically calls each validator specified and returns true or false
	finally returns true if all are true, otherwise false.
	****/
	validate_with: function(validate_with,e){
		var _this = this;
		_.each(validate_with,function(def){
			_.each(Object.keys(def),function(v){
				//if the validator function is one of the predefined ones.
				if(v in _this.validators){
					_this.validators[v](def,e);
				}
				//if the validator is a function, but with a custom name
				else if($.isFunction(def[v])){
					//we pass in the def and the click event.
					def[v](def,e);
				}
				else{
					//do nothing.
					
				}
			});
		});
	}
	

}