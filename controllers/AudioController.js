'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */

angular.module('webappApp').controller(
		'Layoutv2Controller',
		function($rootScope,$scope, $location,$window,$http,$interval, layoutv2service) {
			//$scope.token = '';
			//$rootScope.token = '';
			
			$scope.loadAudios = function() {
				console.log("Get sources ");
				layoutv2service.getconfig().success(function(data) {
					$scope.displays = JSON.parse(JSON.stringify(data));
				}).error(function(data) {
					console.log("error in getting displays");
				});
				
			}
			
			$scope.masterVolumeChange = function (id, model) {
				console.log("Change master volume "+model);
				 layoutv2service.mastervolumeupdate(model).success(function() {
					 console.log("Changed master volume "+model);
				 }).error(function(data) {
					 console.log("Error in changing master volume "+model);
					});
			};
			
			 $scope.setMasterMute = function(obj)
			    {
				 	obj.ismastermute = !obj.ismastermute;
				 	layoutv2service.mastermute(obj.ismastermute).success(function() {
						 console.log("Changed master mute "+obj.ismastermute);
					 }).error(function(data) {
						 console.log("Error in changing master mute "+obj.ismastermute);
						});
			    };
			
		    $scope.isProcessingSlideChange = false;    
			$scope.slideChange = function (id, model) {
				console.log("Process change source volume is "+$scope.isProcessingSlideChange);
				if(!$scope.isProcessingSlideChange){
					$scope.isProcessingSlideChange = true;
					 console.log("Change source "+id + " to volume "+model);
					 layoutv2service.applicationvolumeupdate(id,model).success(function() {
						 console.log("Changed source "+id + " to volume "+model);
						 $scope.isProcessingSlideChange = false;
					 }).error(function(data) {
						 console.log("Error in changing source "+id + " to volume "+model);
						 $scope.isProcessingSlideChange = false;
					});
				}
			};
			
				
			$scope.setMute = function(obj) {
				obj.isMute = !obj.isMute;
				layoutv2service.applicationmute(obj.source,obj.isMute).success(function() {
					 console.log("Mute source "+obj.source + " to state "+obj.isMute);
					 $scope.loadAudios();
				 }).error(function(data) {
					 console.log("Error in mute source "+obj.source + " to state "+obj.isMute);
					});
			}
			
			$scope.intervals = function()
		    {
				$interval(function() {
			        $scope.loadAudios();
			      }, 20000);
			
		    }
			
			$scope.intervals();
			
			
		});
