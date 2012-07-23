/*global: setTimeout, Audiolet, AudioletBuffer, BufferPlayer, TriggerControl, Gain, Pan, PSequence*/
define([
        'jquery',
        'audiofile',
        'audiolet'
	],
	function ($, AudioletFileLib, AudioletLib) {
		//"use strict";
		
		// var bufferSize = 65536;
		// var sampleRate = 44100;

		var bufferSize = 10000;
		var sampleRate = 10000;

		// calculate the latency so it can be later used to synchronize the audio
		// with the graphics.
		var latency = 1000 * bufferSize / sampleRate;
		var audioletReady = false;
		var animateTimeout = null;

		var audiolet = null,
			channels = [
				{
					buffer: null,
					player: null,
					trigger: null,
					gain: null,
					pan: null,
					duration: null,
					pattern: null,
					scheduler: null
				},
				{
					buffer: null,
					player: null,
					trigger: null,
					gain: null,
					pan: null,
					duration: null,
					pattern: null,
					scheduler: null
				},
				{
					buffer: null,
					player: null,
					trigger: null,
					gain: null,
					pan: null,
					duration: null,
					pattern: null,
					scheduler: null
				}
			];

		function _init (object) {
			var tempoValue, panValue, gainValue;

			if (typeof object !== 'undefined'){
				if(typeof object.tempo !== 'undefined'){
					tempoValue = object.tempo;
				}
				if(typeof object.gain !== 'undefined'){
					gainValue = object.gain;
				}
				if(typeof object.pan !== 'undefined'){
					panValue = object.pan;
				}
			}

			if(typeof tempoValue === 'undefined' ){
				tempoValue = 100;
			}if(typeof gainValue === 'undefined' ){
			 	gainValue = 1.80; 
			}if(typeof panValue === 'undefined' ){
			 	panValue = 0.65;
			}
			audiolet = new Audiolet(sampleRate, 2, bufferSize);
			audiolet.scheduler.setTempo(tempoValue);

			// Create empty buffers for the bass drum, hi hat and snare drum
			channels[0].buffer = new AudioletBuffer(1, 0);
			channels[1].buffer = new AudioletBuffer(1, 0);
			channels[2].buffer = new AudioletBuffer(1, 0);
			// Load wav files using synchronous XHR
			channels[0].buffer.load('assets/audio/bd_stereo.wav', false);
			channels[1].buffer.load('assets/audio/hh_stereo.wav', false);
			channels[2].buffer.load('assets/audio/sn_stereo.wav', false);

			// Create buffer players
			channels[0].player = new BufferPlayer(audiolet, channels[0].buffer, 1, 0, 0);
			channels[1].player = new BufferPlayer(audiolet, channels[1].buffer, 1, 0, 0);
			channels[2].player = new BufferPlayer(audiolet, channels[2].buffer, 1, 0, 0);

			// Create trigger to re-trigger the playback of samples
			channels[0].trigger = new TriggerControl(audiolet);
			channels[1].trigger = new TriggerControl(audiolet);
			channels[2].trigger = new TriggerControl(audiolet);

			// Create gain objects to control the individual gain of samples
			channels[0].gain = new Gain(audiolet, gainValue);
			channels[1].gain = new Gain(audiolet, gainValue);
			channels[2].gain = new Gain(audiolet, gainValue);
			
			// Create pan objects to control the individual gain of samples
			channels[0].pan = new Pan(audiolet, panValue);
			channels[1].pan = new Pan(audiolet, panValue);
			channels[2].pan = new Pan(audiolet, panValue);

			// Create low pass filter objects to control the individual low pass filter of samples
			channels[0].lowPassFilter = new LowPassFilter(audiolet, 400);
			channels[1].lowPassFilter = new LowPassFilter(audiolet, 400);
			channels[2].lowPassFilter = new LowPassFilter(audiolet, 400);

			// Create sine objects to control the individual sine of samples
			channels[0].sine = new Sine(audiolet, 1);
			channels[1].sine = new Sine(audiolet, 1);
			channels[2].sine = new Sine(audiolet, 1);

			// Create default patterns:
			//
			// Each durations object specifies the duration of one note.
			// 0.25 is equal to a sixtenth note (or if you prefer "semiquaver")
			//
			// The pattern objects specifies the amplitude of each sample:
			// 0 -> mute
			// 1 -> medium
			// 2 -> loud
			channels[0].duration = new PSequence([0.25], Infinity);
			channels[0].pattern = new PSequence([1, 0, 1, 1,   0, 1, 0, 2,
											2, 0, 1, 0,   0, 1, 0, 0,
											1, 0, 1, 1,   0, 1, 0, 2,
											2, 0, 1, 0,   1, 0, 2, 0], Infinity);

			channels[1].duration = new PSequence([0.25], Infinity);
			channels[1].pattern = new PSequence([1, 0, 0, 0,   2, 0, 0, 0,
											1, 0, 0, 0,   2, 0, 0, 0,
											1, 0, 0, 0,   2, 0, 0, 0,
											1, 0, 0, 0,   2, 0, 0, 0], Infinity);

			channels[2].duration = new PSequence([0.25], Infinity);
			channels[2].pattern = new PSequence([0, 0, 0, 0,   1, 0, 0, 0,
											0, 0, 0, 0,   2, 0, 0, 0,
											0, 0, 0, 0,   1, 0, 0, 0,
											0, 1, 0, 0,   2, 0, 0, 1], Infinity);
			
			

			return channels;
		}

		function _play(canvasApp) {
			// Connect it all up
			//
			// output of trigger to input of player
			channels[0].trigger.connect(channels[0].player, 0, 1);
			channels[1].trigger.connect(channels[1].player, 0, 1);
			channels[2].trigger.connect(channels[2].player, 0, 1);
			// output of player to input of gain
			channels[0].player.connect(channels[0].gain);
			channels[1].player.connect(channels[1].gain);
			channels[2].player.connect(channels[2].gain);

			// output of gain to input of pan
			channels[0].gain.connect(channels[0].pan);
			channels[1].gain.connect(channels[1].pan);
			channels[2].gain.connect(channels[2].pan);
			// output of pan to general output
			// all three signals will be added together when connected to the output
			channels[0].pan.connect(audiolet.output);
			channels[1].pan.connect(audiolet.output);
			channels[2].pan.connect(audiolet.output);

			// // output of lowPassFilter to general output
			// channels[0].lowPassFilter.connect(audiolet.output);
			// channels[1].lowPassFilter.connect(audiolet.output);
			// channels[2].lowPassFilter.connect(audiolet.output);

			// // output of sine to general output
			// channels[0].sine.connect(audiolet.output);
			// channels[1].sine.connect(audiolet.output);
			// channels[2].sine.connect(audiolet.output);

			
			// The scheduler will play the notes in bdPattern (amplitude)
			// every bdDurations (time)
			channels[0].scheduler = audiolet.scheduler.play([channels[0].pattern], channels[0].duration,
				function(pattern, duration) {

					// apply amplitude
					if (pattern == 2) {
						channels[0].gain.gain.setValue(1.00);
					} else if (pattern == 1) {
						channels[0].gain.gain.setValue(0.70);
					} else {
						channels[0].gain.gain.setValue(0.00);
					}

					// draw animation of drum machine.
					// to make up for latency, the animate function will be called
					// after latency milliseconds.
					if (canvasApp !== undefined) {
						animateTimeout = setTimeout(canvasApp.animate, latency);
					}
					// re-trigger the sample
					channels[0].trigger.trigger.setValue(1);
				}
			);

			channels[1].scheduler = audiolet.scheduler.play([channels[1].pattern], channels[1].duration,
				function(pattern) {

					// apply amplitude
					if (pattern == 2) {
						channels[1].gain.gain.setValue(1.00);
					} else if (pattern == 1) {
						channels[1].gain.gain.setValue(0.70);
					} else {
						channels[1].gain.gain.setValue(0.00);
					}
					// re-trigger the sample
					channels[1].trigger.trigger.setValue(1);
				}
			);

			channels[2].scheduler = audiolet.scheduler.play([channels[2].pattern], channels[2].duration,
				function(pattern) {
					// apply amplitude
					if (pattern == 2) {
						channels[2].gain.gain.setValue(1.00);
					} else if (pattern == 1) {
						channels[2].gain.gain.setValue(0.70);
					} else {
						channels[2].gain.gain.setValue(0.00);
					}
					// re-trigger the sample
					channels[2].trigger.trigger.setValue(1);
				}
			);
		}

		function _pause() {

			audiolet.scheduler.stop(channels[0].scheduler);
			audiolet.scheduler.stop(channels[1].scheduler);
			audiolet.scheduler.stop(channels[2].scheduler);

			channels[0].pan.disconnect(audiolet.output);
			channels[1].pan.disconnect(audiolet.output);
			channels[2].pan.disconnect(audiolet.output);

			channels[0].gain.disconnect(channels[0].pan);
			channels[1].gain.disconnect(channels[1].pan);
			channels[2].gain.disconnect(channels[2].pan);

			channels[0].player.disconnect(channels[0].gain);
			channels[1].player.disconnect(channels[1].gain);
			channels[2].player.disconnect(channels[2].gain);
			
			channels[0].trigger.disconnect(channels[0].player, 0, 1);
			channels[1].trigger.disconnect(channels[1].player, 0, 1);
			channels[2].trigger.disconnect(channels[2].player, 0, 1);

			clearTimeout(animateTimeout);
		}

		function _stop(canvasApp) {
			_pause();
			_init();
			setTimeout(canvasApp.stop, 1000);
		}

		return {
			init: _init,
			play: _play,
			pause: _pause,
			stop: _stop
		};
	}
);