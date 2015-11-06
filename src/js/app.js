/*

This is the main file running the application. This site allows users to
search either a list view or a map marker view for a coffee shop among 
10 given locations in Palo Alto, CA. The app utilizes both Google Maps JavaScript
API and Foursquare's API to display information about each marker
location in an information window upon user click. Code has been organized 
according to KnockoutJS's MVVM design pattern.

*/



//initialize global variables
var map, 
	mapCanvas, 
	mapOptions, 
	center,
	latLng,
	infoWindow,
	marker,
	infoWindow;


//define array of nearby coffee locations
var cafeList = [
	{
		name: 'ZombieRunner',
		lat: 37.4259801,
		lng: -122.1469309,
		markerIndex: 0,
	},
	{
		name: 'Philz Coffee (Midtown)',
		lat: 37.4295836,
		lng: -122.1249023,
		markerIndex: 1,
	},
	{
		name: 'Blue Bottle Coffee',
		lat: 37.4475823,
		lng: -122.1618107,
		markerIndex: 2,
	},
	{
		name: 'Starbucks (Stanford)',
		lat: 37.4241183,
		lng: -122.1730281,
		markerIndex: 3,
	},
	{
		name: 'Peet\'s Coffee & Tea',
		lat: 37.4380821,
		lng: -122.1615256,
		markerIndex: 4,
	},
	{
		name: 'Coupa Cafe (Downtown)',
		lat: 37.44468,
		lng: -122.1637195,
		markerIndex: 5,
	},
	{
		name: 'Cafe Venetia',
		lat: 37.4474572,
		lng: -122.162427,
		markerIndex: 6,
	},
	{
		name: 'La Baguette',
		lat: 37.4429066,
		lng: -122.1739064,
		markerIndex: 7,
	},
	{
		name: 'Philz Coffee (Downtown)',
		lat: 37.4421512,
		lng: -122.163721,
		markerIndex: 8,
	},
	{
		name: 'Starbucks (Midtown)',
		lat: 37.4332611,
		lng: -122.1309018,
		markerIndex: 9,
	}
];





/*_______________________ViewModel_______________________*/


var ViewModel = function() {
	var self = this;

	self.currentLocation = ko.observable('Palo Alto, CA');
	
	//make KO observables
	self.inputQuery = ko.observable('');

	self.cafeList = ko.observableArray(cafeList);

	self.markerList = ko.observableArray([]);
	
	self.filterList = ko.observableArray([]);

	self.notifyUser = ko.observable('Welcome!');

	//filter list and markers based on user's input query
	self.runFilter = function() {
		var query = self.inputQuery().toLowerCase();

		//make all markers initially invisible
		self.filterList().forEach(function(markerItem) {
			markerItem.setVisible(false);
		});

		//update `filterList` with filtered markers using `query`, and display relevant markers
		self.filterList(ko.utils.arrayFilter(self.markerList(), function(item) {
			if (item.title.toLowerCase().indexOf(query) >= 0) {
				item.setVisible(true);
				return true;
			}
			return false;
		}));

		//notify user of search results
		if (self.filterList().length === 0) {
			self.notifyUser('No results. Try another search term.');
		} else if (self.filterList().length === 1) {
			self.notifyUser('Showing ' + self.filterList().length.toString() + ' result');
		} else {
			self.notifyUser('Showing ' + self.filterList().length.toString() + ' results');
		}

		//if only one item in `filterList`, zoom to that marker and open an info window
		if (self.filterList().length === 1) {
			var onlyItem = self.filterList()[0];
			self.openInfoWindow(onlyItem);
		} else {
			//revert to original map settings
			center = new google.maps.LatLng(37.437313, -122.160059);
			map.setZoom(13);
			infoWindow.close();
		}
	};

	//useful to convert marker item to simple place item
	self.getPlaceFromMarker = function(markerItem) {
		var placeItem;
		for (var i = 0; i < cafeList.length; i++) {
			if (cafeList[i].name === markerItem.title) {
				placeItem = cafeList[i];
			}
		}
		return placeItem;
	};

 	//initialize Google Map
 	var initialize = function() {
 		//center map initially in Palo Alto, CA, USA
 		latLng = new google.maps.LatLng(37.437313, -122.160059);
 		
 		//TODO: fitBounds() function to control viewport

 		center = latLng;
 		mapCanvas = document.getElementsByClassName('map-canvas')[0];
 		mapOptions = {
 			zoom: 13,
 			center: latLng,
 			mapTypeControlOptions: {
 				position: google.maps.ControlPosition.TOP_RIGHT
 			}
 		};
 		map = new google.maps.Map(mapCanvas, mapOptions);

 		//add map markers for all venues in `cafeList`
 		self.cafeList().forEach(function(place) {
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

 			//keep track of markers
 			self.markerList().push(marker);
 			self.filterList(self.markerList());

 			//add info window
 			infoWindow = new google.maps.InfoWindow({
 				
 				//TODO: build info window content directly in JS using info 
 				//pulled from API via AJAX call


 				content: ''
 			});

 			//add marker click handler
 			google.maps.event.addListener(marker, 'click', (function(marker) {
 				return function() {
 					//center map on selected marker
 					center = marker.getPosition();
 					map.setZoom(14);
 					map.panTo(center);

 					//animate marker with bounce, and set timeout for bounce
 					marker.setAnimation(google.maps.Animation.BOUNCE);
 					setTimeout(function() {
 						marker.setAnimation(null);
 					}, 2150);

 					self.openInfoWindow(marker);
 				};
 			})(marker));
 		});

		//upon window resize, adjust the map center
		google.maps.event.addDomListener(window, 'resize', function() {
			map.panTo(center);
		});
 	};

 	//populates info window with requested Foursquare data
	self.openInfoWindow = function(listItem) {
        
        //info needed to make Foursquare request
        var placeObj = self.getPlaceFromMarker(listItem);
 		var markLat = placeObj.lat;
 		var markLng = placeObj.lng;
 		var clientID = 'W51WSBBLLACBVC4P22Q0QFOCJX3YLHQMNELDDNCC1OWUQKBF';
 		var clientSecret = 'M3ZHLNWWGDY0YJXIB1FWXCRLYMLJ132GEVQMA3INMFQ04OWM';

 		//extract non-parenthesized name
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

 		//request data from Foursquare
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data) {
				venue = data.response.venues[0];

				//info to be displayed in info window
				venueName = venue.name; 
				venuePhone = venue.contact.formattedPhone;
				venueURL = venue.url;

				//center the map on this item
                center = listItem.getPosition();
                map.setZoom(14);
                map.panTo(center);

                //animate marker with bounce; set timeout for bounce
                listItem.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                  listItem.setAnimation(null);
                }, 2150);
                
                //open info window
                infoWindow.open(map, listItem);
                infoWindow.setContent('<div id="info-content"></div>');

                //add information to info window
				$('#info-content').append('<p><strong>' + venueName + '</strong></p>');
				$('#info-content').append('<p><strong>Phone: </strong>' + venuePhone + '</p>');
				$('#info-content').append('<p><strong>Website: </strong><a href="' + venueURL + '">' + venueURL + '</p>');
			},
			//notify user if error occurs with request
			error: function() {
				console.log("AN ERROR HAS OCCURRED");
				alert("Error! Foursquare data request failed.");
				self.notifyUser('Foursquare data could not be loaded.');
			}
		});
 	};

 	//on load, run the main `initialize` function
	google.maps.event.addDomListener(window, 'load', initialize);
};


function setup() {
	ko.applyBindings(new ViewModel());
}


// ko.applyBindings(new ViewModel());