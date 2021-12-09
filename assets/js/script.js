var url = "https://jooble.org/api/";
var key = "114d40cd-a3ab-41a2-8549-cf04a44659fb";
var params = "{ keywords: 'it', location: 'Columbus'}";

//create xmlHttpRequest object
var http = new XMLHttpRequest();
//open connection. true - asynchronous, false - synchronous
http.open("POST", url + key, true);

//Send the proper header information
http.setRequestHeader("Content-type", "application/json");

//Callback when the state changes
http.onreadystatechange = function () {
  if (http.readyState == 4 && http.status == 200) {
    console.log(JSON.parse(http.responseText));
  }
};
//Send request to the server
http.send(params);

//

var host = "data.usajobs.gov";
var userAgent = "ileach81@gmail.com";
var authKey = "DOjDrxB7JE8vgKd3ajtL9XhA7+TQudbZSTT2N6tzPlo=";
var url = "https://data.usajobs.gov/api/search?JobCategoryCode=2210";
fetch(url, {
  method: "GET",
  headers: {
    Host: host,
    "User-Agent": userAgent,
    "Authorization-Key": authKey,
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
