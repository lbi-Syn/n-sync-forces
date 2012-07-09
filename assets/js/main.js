/*global require*/
(function() {
	"use strict";
	
	var libsPath = '../../libs/js/'; //libsPath relative to 'basePath'
	
	require.config({
		paths : {
			jquery : libsPath + 'jquery-1.7.2.min',
			audiolet : libsPath + 'audiolet.min',
			audiofile : libsPath + 'audiofile'
		},
		baseUrl : 'assets/js'
	});
	
	require([
			'application'
		],
		function(App) {
			App.initialize();
		}
	);
}());