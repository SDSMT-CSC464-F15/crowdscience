db.landscapechange.drop();

db.landscapechange.insert({ 
user : ObjectId("546e81372f32a09417000048"), 
location : { type : "Point", coordinates : [  -101.9970703125,  46.837649560937464 ] }, 
details : { description : "Huge forest fire in central ND", 
nat_event_name : "", category : "fire", status : "finished", 
date : ISODate("2015-04-07T06:00:00Z"), size : "large" } 
});

db.landscapechange.insert({ 
user : ObjectId("546e81372f32a09417000048"), 
location : { type : "Point", coordinates : [  -103.128662109375,  44.337600831495635 ] },  
details : { description : "Trees knocked down after the storm.", 
nat_event_name : "Storm Atlas", category : "wind", status : "finished", 
date : ISODate("2015-02-18T07:00:00Z"), size : "small" } 
});

db.landscapechange.insert({ 
user : ObjectId("546e81372f32a09417000048"), 
location : { type : "Point", coordinates : [  -70.6365966796875,  -33.38099943104024 ] },
details : { description : "Volcano eruption in Chile", 
nat_event_name : "Volcano", category : "avalanche", status : "ongoing", 
date : ISODate("2015-04-22T06:00:00Z"), size : "large" } 
});

db.landscapechange.insert({  
user : ObjectId("546e81372f32a09417000048"), 
location : { type : "Point", coordinates : [  -104.04602050781249,  42.898100636939276 ] },  
details : { description : "Mudslide after the recent rain", 
nat_event_name : "", category : "landslide", status : "finished", 
date : ISODate("2015-04-13T06:00:00Z"), size : "small" } 
});

db.landscapechange.insert({ 
user : ObjectId("552fea292f32a0a426000047"), 
location : { type : "Point", coordinates : [  -104.534912109375,  44.23732831822538 ] }, 
details : { description : "Lots of wind damage from a storm back in February. ", 
nat_event_name : "Winter Storm", category : "wind", status : "finished", 
date : ISODate("2015-02-04T07:00:00Z"), size : "large" } 
});

db.landscapechange.insert({
user : ObjectId("552fea292f32a0a426000047"), 
location : { type : "Point", coordinates : [  -103.22753906249999,  43.636075155965784 ] }, 
details : { description : "Due to heavy rains, some of the land shifted downhill.", 
nat_event_name : "Small Landslide", category : "landslide", status : "finished", 
date : ISODate("2015-04-22T06:00:00Z"), size : "small" } 
});

db.landscapechange.insert({ 
user : ObjectId("552fea292f32a0a426000047"), 
location : { type : "Point", coordinates : [  -103.22753906249999,  43.636075155965784 ] }, 
details : { description : "Due to heavy rains, some of the land shifted downhill.", 
nat_event_name : "Small Landslide", category : "landslide", status : "finished", 
date : ISODate("2015-04-22T06:00:00Z"), size : "small" } 
});