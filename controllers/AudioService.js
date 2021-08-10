'use strict';

angular
		.module('webappApp')
		.service(
				'layoutv2service',
				function($rootScope, $http, $q, $location,$log) {
					
					// AngularJS will instantiate a singleton by calling "new"
					// on this function
					return {
						mastervolumeupdate : function(volume) {
							var str = '/audio/master/volume/update?volume='
								+ volume;
							var request = $http.get(str);
							return request;
						},
						mastermute : function(mute) {
							var str = '/audio/master/mute?mute='
								+ mute;
							var request = $http.get(str);
							return request;
						},
						getconfig : function() {
							var str = '/audio/config';
							var request = $http.get(str);
							return request;
						},
						applicationvolumeupdate : function(application,volume) {
							var str = '/audio/source/volume/update?application='
								+ application+'&volume='+volume;
							var request = $http.get(str);
							return request;
						},
						applicationmute : function(application,mute) {
							var str = '/audio/source/mute?application='
								+ application+'&mute='+mute;
							var request = $http.get(str);
							return request;
						}
						
						
					};

				});
