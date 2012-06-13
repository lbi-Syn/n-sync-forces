(function() {
	"use strict";
	
	var libsPath = '../../libs/js/'; //libsPath relative to 'basePath'
	
	require.config({
		paths : {
			jquery : libsPath + 'jquery-1.7.2.min'
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