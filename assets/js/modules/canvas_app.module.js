define([
        'jquery'
	],
	function ($) {
		"use strict";
		
		// structural variables:
		var numRows = 3;
		var rows = new Array(numRows);

		var patternLength = 32;
		var activeColumn = 0;

		// design variables:
		var canvas = null;
		var context = null;
		var channels = null;

		var noteWidth = null;
		var noteHeight = null;

		var noteSoftColor = '#ffffff';
		var noteMedColor = '#49A2D0';
		var noteLoudColor = '#DBF0FB';

		function _initCanvas(options) {
			if (options !== undefined) {
				canvas = options.canvas;
				context = options.context;
				noteWidth = options.noteWidth;
				noteHeight = options.noteHeight;
			}

			context.clearRect(0, 0, canvas.width(), canvas.height());

			rows[0] = options.channels[0].pattern.list;
			rows[1] = options.channels[1].pattern.list;
			rows[2] = options.channels[2].pattern.list;

			patternLength = rows[0].length;

			_draw();
		}

		function _draw() {
			// move horizontally (time wise)
			for (var i = 0; i < patternLength; i++) {
				// move vertically (rows)
				for (var j = 0; j < numRows; j++) {
					if (rows[j][i] == 0) {
						context.fillStyle = noteSoftColor;
					} else if (rows[j][i] == 1) {
						context.fillStyle = noteMedColor;
					} else if (rows[j][i] == 2) {
						context.fillStyle = noteLoudColor;
					}

					context.fillRect(i * noteWidth, j * noteHeight, noteWidth-1, noteHeight-1);
				/*
				context.beginPath()
				var x = i * noteWidth + (noteWidth/2);
				var y = j * noteHeight + (noteHeight/2);
				context.arc(x, y, noteWidth/2, 0, Math.PI*2)
				context.fill()*/

				}
			}
		}

		function _animate() {
			context.clearRect(0, 0, canvas.width(), canvas.height());
			_draw();
			context.fillRect(activeColumn * noteWidth, 0, 1, noteHeight * numRows);
			activeColumn = (activeColumn + 1) % patternLength;
		}

		function _togglePixel(xClick, yClick) {
			// toggle amplitude and update graphics array (rows)
			var amplitude = (rows[yClick][xClick] + 1) % 3;
			rows[yClick][xClick] = amplitude;

			// update audiolet sequence
		}

		function _stop() {
			activeColumn = 0;
			context.clearRect(0, 0, canvas.width(), canvas.height());
			_draw();
			context.fillRect(activeColumn * noteWidth, 0, 1, noteHeight * numRows);
		}

		return {
			initCanvas: _initCanvas,
			stop: _stop,
			draw: _draw,
			animate: _animate,
			togglePixel: _togglePixel
		};
	}
);