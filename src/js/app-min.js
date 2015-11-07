function setup(){ko.applyBindings(new ViewModel)}var map,mapCanvas,mapOptions,bounds,center,latLng,infoWindow,marker,cafeList=[{name:"ZombieRunner",lat:37.4259801,lng:-122.1469309,markerIndex:0},{name:"Philz Coffee (Midtown)",lat:37.4295836,lng:-122.1249023,markerIndex:1},{name:"Blue Bottle Coffee",lat:37.4475823,lng:-122.1618107,markerIndex:2},{name:"Starbucks (Stanford)",lat:37.4241183,lng:-122.1730281,markerIndex:3},{name:"Peet's Coffee & Tea",lat:37.4380821,lng:-122.1615256,markerIndex:4},{name:"Coupa Cafe (Downtown)",lat:37.44468,lng:-122.1637195,markerIndex:5},{name:"Cafe Venetia",lat:37.4474572,lng:-122.162427,markerIndex:6},{name:"La Baguette",lat:37.4429066,lng:-122.1739064,markerIndex:7},{name:"Philz Coffee (Downtown)",lat:37.4421512,lng:-122.163721,markerIndex:8},{name:"Starbucks (Midtown)",lat:37.4332611,lng:-122.1309018,markerIndex:9}],ViewModel=function(){var e=this;e.currentLocation=ko.observable("Palo Alto, CA"),e.inputQuery=ko.observable(""),e.cafeList=ko.observableArray(cafeList),e.markerList=ko.observableArray([]),e.filterList=ko.observableArray([]),e.notifyUser=ko.observable("Welcome!"),e.runFilter=function(){var n=e.inputQuery().toLowerCase();e.filterList().forEach(function(e){e.setVisible(!1)}),e.filterList(ko.utils.arrayFilter(e.markerList(),function(e){return e.title.toLowerCase().indexOf(n)>=0?(e.setVisible(!0),!0):!1}));for(var t=0;t<e.filterList().length;t++)bounds.extend(e.filterList()[t].position),map.fitBounds(bounds);if(0===e.filterList().length?e.notifyUser("No results. Try another search term."):1===e.filterList().length?e.notifyUser("Showing "+e.filterList().length.toString()+" result"):e.notifyUser("Showing "+e.filterList().length.toString()+" results"),1===e.filterList().length){var o=e.filterList()[0];e.openInfoWindow(o)}else center=new google.maps.LatLng(37.437313,-122.160059),map.setZoom(13),infoWindow.close()},e.getPlaceFromMarker=function(e){for(var n,t=0;t<cafeList.length;t++)cafeList[t].name===e.title&&(n=cafeList[t]);return n};var n=function(){latLng=new google.maps.LatLng(37.437313,-122.160059),bounds=new google.maps.LatLngBounds,center=latLng,mapCanvas=document.getElementsByClassName("map-canvas")[0],mapOptions={zoom:13,center:latLng,mapTypeControlOptions:{position:google.maps.ControlPosition.BOTTOM_LEFT}},map=new google.maps.Map(mapCanvas,mapOptions),e.cafeList().forEach(function(n){placeLatLng=new google.maps.LatLng(n.lat,n.lng),markerOptions={position:placeLatLng,map:map,title:n.name,givenLat:n.lat,givenLng:n.lng,markerIndex:n.markerIndex,animation:google.maps.Animation.DROP},marker=new google.maps.Marker(markerOptions),e.markerList().push(marker),e.filterList(e.markerList()),infoWindow=new google.maps.InfoWindow({content:""}),bounds.extend(placeLatLng),google.maps.event.addListener(marker,"click",function(n){return function(){center=n.getPosition(),map.setZoom(14),map.panTo(center),n.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){n.setAnimation(null)},2150),e.openInfoWindow(n)}}(marker))}),map.fitBounds(bounds),google.maps.event.addDomListener(window,"resize",function(){map.panTo(center)})};e.openInfoWindow=function(n){var t,o=e.getPlaceFromMarker(n),a=o.lat,r=o.lng,i="W51WSBBLLACBVC4P22Q0QFOCJX3YLHQMNELDDNCC1OWUQKBF",s="M3ZHLNWWGDY0YJXIB1FWXCRLYMLJ132GEVQMA3INMFQ04OWM",l=o.name.indexOf("(");t=-1===l?o.name:o.name.substring(0,l-1);var m="https://api.foursquare.com/v2/venues/search?ll="+a+","+r+"&v=20151019&client_id="+i+"&client_secret="+s+"&query="+t;$.ajax({url:m,dataType:"json",success:function(e){venue=e.response.venues[0],venueName=venue.name,venuePhone=venue.contact.formattedPhone,venueURL=venue.url,center=n.getPosition(),map.setZoom(14),map.panTo(center),n.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){n.setAnimation(null)},2150),infoWindow.open(map,n),infoWindow.setContent('<div id="info-content"><p><strong>'+venueName+"</strong></p><p><strong>Phone: </strong>"+venuePhone+'</p><p><strong>Website: </strong><a href="'+venueURL+'">'+venueURL+"</p></div>")},error:function(){console.log("AN ERROR HAS OCCURRED"),alert("Error! Foursquare data request failed."),e.notifyUser("Foursquare data could not be loaded.")}})},google.maps.event.addDomListener(window,"load",n)};