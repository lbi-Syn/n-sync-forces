define([],
	function () {
		"use strict";

		window.AudioContext = window.AudioContext || window.webkitAudioContext;

		return (function () {
			var context = new window.AudioContext(),
				audio = null,
				onaudioloadedCallback = null;
		
			function _readFile (file, _callback) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					if (e.target.readyState == FileReader.DONE) {
						_callback(e);
					}
				};
				reader.readAsDataURL(file);
			}

			function _setAudio (dataUrl) {
				audio = document.createElement('audio');
				audio.src = dataUrl;
				
				onaudioloadedCallback(audio);
			}
			
			function _onError (e) {
				window.console.log('ERROR: ' + e);
			}
		
			//TODO: implement this into interface to parse buffer instead of audio object.
			//NOTE: THIS IS UNTESTED
			function _loadFile(file, _callback) {
				var request = new XMLHttpRequest();
                request.open('GET', file, true);
                request.responseType = 'arraybuffer';

				// Decode asynchronously
				request.onload = function() {
					context.decodeAudioData(request.response, function(buffer) {
						_callback(buffer);
					}, _onError);
				};
				request.send();
			}

			function _loadAudio (file) {
				_readFile(file, function (e) {
					_setAudio(e.target.result);
				});
			}
		
			this.onaudioloaded = function (_callback) {
				onaudioloadedCallback = _callback;
			};
		
			this.handleFile = function (url) {
				if (url !== undefined) {
					_setAudio(url);
				} else if (this.files !== undefined) {
					_loadAudio(this.files[0]);
				}
			};
		});
	}
);