//initialize variables
var map, 
	mapCanvas, 
	mapOptions, 
	center,
	latLng,
	infoWindow,
	marker;


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
		name: 'Peet\'s Coffee & Teas',
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
		markerIndex: 7,
		show: true
	},
	{
		name: 'Starbucks (Midtown)',
		lat: 37.4332611,
		lng: -122.1309018,
		markerIndex: 8,
		show: true
	},
	{
		name: 'Coupa Cafe (Stanford)',
		lat: 37.4262082,
		lng: -122.169189,
		markerIndex: 9,
		show: true
	},
];






var ViewModel = function() {
	var self = this;

	self.notifyUser = ko.observable('User notification');

	self.currentLocation = ko.observable('Palo Alto, CA');
	
	self.inputQuery = ko.observable('');

	//filter list and markers based on user's input query
	self.runFilter = function() {
		var query = self.inputQuery;
		console.log(query());


		
		self.notifyUser('Processing your input...');
	};

	self.cafeList = ko.observableArray(cafeList);

	self.markerList = ko.observableArray([]);


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
 		infoWindow = new google.maps.InfoWindow();

 		self.cafeList().forEach(function(place) {
 			// console.log(place);
 			markerOptions = {
 				position: new google.maps.LatLng(place.lat, place.lng),
 				map: map,
 				title: place.name,
 				markerIndex: place.markerIndex
 			};
 			marker = new google.maps.Marker(markerOptions);
 			self.markerList().push(marker);
 		});

 		console.log(self.markerList());

 	}

	// //TODO: create user error message in case GMaps doesn't load
	// if (typeof google !== 'object' || typeof google.maps !== 'object') {
	// 	self.notifyUser("Google Maps could not be loaded");
	// }
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new ViewModel());



