define([
        'jquery',
        'modules/canvas_app.module',
        'modules/audiolet_app.module',
        'knobKnob',
        'knobTransform'
	],
	function ($, canvasApp, audioletApp) {
		"use strict";

		var patternLength = 32;
		var numRows = 3;
		
		return {
			initialize: function () {

				$(document).ready(function() {
					var canvas = $('#sequence'),
						btn_play = $('#button_play'),
						btn_pause = $('#button_pause'),
						btn_stop = $('#button_stop'),
						context = canvas[0].getContext("2d"),
						noteWidth = canvas.width() / patternLength,
						noteHeight = canvas.height() / numRows;

					
					audioletApp.init();
					btn_play.click(function(e) {
						audioletApp.play();

						// canvasApp.initCanvas({
						// 	canvas: canvas,
						// 	context: context,
						// 	noteWidth: noteWidth,
						// 	noteHeight: noteHeight
						// });
					});

					btn_pause.click(function(e) {
						audioletApp.pause();
					});

					btn_stop.click(function(e) {
						audioletApp.stop();
					});

					canvas.click(function(e) {
						// get click coordinates relative to the canvas:
						var xClick = e.pageX - canvas.offset().left;
						var yClick = e.pageY - canvas.offset().top;
						// get matrix indexes:
						xClick = Math.floor(xClick / noteWidth);
						yClick = Math.floor(yClick / noteHeight);
						canvasApp.togglePixel(xClick, yClick);
					});
					
					$('.control').knobKnob({
						snap : 5,
						value: 0,
						turn : function(ratio){
							var exactAmount,
								filterAmount;
				
							exactAmount = ratio * 100;
							filterAmount = Math.round(exactAmount);
							console.log('filterAmount = ', filterAmount);
						}
					});

					canvasApp.drawRuler();
				});
				
			}
		};
	}
);