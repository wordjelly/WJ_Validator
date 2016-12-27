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
	/***
	var preprocess = function(args){
		var related_form_fields = {};
		_.each(Object.keys(args),function(form_id){
			related_form_fields[form_id] = {};
			_.each(Object.keys(args[form_id]),function(field_id){
				var validation_event = args[form_id][field_id]["validation_event"];
				_.each(args[form_id][field_id]["validate_with"],function(validation,index){
					if ("field_array" in validation){
						related_form_fields[form_id][field_id] = {"validate_with" : _(validation).clone(), "validation_event": _(validation_event).clone()};	
					}
				});
			});
		});
		for(form_id in related_form_fields){
			for(parent_field in related_form_fields[form_id]){
				_.each(related_form_fields[form_id][parent_field]["validate_with"]["field_array"],function(f_id){
					var q = related_form_fields[form_id][parent_field];
					q["validate_with"]["field_array"] = _.map(q["validate_with"]["field_array"],function(t){
						if(t == f_id){
							return parent_field;
						}
						else{
							return t;
						}
					});
					if(f_id in args[form_id]){
						args[form_id][f_id]["validate_with"].push(q["validate_with"]);
					}
					else{	
						args[form_id][f_id] = q;
					}
				})
			}
		}
		
		return args;
	}
	**/
	this.args = args;
	this.log = log !== null ? log : true;
	this.logger = {};
	this.css_framework = css_framework;
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



	var resolve_fields = function(def,e){
		
		if("field_array" in def){
			var arr = _(def["field_array"]).clone();
			arr.push(e.target.id);
			
			return arr;
		}
		else{
			
			return [e.target.id];
		}
	}

	/*****
	the framework on_success and on_failure functions are passed the same 
	*****/
	this.frameworks = {
		"materialize":{
			on_success: function(def,e){
				_.each(resolve_fields(def,e),function(name){
					var val = $("#" + name).val();
					var type = $("#" + name).attr("type");
					if(type === "text"){
						var label = $('label[for="'+ name +'"]');
			      		var input = $('#' + name);
			      		input.attr("class","valid");
					}
				});
					
			},
			on_failure: function(def,e){
				_.each(resolve_fields(def,e),function(name){
					var val = $("#" + name).val();
					var type = $("#" + name).attr("type");
					if(type === "text"){
						var failure_message = def["failure_message"];
						var label = $('label[for="'+ name +'"]');
				      	var input = $('#' + name);
				      	input.attr("class","invalid");
						input.attr("aria-invalid",true);
				      	label.attr("data-error",failure_message);
		      		}
		      	})
			},
			on_load: function(){
				$(document).on("focusout",":input",function(e){
					if($(this).hasClass("invalid")){
						var label = $(this).parent().find("label");
						label.attr("data-error","");
					}
				});
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
	this.on_success_defaults = function(def,e){

		if(css_framework !== null && (css_framework in _this.frameworks)){
			_this.frameworks[css_framework]["on_success"](def,e);
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
		if(css_framework !== null && (css_framework in _this.frameworks)){
			_this.frameworks[css_framework]["on_failure"](def,e);
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
		@param[Object] def:
			format => email/regex/function
			failure_message => "whatever you want."
			skip_empty => true/false, defaults to true.
			args => arguments hash to pass to your custom function in case you are using one for the format.
		@return[Deferred Object]
		***/
		format: function(def,e){
			var result = $.Deferred();
			var field_value = get_field_attrs(e)["value"];
			//HANDLE EMPTY FIELD.
			if(!def["skip_empty"] && field_value.length == 0){
				
			}
			else if(field_value.length == 0){
				result.resolve({"is_valid" : true});
			}
			
		
			if(def["format"] in default_formats){
				//its a regex
				//run it against the value of the field.
				result.resolve({"is_valid" : default_formats[def["format"]].test(field_value)});
			}
			else if($.isFunction(def["format"])){
				//its a function
				//pass the field value insside.
				result.resolve({"is_valid" : def["format"](def,e)});
			}
			else{
				//trying to test something thats not in the default formats, and not a function, so returns invalid.
				result.resolve({"is_valid" : false});
			}
			return result;
		},
		/***
		@param[Object]:def 
		"required" => true/function
		"failure_message" => whatever you want.
		"args" => custom arguments hash to pass to your required function if you decide to use it.
		@return[Deferred Object]
		***/
		required: function(def,e){
			var result = $.Deferred();
			var field_value = get_field_attrs(e)["value"];
			if($.isFunction(def["required"])){
				result.resolve({"is_valid" : def["required"](def,e)});
			}
			result.resolve({"is_valid" : field_value.length > 0});
			return result;
		},
		/****
		@param[Object] def:
		"remote" => true/function,
		"ajax_settings" => function, the function accepts the def and the event.
		"args" => custom arguments hash to pass to your "remote" function or to your ajax settings function.
		@return[Promise object] 
		****/
		remote: function(def,e){
			var result = $.Deferred();
			if($.isFunction(def["remote"])){
				return result.resolve({"is_valid" : def["remote"](def,e)});
			}
			var ajax_settings = def["ajax_settings"](def,e);
			return $.ajax(ajax_settings);
		},
		min_length: function(def,e){
			console.log("came to min length validator");
		},
		max_length: function(def,e){
			console.log("came to max length validator");
		},
		/***
		def ->
		-should_be_equal => true/function
		-field_array => [Array], array of field ids whose values should all be equal.
		-args => object of arguments to pass to the custom function,
		e -> 
		-the event.
		***/
		should_be_equal: function(def,e){
			
			var result = $.Deferred();
			
			if($.isFunction(def["remote"])){
				return result.resolve({"is_valid" : def["remote"](def,e)});
			}
			else{
				if("field_array" in def){
					var values_arr = _.map(def["field_array"],function(t){
						return $("#" + t).val();
					});
					values_arr.push($("#" + e.target.id).val());
					return result.resolve({"is_valid" : _.uniq(values_arr).length == 1});
				}
				else{
					return result.resolve({"is_valid" : false});
				}				
			}
		}	
	}
	


	/****
	Arguments:
	click_event -> the event that triggered the validation.
	Returns:
	@type: the type of the field "text,radio,checkbox,select"
	@value: the value of the field
	****/
	var get_field_attrs = function(e){
		jquery_el = $("#" + e.target.id);
		return {"type":jquery_el.attr('type'), "value" : jquery_el.val(), "name" : jquery_el.attr('name')};
	}

	this.register_handlers();

	var _this = this;

}

WJ_Validator.prototype = {
	constructor: WJ_Validator,
	default_failure_message: function(){
		return "This field is invalid";
	},
	validation_could_not_be_done_message: function(){
		return "server error";
	},
	register_handlers: function(){
		var focus_change_fields = [];
		var keypress_fields = [];
		var two_binding_fields = {};
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

				if(field_obj["validation_event"]["keypress"] || _.filter(field_obj["validate_with"],function(r){
					return "should_be_equal" in r;
				}).length > 0){
					keypress_fields.push(field_id);
				}

				if(_.filter(field_obj["validate_with"],function(r){
					return "field_array" in r;
				}).length > 0){
					two_binding_fields[f] = field_obj["validate_with"][0]["field_array"];
				}


			});
		});
		
		this.field_locs = _this.field_locs;
		this.args = _this.args;

		focus_change_fields = focus_change_fields.join(",");
		keypress_fields = keypress_fields.join(",");
		
		console.log("focus change fields");
		console.log(focus_change_fields);

		console.log("keypress fields");
		console.log(keypress_fields);

		if(focus_change_fields != ""){
		$(document).on("focus custom",focus_change_fields,function(e){
			console.log("triggered focus change fields");
			_this.main(e);
		});
		}	

		if(keypress_fields != ""){
		$(document).on("keyup custom",keypress_fields,function(e){
			console.log("triggered kepress fields");
			_this.main(e);
		});
		}

		
		for(ff in two_binding_fields){
			$(document).on("keyup",_.map(two_binding_fields[ff],function(n){return "#" + n;}).join(","),function(e){
				e.preventDefault();
				$("#"+ff).trigger("custom");
			});
		}

		//if the frameworks have any specific things to be done on load, then do it here.
		this.frameworks[this.css_framework]["on_load"]();
		
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
		console.log("triggered main with event");
		console.log(e);
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
					is_valid.done(function(data){
						if(_this.log){
							console.log("validation response");
							console.log(data);
						}
						complete_field_results.push($.extend(true,{},{"result" : data["is_valid"], "event" : e, "failure_message" : _this.default_failure_message()},def));
						if(data["is_valid"]){
							field_object["on_success"](def,e);
						}
						else{
							field_object["on_failure"](_.last(complete_field_results),e);
						}
					});
					is_valid.fail(function(d){
						complete_field_results.push($.extend(true,{},{"result" : false, "event" : e, "failure_message" : _this.default_failure_message()},def,{"failure_message" : _this.validation_could_not_be_done_message}));
						field_object["on_failure"](_.last(complete_field_results),e);
					});
				}
				
			});
		});

	}
	
}