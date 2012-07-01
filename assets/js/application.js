define([
        'jquery',
        'modules/loader.module'
	],
	function ($, LoaderModule) {
		"use strict";
		
		return {
			initialize: function () {	

//				var loader1 = new LoaderModule();
//				loader1.onaudioloaded(function (audio) {					
//					audio.play();
//				});
//				
//				loader1.handleFile('/assets/audoi/mp3.mp3');

				var loader2 = new LoaderModule();
				loader2.onaudioloaded(function (audio) {					
					audio.play();
				});
				
				var fileInput = document.getElementById('fileInput');
				fileInput.addEventListener("change", loader2.handleFile, false);
				
			}
		};
	}
);