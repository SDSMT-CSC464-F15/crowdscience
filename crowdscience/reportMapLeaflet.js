/*!
	\file reportMapLeaflet.js
	\brief Contains a simplified map leaflet for the purpose of reporting an event.
	\details 
	This file contains functions specific to the map leaflet used on the report screen: initmap(), addMarker(), and onMapClick(). The initmap() function creates a new instance of the map leaflet, setting parameters for a simplified display. The addMarker() function adds a marker to the map. The onMapClick() function defines what is done when the user clicks on the map, and adds the latitude and longitude of the marker to the text boxes associated with the map on the report screen. 
	
	The map, popup, and marker global variables store a reference to the map and all its markers being displayed.
*/

var map ;
var popup = L.popup();
var marker;

/*!
	\brief Creates a new instance of the map leaflet, setting parameters for a simplified display.
	\details 
	The map is then initialized, to be focused on Rapid City, SD, with information regarding the map's API origin. 
*/
function initmap() {
	// set up the map
	map = new L.Map("map", {minZoom: 3,  maxZoom: 18});
	var osmUrl="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	var osmAttrib="Map data © OpenStreetMap contributors";
	var osm = new L.TileLayer("http://{s}.tiles.mapbox.com/v3/rwfeather.j8g96pnj/{z}/{x}/{y}.png", {
		attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
		
		
	});		
	
	// start the map in Rapid City, SD
	map.setView(new L.LatLng(44.0760, -103.2280),9);
	map.addLayer(osm);
	
	win_url = "http://localhost/lc-mapper-repo/event.html";
}

/*!
	\brief Adds a marker to the map.
	\details 
	This function adds a marker to the map, and initializes the marker's event handler functions. 
*/
function addMarker(lat, lon, title, id)
{
	var domelem = document.createElement("a");
	domelem.href = "search_results.html#";
	domelem.href += id;
	domelem.innerHTML = title;
	domelem.onclick = function() {
		openSearchPage(lat,lon);
	};
	
	var marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup(domelem).openPopup();	
}

/*!
	\brief Map click event handler.
	\details 
	This function defines what is done when the user clicks on the map, and adds the latitude and longitude of the marker to the text boxes associated with the map on the report screen.  
*/
function onMapClick(e) {
	
	lat = e.latlng.lat;
	lon = e.latlng.lng;
	
	document.getElementById("lat_name").value = lat;
	document.getElementById("lon_name").value = lon;
	
	if(typeof(marker)==="undefined")
	{
		marker = new L.marker([lat, lon]).addTo(map);
	}
	else
	{
		marker.setLatLng(e.latlng);
	}
}

/*!
	\brief Change in latitude and longitude event handler.
	\details 
	This function defines what is done when the user changes the latitude or longitude, and adds the latitude and longitude of the marker to the map.
*/
function onChangeLatLong(argument) {
	
	lat = document.getElementById("lat_name").value;
	lon = document.getElementById("lon_name").value;

	if(typeof(marker)==="undefined")
	{
		marker = new L.marker([lat, lon]).addTo(map);
	}
	else
	{
		marker.setLatLng(new L.LatLng(lat, lon));
	}
}