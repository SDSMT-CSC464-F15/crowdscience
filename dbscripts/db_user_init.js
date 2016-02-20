db.user.drop();

db.user.insert({ 
_id : ObjectId("546e81372f32a09417000048"), username : "danhalloran", 
email : "drhalloran@gmail.com" , password : "asdf", score : "0", 
details : {  lname : "Halloran" , fname : "Dan", 
location : "Rapid City, SD, USA" , role : "Citizen"} 
});

db.user.insert({ 
_id : ObjectId("552fea292f32a0a426000047"), username : "Ryan", 
email : "ryan@test.org", password : "hh", score : "0", 
details : { lname : "Test", fname : "Ryan", 
location : "Rapid City, SD, USA", role : "Citizen" } 
});

db.user.insert({ 
_id : ObjectId("5629c3362f32a0940e000029"), username : "haker", 
email : "hannah.aker@mines.sdsmt.edu" , password : "password",  score : "0", 
details : { lname : "Aker",  fname : "Hannah", 
location : "Okalhoma City, OK, USA" , role : "Citizen"} 
});