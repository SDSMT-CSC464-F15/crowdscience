db.user.insert(
{ "_id" : ObjectId("546e81372f32a09417000048"), "username" : "danhalloran", 
"email" : "drhalloran@gmail.com", "password" : "asdf", "score" : "0", 
"details" : { "role" : "Citizen", "location" : "Rapid City, SD", 
"fname" : "Dan", "lname" : "Halloran" } }
);
db.user.insert(
{ "_id" : ObjectId("552fea292f32a0a426000047"), "username" : "Ryan", "email" : "
ryan@test.org", "password" : "hh", "score" : "0", "details" : { "lname" : "", "f
name" : "", "location" : "", "role" : "" } }
);
db.user.update(
{ _id: 5629c3362f32a0940e000029 },
{
 "email" : "hannah.aker@mines.sdsmt.edu", "score" : "0", "details" : { "lname" : "Aker", 
 "fname" : "Hannah", "location" : "Rapid City, SD", "role" : "Citizen" }
}


db.landscapechange.insert(
{ "user" : ObjectId("546e81372f32a09417000048"), 
"location" : { "type" : "Point", "coordinates" : [  -101.9970703125,  
46.837649560937464 ] }, "details" : { "description" : "Huge forest fire in central ND", 
"nat_event_name" : "", "category" : "fire", "status" : "finished", 
"date" : ISODate("2015-04-07T06:00:00Z"), "size" : "large" } }
);
db.landscapechange.insert(
{ "user" : ObjectId("546e81372f32a09417000048"), 
"location" : { "type" : "Point", "coordinates" : [  -103.128662109375,  
44.337600831495635 ] },  "details" : { "description" : "Trees knocked down after the storm.", 
"nat_event_name" : "Storm Atlas", "category" : "wind", "status" : "finished", 
"date" : ISODate("2015-02-18T07:00:00Z"), "size" : "small" } }
);
db.landscapechange.insert(
{ "user" : ObjectId("546e81372f32a09417000048"), 
"location" : { "type" : "Point", "coordinates" : [  -70.6365966796875,  -33.38099943104024 ] },
 "details" : { "description" : "Volcano eruption in Chile", "nat_event_name"
 : "Volcano", "category" : "avalanche", "status" : "ongoing", 
 "date" : ISODate("2015-04-22T06:00:00Z"), "size" : "large" } }
 );
 db.landscapechange.insert(
 {  "user" : ObjectId("546e81372f32a09417000048"), 
 "location" : { "type" : "Point", "coordinates" : [  -104.04602050
781249,  42.898100636939276 ] },  "details" : { "description" : "Mudslide after the recent rain", "nat_even
t_name" : "", "category" : "landslide", "status" : "finished", "date" : ISODate(
"2015-04-13T06:00:00Z"), "size" : "small" } }
);
db.landscapechange.insert(
{ "user" : ObjectId("552fea292f32a0a426000047"), 
"location" : { "type" : "Point", "coordinates" : [  -104.53491210
9375,  44.23732831822538 ] }, "details" : { "description" : "Lots of wind damage from a storm back in Febr
uary. ", "nat_event_name" : "Winter Storm", "category" : "wind", "status" : "fin
ished", "date" : ISODate("2015-02-04T07:00:00Z"), "size" : "large" } }
);
db.landscapechange.insert(
{"user" : ObjectId("552fea292f32a0a426000047"), 
"location" : { "type" : "Point", "coordinates" : [  -103.22753906
249999,  43.636075155965784 ] }, "details" : { "description" : "Due to heavy rains, some of the land shift
ed downhill.", "nat_event_name" : "Small Landslide", "category" : "landslide", "
status" : "finished", "date" : ISODate("2015-04-22T06:00:00Z"), "size" : "small" } }
 );
 db.landscapechange.insert(
 { "user" : ObjectId("552fea292f32a0a426000047"), "location" : { "type" : "Point", "coordinates" : [  -103.22753906
249999,  43.636075155965784 ] }, "details" : { "description" : "Due to heavy rains, some of the land shift
ed downhill.", "nat_event_name" : "Small Landslide", "category" : "landslide", "
status" : "finished", "date" : ISODate("2015-04-22T06:00:00Z"), "size" : "small"
 } }
 );