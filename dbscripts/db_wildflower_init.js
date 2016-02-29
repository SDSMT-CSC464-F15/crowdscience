db.wildflower.drop();

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -104, 44 ] },
images : [  ObjectId("56d3af7e68b32cd77194a193"),
ObjectId("56d3af8322f00a38e3989dd7") ], 
details : { species : "Pasque" , count : 3 ,
description : "",
date : ISODate("2015-05-07T15:00:00Z")  } 
});

db.wildflower.insert({
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -107, 45 ] }, 
images : [  ObjectId("56d3af1283a2df04ae7b170d")],
details : { species : "Columbine" , count : 14 ,
description : "Pink flowers",
date : ISODate("2015-05-22T09:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -100, 42 ] }, 
images : [  ObjectId("56d3afd22014d2c95ad05b11")],
details : { species : "Wild Rose" , count : 2 ,
description : "",
date : ISODate("2015-05-23T11:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 41 ] }, 
images : [  ObjectId("56d3af27472db036b47c1c32")],
details : { species : "Wild Iris" , count : 20 ,
description : "Purple and yellow flowers",
date : ISODate("2015-05-24T11:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 41 ] }, 
images : [  ObjectId("56d3aef994e7869be798253d")],
details : { species : "Blue Bells" , count : 29 ,
description : "",
date : ISODate("2015-05-25T18:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101.5, 41 ] }, 
images : [  ObjectId("56d3af49fa26c2f0a8a89579")],
details : { species : "Lady's Slipper" , count : 1 ,
description : "",
date : ISODate("2015-05-25T18:30:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 43 ] }, 
images : [  ObjectId("56d3afe4001e6ffd6783386b")],
details : { species : "Woodlily" , count : 3 ,
description : "Beautiful orange color",
date : ISODate("2015-05-26T08:00:00Z")  } 
});