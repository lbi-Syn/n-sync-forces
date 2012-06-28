define([
        'jquery'
	],
	function ($) {
		"use strict";

		return (function () {	
			var audio = null,
				onaudioloadedCallback = null;
		
			function _readFile (file, _callback) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					if (e.target.readyState == FileReader.DONE) {
						_callback(e);
					}
				}
				reader.readAsDataURL(file);
			}
		
			function _setAudio (dataUrl) {
				audio = document.createElement('audio');
				audio.src = dataUrl;
				
				onaudioloadedCallback(audio);
			}
		
			function _loadAudio (file) {
				_readFile(file, function (e) {
					_setAudio(e.target.result);
				});
			}
		
			this.onaudioloaded = function (_callback) {
				onaudioloadedCallback = _callback;
			}
		
			this.handleFiles = function () {
				_loadAudio(this.files[0]);
			} 
		
		});
	}
);