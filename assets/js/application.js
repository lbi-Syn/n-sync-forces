define([
        'jquery',
        'modules/loader.module'
	],
	function ($, LoaderModule) {
		"use strict";
		
		return {
			initialize: function () {	

				LoaderModule.onaudioloaded(function (audio) {					
//					audio.play();
				});
				
				var fileInput = document.getElementById('fileInput');
				fileInput.addEventListener("change", LoaderModule.handleFiles, false);
				
			}
		};
	}
);