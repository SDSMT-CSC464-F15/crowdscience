db.eventsetsinfo.drop();

db.eventsetsinfo.insert({ 
id : "wildflower", name : "Wildflower Sightings",
details : [ { id : "species", name : "Species", type : "shorttext"},
			{ id : "count", name : "Number of Flowers", type : "number", restriction : ">0"},
			{ id : "description", name : "Description", type : "longtext"},
			{ id : "date", name : "Date", type : "date" } ]
			});
			
db.eventsetsinfo.insert({ 
id : "bird", name : "Bird Sightings",
details : [ { id : "species", name : "Species", type : "shorttext"},
			{ id : "count", name : "Number of Birds", type : "number", restriction : ">0"},
			{ id : "description", name : "Description", type : "longtext"},
			{ id : "date", name : "Date", type : "date"} ]
			});
			
db.eventsetsinfo.insert({ 
id : "landscapechange", name : "Landscape Changes",
details : [ { id : "nat_event_name", name : "Natural Event Name", type : "shorttext"},
			{ id : "category", name : "Category", type : "selection", 
				options : [	{id :"fire", name : "Fire"},
							{id :"wind", name : "Wind Damage"},
							{id :"avalanche", name : "Avalanche Damage"},
							{id :"timber", name : "Thinning/Timber Harvest"},
							{id :"insect", name : "Insect Infestation"},
							{id :"landslide", name : "Landslide"},
							{id :"earthquake", name : "Earthquake"},
							{id :"flooding", name : "Flooding"},
							{id :"mining", name : "Surface Mining"},
							{id :"construction", name : "Road/House Construction"}]		   
			},
			{ id : "status", name : "Status", type : "selection", 
				options : [	{id : "ongoing", name : "Ongoing"},
							{id : "finished", name : "Finished"}]
			},
			{ id : "size", name : "Size", type : "selection", 
				options : [	{id : "large", name : "Larger than Baseball Diamond"},
							{id : "small", name : "Smaller than Baseball Diamond"}]
			},
			{ id : "description", name : "Description", type : "longtext"},
			{ id : "date", name : "Date", type : "date"} ]
			});