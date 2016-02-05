

db.eventsetsinfo.insert( 
{ id : "wildflower", name : "Wildflower Sightings",
details : [ { id : "species", name : "Species"},
			{ id : "count", name : "Number of Flowers"},
			{ id : "description", name : "Description"},
			{ id : "date", name : "Date"} ]
			});
			
db.eventsetsinfo.insert( 
{ id : "bird", name : "Bird Sightings",
details : [ { id : "species", name : "Species"},
			{ id : "count", name : "Number of Birds"},
			{ id : "description", name : "Description"},
			{ id : "date", name : "Date"} ]
			});
			
db.eventsetsinfo.insert( 
{ id : "landscapechange", name : "Landscape Changes",
details : [ { id : "nat_event_name", name : "Natural Event Name"},
			{ id : "category", name : "Category"},
			{ id : "status", name : "Status"},
			{ id : "size", name : "Size"},
			{ id : "description", name : "Description"},
			{ id : "date", name : "Date"} ]
			});
