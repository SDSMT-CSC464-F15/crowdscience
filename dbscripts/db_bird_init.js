db.bird.drop();

db.bird.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -103.25, 44 ] },
images : [  ObjectId("56d3af7040bf0a47e5ced54e")],
details : { species : "Northern Flicker" , count : 2 ,
description : "One of each coloration. On red shafted, one yellow shafted.",
date : ISODate("2014-04-17T15:00:00Z")  } 
});

db.bird.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -103.29, 44 ] },
images : [  ObjectId("56d3af9eb4cc334161c9fa20")],
details : { species : "Ross's Goose" , count : 1 ,
description : "White form",
date : ISODate("2016-01-28T08:00:00Z")  } 
});

db.bird.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -103.47, 43.97 ] },
images : [  ObjectId("56d3af0687630134ff8ce163")],
details : { species : "Canada Goose" , count : 30 ,
description : "",
date : ISODate("2015-10-07T09:00:00Z")  } 
});

db.bird.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -103.51, 43.77 ] },
images : [  ObjectId("56d3af945fe1feaae4b7ad84")],
details : { species : "Redhead" , count : 1 ,
description : "",
date : ISODate("2015-10-12T09:00:00Z")  } 
});