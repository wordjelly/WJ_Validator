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
	var css_framework = css_framework;
	/***
	key -> field_id(without prefixed hash)
	value -> form_id(without prefixed hash)
	***/
	this.field_locs = {};
	
	/***
	a results object that holds the results of validation of all the fields.
	***/
	this.validation_results = {};	

	/****
	defaults for field definitions.
	****/

	this.validation_event_defaults = {
		"focus_change" : false,
		"keypress" :  false
	};

	/*****
	the framework on_success and on_failure functions are passed the same 
	*****/
	var frameworks = {
		"materialize":{
			on_success: function(e){
				console.log("called materialize on success");
			},
			on_failure: function(def,e){
				console.log("called materialize on failure");
			}
		}
	}

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

		if(css_framework !== null && (css_framework in frameworks)){
			frameworks[css_framework]["on_success"](e);
		}
	};

	/***
	default on failure function.
	
	ARGUMENTS:
	---------
	def -> contains the validation defintion and failure messages.
	e -> the event which triggered the validation.
	
	RETURNs:
	-----------
	null.

	***/
	this.on_failure_defaults = function(def,e){
		if(css_framework !== null && (css_framework in frameworks)){
			frameworks[css_framework]["on_failure"](def,e);
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

	var default_formats = {
			email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	}

	/****
	ARGUMENTS FOR ANY VALIDATOR ARE THE SAME
	def -> the validator defintion(should have a key->value(format -> email), and a key-value(failure_message -> message))
	e -> the event which triggered the validation.

	RETURN:
	return true,or false.
	*****/
	
	this.validators = {
		/***
		def -> {format : predefined..eg : email / regex / function, failure_message : "whatever it should be"}
		***/

		format: function(def,e){
			
			//if the format is a predefined string, then ,
			//else if it is a 
			var field_value = get_field_value_and_type(e)["value"];
			//console.log("field value is:" + field_value);
			if(def["format"] in default_formats){
				//its a regex
				//run it against the value of the field.
				return default_formats[def["format"]].test(field_value);
			}
			else if($.isFunction(def["format"])){
				//its a function
				//pass the field value insside.
				return def["format"](field_value);
			}
			else{
				//trying to test something thats not in the default formats, and not a function, so returns invalid.
				return false;
			}

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
	}
	


	/****
	Arguments:
	click_event -> the event that triggered the validation.
	Returns:
	@type: the type of the field "text,radio,checkbox,select"
	@value: the value of the field
	****/
	var get_field_value_and_type = function(e){
		jquery_el = $("#" + e.target.id);
		return {"type":jquery_el.attr('type'), "value" : jquery_el.val()};
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
				

				var field_id = "#" + f;
				/***
				correlate the field id with the form id 
				key -> field id
				value -> form id
				***/	
				_this.field_locs[f] = fo;
				

				/***
				merge the defaults with the incoming field definition.
				use jquery extend.
				***/			
				var field_obj = $.extend(true,{},_this.field_defaults,form_obj[f]);

				//reassign the extended field object.
				_this.args[fo][f] = field_obj;


				if(field_obj["validation_event"]["focus_change"]){
					focus_change_fields.push(field_id);
				}

				if(field_obj["validation_event"]["keypress"]){
					keypress_fields.push(field_id);
				}

			});
		});
		
		this.field_locs = _this.field_locs;
		this.args = _this.args;

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
		//clears the validation results for this field, as the validate with function is being called.
		this.validation_results[e.target.id] = {};
		this.validate_with(field_object,e);
	},
	/****	
	basically calls each validator specified and returns true or false
	finally returns true if all are true, otherwise false.
	****/
	validate_with: function(field_object,e){
		var _this = this;	
		//we need a results object 
		//it is an array, one entry for each thing in the validate_with array. fpr this field.
		//each element contains the validation defintion and an additional key called "result" , which can be true or false.
		//we should have whatever is false
		var complete_field_results = [];
		var failure_field_results = [];
		_.each(field_object["validate_with"],function(def){
			var to_be_validated = true;
			_.each(Object.keys(def),function(v){
				//if the validator function is one of the predefined ones.
				var is_valid = null;
				if(v in _this.validators && to_be_validated){
					is_valid = _this.validators[v](def,e);
					to_be_validated = false;
					complete_field_results.push($.extend(def,{"result" : is_valid, "event" : e}));
					//here only check if it is false,and we dont already have 
					if(!is_valid){
						failure_field_results.push(def["failure_message"]);
					}
				}
				//if the validator is a function, but with a custom name
				else if($.isFunction(def[v]) && to_be_validated){
					//we pass in the def and the click event.
					is_valid = def[v](def,e);
					to_be_validated = false;
					complete_field_results.push($.extend(def,{"result" : is_valid, "event" : e}));
					if(!is_valid){
						failure_field_results.push(def["failure_message"]);
					}
				}
				else{
					//tries to call a non-existent validator.
					//is_valid = false;
				}
			});
		});

		//now this field res object, is to be assigned into the validation results object, with the key as the field id.
		this.validation_results[e.target.id] = complete_field_results;

		//now we have to iterate the array and if we dont hit a false result for it anywhere in the array, then we execute the on_success, otherwise we execute the on_failure 
		
		

	}
	
}