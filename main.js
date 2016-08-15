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
				var field_val_and_type = get_field_value_and_type(e);
				var val = field_val_and_type["value"];
				var type = field_val_and_type["type"];
				if(type === "text"){
					var label = $('label[for="'+ e.target.id +'"]');
		      		var input = $('#' + e.target.id);
		      		input.attr("class","valid");
				}	
			},
			on_failure: function(def,e){
				var field_val_and_type = get_field_value_and_type(e);
				var val = field_val_and_type["value"];
				var type = field_val_and_type["type"];
				if(type === "text"){
					var failure_message = "";
					_.each(def,function(t){
						if(!t["result"]){
							failure_message = t['failure_message'];
						}
					});
					var label = $('label[for="'+ e.target.id +'"]');
			      	var input = $('#' + e.target.id);
			      	input.attr("class","invalid");
					input.attr("aria-invalid",true);
			      	label.attr("data-error",failure_message);
		      	}
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
	def[Array] -> contains the validation defintion and failure messages, for each validator for the field.(includes failed and successfull validation results.)
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
		def -> {format : predefined..eg : email / regex / function, failure_message : "whatever it should be", skip_empty: true/false - default is true}
		***/
		format: function(def,e){
			var field_value = get_field_value_and_type(e)["value"];
			//HANDLE EMPTY FIELD.
			if(!def["skip_empty"] && field_value.length == 0){
				
			}
			else if(field_value.length == 0){
				return true;
			}
			
		
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
	default_failure_message: function(){
		return "This field is invalid";
	},
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

		$(document).on("keyup",keypress_fields,function(e){
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
		/***
		holds the results of running each validator specified for the field.
		***/
		var complete_field_results = [];
		/***
		holds the message that is to be shown when a validation has failed, one entry for whichever validators have failed.
		***/
		var failure_field_results = [];
		_.each(field_object["validate_with"],function(def){
			var to_be_validated = true;
			_.each(Object.keys(def),function(v){
				//if the validator function is one of the predefined ones.
				var is_valid = null;
				if(v in _this.validators && to_be_validated){
					is_valid = _this.validators[v](def,e);
				}
				//if the validator is a function, but with a custom name
				else if($.isFunction(def[v]) && to_be_validated){
					//we pass in the def and the click event.
					is_valid = def[v](def,e);	
				}
				if(is_valid!== null){
					to_be_validated = false;
					complete_field_results.push($.extend(true,{},{"result" : is_valid, "event" : e, "failure_message" : _this.default_failure_message()},def));
					//here only check if it is false,and we dont already have 
					if(!is_valid){
						
						failure_field_results.push(_.last(complete_field_results)["failure_message"]);
					}
				}
				
			});
		});

		//now this field res object, is to be assigned into the validation results object, with the key as the field id.
		this.validation_results[e.target.id] = complete_field_results;

		if(_.isEmpty(failure_field_results)){
			field_object["on_success"](e);
		}
		else{
			field_object["on_failure"](this.validation_results[e.target.id],e);
		}
		

	}
	
}