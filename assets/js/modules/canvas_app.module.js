define([
        'jquery'
	],
	function ($) {
		"use strict";
		
		// structural variables:
		var numRows = 3;
		var rows = new Array(numRows);
		// keep a list of sample names:
		var sample = {"bass_drum":0, "hi_hat":1, "snare_drum":2};

		var patternLength = 32;
		var activeColumn = 0;

		// design variables:
		var canvas = null;
		var context = null;

		var noteWidth = 10;
		var noteHeight = 10;

		var noteSoftColor = '#222222';
		var noteMedColor = '#359aff';
		var noteLoudColor = '#48ffff';


		return {

		};
	}
);