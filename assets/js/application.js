define([
        'jquery',
        'modules/canvas_app.module'
	],
	function ($, canvasApp) {
		"use strict";
		
		return {
			initialize: function () {	

				$(document).ready(function() {
					canvas = $('#sequence');
					context = canvas[0].getContext("2d");
					noteWidth = canvas.width() / patternLength;
					noteHeight = canvas.height() / numRows;

					canvasApp.init({
						canvas: canvas,
						context: context,
						noteWidth: noteWidth,
						noteHeight: noteHeight
					});

					canvas.click(function(e) {
						// get click coordinates relative to the canvas:
						var xClick = e.pageX - canvas.offset().left;
						var yClick = e.pageY - canvas.offset().top;
						// get matrix indexes:
						xClick = Math.floor(xClick / noteWidth);
						yClick = Math.floor(yClick / noteHeight);
						togglePixel(xClick, yClick);
					});

					canvasApp.drawRuler();
				});
				
			}
		};
	}
);