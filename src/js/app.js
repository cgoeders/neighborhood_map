//initialize variables
var map, 
	mapCanvas, 
	mapOptions, 
	center,
	latLng,
	infoWindow,
	marker,
	infoWindow;


//array of nearby coffee locations
var cafeList = [
	{
		name: 'ZombieRunner',
		lat: 37.4259801,
		lng: -122.1469309,
		markerIndex: 0,
		show: true
	},
	{
		name: 'Philz Coffee (Midtown)',
		lat: 37.4295836,
		lng: -122.1249023,
		markerIndex: 1,
		show: true
	},
	{
		name: 'Blue Bottle Coffee',
		lat: 37.4475823,
		lng: -122.1618107,
		markerIndex: 2,
		show: true
	},
	{
		name: 'Starbucks (Stanford)',
		lat: 37.4241183,
		lng: -122.1730281,
		markerIndex: 3,
		show: true
	},
	{
		name: 'Peet\'s Coffee & Tea',
		lat: 37.4380821,
		lng: -122.1615256,
		markerIndex: 4,
		show: true
	},
	{
		name: 'Coupa Cafe (Downtown)',
		lat: 37.4446842,
		lng: -122.1637248,
		markerIndex: 5,
		show: true
	},
	{
		name: 'Cafe Venetia',
		lat: 37.4474572,
		lng: -122.162427,
		markerIndex: 6,
		show: true
	},
	{
		name: 'La Baguette',
		lat: 37.4429066,
		lng: -122.1739064,
		markerIndex: 7,
		show: true
	},
	{
		name: 'Philz Coffee (Downtown)',
		lat: 37.4421512,
		lng: -122.163721,
		markerIndex: 8,
		show: true
	},
	{
		name: 'Starbucks (Midtown)',
		lat: 37.4332611,
		lng: -122.1309018,
		markerIndex: 9,
		show: true
	},
	{
		name: 'Coupa Cafe (Stanford)',
		lat: 37.4262082,
		lng: -122.169189,
		markerIndex: 10,
		show: true
	},
];





/*_______________________ViewModel_______________________*/


var ViewModel = function() {
	var self = this;

	self.currentLocation = ko.observable('Palo Alto, CA');
	
	self.inputQuery = ko.observable('');

	self.cafeList = ko.observableArray(cafeList);

	self.markerList = ko.observableArray([]);
	self.filterList = ko.observableArray([]);

	self.notifyUser = ko.observable('Welcome!');

	(function() {
		if (self.filterList.length > 0) {
			return 'Showing results matching your search...';
		}
		return '';
	});

	//filter list and markers based on user's input query
	self.runFilter = function() {
		var query = self.inputQuery().toLowerCase();
		console.log(query);
		
		//make all existing markers initially invisible as user types query

		self.filterList().forEach(function(markerItem) {
			markerItem.setVisible(false);
		});

		//update `filterList` with filtered markers using query
		self.filterList(ko.utils.arrayFilter(self.markerList(), function(item) {
			if (item.title.toLowerCase().indexOf(query) >= 0) {
				item.setVisible(true);
				return true;
			}
			return false;
		}));

		if (!(self.filterList().length > 0)) {
			self.notifyUser('No results. Try another search term.');
		} else {
			self.notifyUser('Showing ' + self.filterList().length.toString() + ' result(s)');
		};


		//iterate through filterList()


		console.log(self.filterList(), 'filterList');
		console.log(self.markerList(), 'markerList');
		// console.log(self.filterList());
		//two parts of filtering process:
		// self.filterMarkers();
		// self.filterList();

		// self.notifyUser('Processing your input...');
	};

	self.openInfoWindow = function(listItem) {
		//set new map center based on listItem's marker position
		center = listItem.getPosition();
		map.setZoom(14);
		map.panTo(center);

		//open selected listItem marker's infoWindow
		infoWindow.open(map, listItem);

	}





 	//initialize Google Map
 	function initialize() {
 		//center map initially in Palo Alto, CA, USA
 		latLng = new google.maps.LatLng(37.437313, -122.160059);
 		mapCanvas = document.getElementById('map-canvas');
 		mapOptions = {
 			zoom: 13,
 			center: latLng,
 			mapTypeControlOptions: {
 				position: google.maps.ControlPosition.TOP_RIGHT
 			}
 		};
 		map = new google.maps.Map(mapCanvas, mapOptions);


 		//add map markers for venues in `cafeList`
 		self.cafeList().forEach(function(place) {
 			// console.log(place);
 			markerOptions = {
 				position: new google.maps.LatLng(place.lat, place.lng),
 				map: map,
 				title: place.name,
 				markerIndex: place.markerIndex,
 				animation: google.maps.Animation.DROP
 			};
 			marker = new google.maps.Marker(markerOptions);
 			self.markerList().push(marker);
 			self.filterList(self.markerList());

 			//add info window
 			infoWindow = new google.maps.InfoWindow({
 				content: 'testing123'
 			});

 			//add marker click handler
 			google.maps.event.addListener(marker, 'click', (function(marker) {
 				return function() {
 					//make map center on selected marker
 					center = marker.getPosition();
 					map.setZoom(14);
 					map.panTo(center);

 					//animate marker with bounce, and set timeout for bounce
 					marker.setAnimation(google.maps.Animation.BOUNCE);
 					setTimeout(function() {
 						marker.setAnimation(null);
 					}, 2150);

 					infoWindow.setContent(marker.title + '<div id="info-content"></div>');
 					infoWindow.open(map, marker);
 				}
 			})(marker));
 		});

 		// console.log(self.markerList());
 		console.log(self.filterList());

 	}

	// //TODO: create user error message in case GMaps doesn't load
	// if (typeof google !== 'object' || typeof google.maps !== 'object') {
	// 	self.notifyUser("Google Maps could not be loaded");
	// }
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new ViewModel());



