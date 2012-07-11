$(function(){
	$('#control').knobKnob({
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
	
});
