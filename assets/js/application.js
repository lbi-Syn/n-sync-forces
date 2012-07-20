function Control(options){
	return {
		init: function(){
		
			this.render();
			return this;
		
		},
		render: function(){
			
			this.el = $('<section/>').html($('#controlsTemplate').html()).addClass('bar-controller');
			
			var self = this;
			
			this.el.find('.control').knobKnob({
				snap : 5,
				value: 0,
				turn : function(ratio){
					var exactAmount,
						filterAmount;
		
					if(options.onTurn){
						options.onTurn(ratio);
					}
		
					exactAmount = ratio * 100;
					filterAmount = Math.round(exactAmount);
					console.log('filterAmount = ', filterAmount);
					
					self.el.find('.volume progress').attr('value',ratio);
				}
			});
		}
	};
}

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
						
						var controls = [];
						
						var control = new Control({
							onTurn: function(vol){
							}
						});
						$('#container > section').append(control.init().el);
						controls.push(control);
						
						
						control = new Control({
							onTurn: function(vol){
							}
						});
						$('#container > section').append(control.init().el);
						controls.push(control);
						
						
					
					var channels = audioletApp.init();
					canvasApp.initCanvas({
						canvas: canvas,
						context: context,
						noteWidth: noteWidth,
						noteHeight: noteHeight,
						channels: channels
					});

					btn_play.click(function(e) {
						audioletApp.play(canvasApp);
					});

					btn_pause.click(function(e) {
						audioletApp.pause(canvasApp);
					});

					btn_stop.click(function(e) {
						audioletApp.stop(canvasApp);
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
					

				});
				
			}
		};
	}
);