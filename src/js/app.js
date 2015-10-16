var Model = function() {
	var self = this;

	var locations = {

	};

}


var ViewModel = function() {
	var self = this;

	self.notifyUser = ko.observable('User notification');
	console.log(self.notifyUser());

	self.currentLocation = ko.observable('Palo Alto, CA');

	self.processInput = function() {
		var locationInput = self.currentLocation();
		self.notifyUser('Processing your input...');
	};

	self.coffeeLocList = ko.observableArray([]);

	self.coffeeLocMarkersList = ko.observableArray([]);


 	//initialize variables
 	var map, 
 		mapCanvas, 
 		mapOptions, 
 		center;

 	//instantiate Google Map
 	function initialize() {
 		center = new google.maps.LatLng(37.404815, -122.1821644);
 		mapCanvas = document.getElementById('map-canvas');
 		mapOptions = {
 			zoom: 10,
 			center: center,
 			mapTypeControl: false
 		};
 		map = new google.maps.Map(mapCanvas, mapOptions);
 	}

	// //TODO: create user error message in case GMaps doesn't load
	// if (typeof google !== 'object' || typeof google.maps !== 'object') {
	// 	$('#???????').text("Could not load Google Maps API");
	// }
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new ViewModel());



