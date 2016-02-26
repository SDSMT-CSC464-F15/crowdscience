//this is a simplified map leaflet for the purpose of reporting an event

var map ;
var popup = L.popup();
var marker;
function initmap() {
	// set up the map
	map = new L.Map('map', {minZoom: 3,  maxZoom: 18});
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osm = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/rwfeather.j8g96pnj/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	   
		
	});		

	// start the map in Rapid City, SD
	map.setView(new L.LatLng(44.0760, -103.2280),9);
	map.addLayer(osm);
	
	win_url = "http://localhost/lc-mapper-repo/event.html";
}
//add a marker to 
function addMarker(lat, lon, title, id)
{
	var domelem = document.createElement('a');
	domelem.href = "search_results.html#";
	domelem.href += id;
	domelem.innerHTML = title;
	domelem.onclick = function() {
		openSearchPage(lat,lon);
	};
	
	var marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup(domelem).openPopup();	
}
function onMapClick(e) {
	
    lat = e.latlng.lat;
	lon = e.latlng.lng;

	document.getElementById('lat_name').value = lat;
	document.getElementById('lon_name').value = lon;
	
	if(typeof(marker)==='undefined')
		{
		marker = new L.marker([lat, lon]).addTo(map);
		}
	else
		{
		marker.setLatLng(e.latlng);
		}
}