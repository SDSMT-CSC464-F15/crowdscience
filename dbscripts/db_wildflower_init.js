db.wildflower.drop();

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -104, 44 ] }, 
details : { species : "Pasque" , count : 3 ,
description : "",
date : ISODate("2015-05-07T15:00:00Z")  } 
});

db.wildflower.insert({
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -107, 45 ] }, 
details : { species : "Columbine" , count : 14 ,
description : "Pink flowers",
date : ISODate("2015-05-22T09:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -100, 42 ] }, 
details : { species : "Wild Rose" , count : 2 ,
description : "",
date : ISODate("2015-05-23T11:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 41 ] }, 
details : { species : "Wild Iris" , count : 20 ,
description : "Purple and yellow flowers",
date : ISODate("2015-05-24T11:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 41 ] }, 
details : { species : "Blue Bells" , count : 29 ,
description : "",
date : ISODate("2015-05-25T18:00:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101.5, 41 ] }, 
details : { species : "Lady's Slipper" , count : 1 ,
description : "",
date : ISODate("2015-05-25T18:30:00Z")  } 
});

db.wildflower.insert({ 
user : ObjectId("5629c3362f32a0940e000029"), 
location : { type : "Point", coordinates : [  -101, 43 ] }, 
details : { species : "Daylily" , count : 3 ,
description : "Three Blooms on one plant",
date : ISODate("2015-05-26T08:00:00Z")  } 
});