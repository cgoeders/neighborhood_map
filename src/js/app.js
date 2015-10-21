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
		lat: 37.44468,
		lng: -122.1637195,
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

	//TO FIX!!!!!!!!!!
	(function() {
		if (self.filterList.length > 0) {
			return 'Showing results matching your search...';
		}
		return '';
	});

	// self.showLiveInput = ko.computed(function() {
 //  		console.log(self.inputQuery());
 //  		self.runFilter;
	// });



	//filter list and markers based on user's input query
	self.runFilter = function() {
		var query = self.inputQuery().toLowerCase();
		console.log(query);
		// self.inputQuery(self.inputQuery().toLowerCase());
		// console.log(self.inputQuery());

		//TODO (for live search): make all existing markers invisible as user types

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

		//if only one item in `filterList`, zoom to marker and openInfoWindow
		if (self.filterList().length === 1) {
			var onlyItem = self.filterList()[0];
			self.openInfoWindow(onlyItem);
		} else {
			//revert to original map settings
			center = new google.maps.LatLng(37.437313, -122.160059);
			map.setZoom(13);
			infoWindow.close();
		}

		console.log(self.filterList(), 'filterList');
		console.log(self.markerList(), 'markerList');
	};


	self.openInfoWindow = function(listItem) {
		//set new map center based on listItem's marker position
		center = listItem.getPosition();
		map.setZoom(14);
		map.panTo(center);

		//animate marker with bounce; set timeout for bounce
		listItem.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			listItem.setAnimation(null);
		}, 2150);

		//open selected listItem marker's infoWindow
		infoWindow.setContent('<div id="info-content"></div>');

		//get cafeList entry object whose name matches this marker's title
		// var placeItem;
		// for (var i = 0; i < cafeList.length; i++) {
		// 	if (cafeList[i].name === listItem.title) {
		// 		placeItem = cafeList[i];
		// 	}
		// }

		var placeItem = self.getPlaceFromMarker(listItem);

		callFoursquare(placeItem);
		infoWindow.open(map, listItem);
	}

	self.getPlaceFromMarker = function(markerItem) {
		var placeItem;
		for (var i = 0; i < cafeList.length; i++) {
			if (cafeList[i].name === markerItem.title) {
				placeItem = cafeList[i];
			}
		}
		return placeItem;
	}






 	//initialize Google Map
 	var initialize = function() {
 		//center map initially in Palo Alto, CA, USA
 		latLng = new google.maps.LatLng(37.437313, -122.160059);
 		center = latLng;
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
 			// console.log(callFoursquare(place));
 			// console.log(place.FSvenueName);

 			markerOptions = {
 				position: new google.maps.LatLng(place.lat, place.lng),
 				map: map,
 				title: place.name,
 				givenLat: place.lat,
 				givenLng: place.lng,
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

 					infoWindow.setContent('I don\'t work. :(' + '<div id="info-content"></div>');
 					var placeItem = self.getPlaceFromMarker(marker);
 					callFoursquare(placeItem);
 					infoWindow.open(map, marker);
 				}
 			})(marker));
 		});

		//upon window resize, adjust the map center
		google.maps.event.addDomListener(window, 'resize', function() {
			map.panTo(center);
		});

 		// console.log(self.markerList());
 		// console.log(self.filterList());
 		// console.log(center);
 	}

	google.maps.event.addDomListener(window, 'load', initialize);






 	var callFoursquare = function(placeObj) {
 		var markLat = placeObj.lat;
 		var markLng = placeObj.lng;
 		var clientID = 'W51WSBBLLACBVC4P22Q0QFOCJX3YLHQMNELDDNCC1OWUQKBF';
 		var clientSecret = 'M3ZHLNWWGDY0YJXIB1FWXCRLYMLJ132GEVQMA3INMFQ04OWM';
 		var $infoWindowContent = $('#info-content');

 		//TODO: add method to extract non-parenthesized name
 		var queryName;
 		var index = placeObj.name.indexOf('(');
 		if (index === -1) {
 			queryName = placeObj.name;
 		} else {
 			queryName = placeObj.name.substring(0, index-1);
 		}


 		var url = 'https://api.foursquare.com/v2/venues/search?' + 
 				  'll=' + markLat + ',' + markLng + 
 				  '&v=20151019' + 
 				  '&client_id=' + clientID + 
 				  '&client_secret=' + clientSecret + 
 				  '&query=' + queryName;

 		//FULL URL: https://api.foursquare.com/v2/venues/search?ll=37.4259801,-122.1469309&v=20151019&client_id=W51WSBBLLACBVC4P22Q0QFOCJX3YLHQMNELDDNCC1OWUQKBF&client_secret=M3ZHLNWWGDY0YJXIB1FWXCRLYMLJ132GEVQMA3INMFQ04OWM&query=ZombieRunner

 		var venueName = '';

		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				// this.FSvenueItems = data.response.venues;
				// console.log(placeObj.name, this.FSvenueItems[0].name);
				var venue = data.response.venues[0];
				venueName = venue.name;
				var venuePhone = venue.contact.formattedPhone;
				var venueURL = venue.url;

				$infoWindowContent.append('<p>' + venueName + '</p>');
				$infoWindowContent.append('<p>Phone: ' + venuePhone + '</p>');
				$infoWindowContent.append('<p>Website: ' + venueURL + '</p>');
			},
			error: function() {
				//DOES THIS WORK???????????????????????????
				console.log("OH NO -- ERROR");
				alert("Error! Foursquare data request failed.");
			}
		});

		console.log(venueName);
		// placeObj.FSvenueName = venueName;
 		// console.log(venueName);

 	};

	// //TODO: create user error message in case GMaps doesn't load
	// if (typeof google !== 'object' || typeof google.maps !== 'object') {
	// 	self.notifyUser("Google Maps could not be loaded");
	// }

};

ko.applyBindings(new ViewModel());



