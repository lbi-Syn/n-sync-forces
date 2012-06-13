define([
        'jquery',
        'modules/exampleModule'
	],
	function ($, ExampleModule) {
		"use strict";
		
//		function _examplePrivateFunction() {
//			do something private
//			
//			Usage of Module public classes:
//		
//			ExampleModule.examplePublicFunction();
//		}	
		
		return {
//			examplePublicFunction: function () {
//				do something public
//			},
			
			initialize: function () {	
				var $container = $('#container');
				console.log('TEST THIS');
			}
		};
	}
);