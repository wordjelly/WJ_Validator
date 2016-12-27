# WJ_Validator
JQuery based form validation plugin. Easy to use and extend.

## Why Another Validator Plugin?
There are several JQuery Validator plugins available online. Here are some things WJ-Validator offers out of the box:
  1. __Framework-specific__ : Inbuilt support for: 
     * Twitter Bootstrap
     * MaterializeCss
     * PureCss
  
  Validation messages and warnings are shown in a way that fits with the framework.

  2. __Define your own validation functions__: More often that not, you want to validate form fields based on your own rules. 
Other plugins offer ways to customize validation, but WJ-Validator lets you pass in any function(), and uses the value you
return from the function to decide whether the field is valid or not.

  3. __Remote Validation and Ajax__: Remote validation methods can be a pain. WJ-Validator allows you to specify all the ajax
settings you want.

  4. __In-Built Validators__: WJ-Validator ships with several in-built validators like:
  
     * Format
     * Required
     * Remote
     * Min-length
     * Max-length
     * Should equal
     * Confirmable
     
   Each validator can be overriden entirely with your own custom functions, and you can also modify existing validators.
   
  5.  __Before and After Validation hooks__: WJ-Validator allows you to specifiy functions that can be executed
     *before* or *after* validation.
 
  6. __Easy for Beginners__: WJ-Validator works out of the box, with very little configuration.
    Its as simple as requiring one JS file.
    
  7. __Common Dependencies__: WJ-Validator requires underscore.js and Jquery. Most web-projects already use these libraries.
    In case you think this increases overhead, most users on the net already have these libraries in their browser caches,
    and most CDN's feature these libraries anyways.
    
## Installation

Just copy __main.min.js__ into your project. Make sure that you have __jquery.js__ and __underscore.js__ both available in your project.

Alternatively you can clone this repo, and then run bower install from the project root, that will take care of dependencies.

## How to Use

```
$(document).on("ready",function(){

var validation_settings = {
  "my_form_id" : {
    "my_field_id" : {
      "validation_event":{
        "focus_change" : true,
        "keypress" : true
      },
      "validate_with":[
        {"required" : "true"}
      ]
    }
  }
}

// Initialize the validator
var validator = new WJ_Validator(validation_settings,"Materialize",true);
}
```

That's all you need to get this working!

The rest of this page describes how to set up other inbuilt validators, your own custom validation functions, before and after hooks etc.
