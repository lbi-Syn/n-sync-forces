define([
        'jquery',
        'modules/loader.module'
	],
	function ($, LoaderModule) {
		"use strict";
		
		return {
			initialize: function () {	

				var loader1 = new LoaderModule();
				loader1.onaudioloaded(function (audio) {					
					audio.play();
				});
				
				var fileInput1 = document.getElementById('fileInput1');
				fileInput1.addEventListener("change", loader1.handleFiles, false);
				
				var loader2 = new LoaderModule();
				loader2.onaudioloaded(function (audio) {					
					audio.play();
				});
				
				var fileInput2 = document.getElementById('fileInput2');
				fileInput2.addEventListener("change", loader2.handleFiles, false);
				
			}
		};
	}
);