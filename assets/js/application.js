

function Control(options,value, audioletApp){
	return {
		init: function(){
		
			this.render();
			return this;
		
		},
		render: function(){
			
			this.el = $('<section/>').html($('#controlsTemplate').html()).addClass('bar-controller');
			
			var self = this;
			
			this.el.find('.controller-lb span').text(options);
			this.el.find('.freq progress').attr('value',value);  //This isnt finished yet...
			
			//alert(options);
			this.el.find('.control').knobKnob({
				snap : 1,
				value: 0,
				turn : function(ratio){
					var exactAmount,
						filterAmount,
						filters = {};

					exactAmount = ratio * 100;
					filterAmount = Math.round(exactAmount);

					switch (options){
						case 'Sine' :
							filters.sine = filterAmount;
						break;
						case 'Low Pass' :
							filters.lowPass = (filterAmount * 10);
						break;
						case 'Gain' :
							filters.gain = (ratio * 100);
						break;	
						case 'Pan' :
							filters.pan = (filterAmount / 100);
						break;
						case 'Tempo' :
							filters.tempo = filterAmount;
						break;
					}
					audioletApp.init(filters);
					self.el.find('.freq progress').attr('value',ratio);
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
					
					var control = new Control('Tempo',0.4, audioletApp);
						
					$('#container > #bars').append(control.init().el);
					controls.push(control);
					
					control = new Control('Pan',0.3, audioletApp);
					
					$('#container > #bars').append(control.init().el);
					controls.push(control);
					
					control = new Control('Gain',0.4, audioletApp);
					
					$('#container > #bars').append(control.init().el);
					controls.push(control);
					
					control = new Control('Low Pass',0.8, audioletApp);
					$('#container > #bars').append(control.init().el);
					controls.push(control);
					
					control = new Control('Sine',0.2, audioletApp);
					$('#container > #bars').append(control.init().el);
					controls.push(control);

				});
				
			}
		};
	}
);