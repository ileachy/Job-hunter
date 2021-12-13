var btnSearch = document.getElementById("btn-search");
var searchResults = document.querySelector(".search-results");

btnSearch.addEventListener("click", searchFunction);

function searchFunction(event) {
  event.preventDefault();
  var searchTextJob = document.getElementById("text-search-job").value;
  var searchTextCity = document.getElementById("text-search-city").value;
  var newLi = document.createElement("li");
  newLi.textContent = searchTextJob;
  searchResults.appendChild(newLi);
  var state = "Florida";
  intSearchUSA(searchTextJob, searchTextCity, state);
}

// function intSearch(searchJob, searchCity) {
//   // Jooble api
//   var url = "https://jooble.org/api/";
//   var key = "114d40cd-a3ab-41a2-8549-cf04a44659fb";
//   var params =
//     "{ keywords: '" + searchJob + "', location: '" + searchCity + "'}";

//   //create xmlHttpRequest object
//   var http = new XMLHttpRequest();
//   //open connection. true - asynchronous, false - synchronous
//   http.open("POST", url + key, true);

//   //Send the proper header information
//   http.setRequestHeader("Content-type", "application/json");

//   //Callback when the state changes
//   http.onreadystatechange = function () {
//     if (http.readyState == 4 && http.status == 200) {
//       for (let i = 0; i < JSON.parse(http.responseText).jobs.length; i++) {
//         var joobleOrgName = JSON.parse(http.responseText).jobs[i].company;
//         var joobleTitle = JSON.parse(http.responseText).jobs[i].title;
//         console.log(joobleOrgName);
//         console.log(joobleTitle);
//       }
//     }
//   };
//   //Send request to the server
//   http.send(params);
// }

// usajobs api
function intSearchUSA(searchJob, searchCity, searchState) {
  var host = "data.usajobs.gov";
  var userAgent = "ileach81@gmail.com";
  var authKey = "DOjDrxB7JE8vgKd3ajtL9XhA7+TQudbZSTT2N6tzPlo=";
  var url =
    "https://data.usajobs.gov/api/search?Keyword=" +
    searchJob +
    "&LocationName=" +
    searchCity +
    ",%20" +
    searchState;
  //"https://data.usajobs.gov/api/search?Keyword=Developer&LocationName=Boulder,%20Colorado";
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
      for (let i = 0; i < data.SearchResult.SearchResultItems.length; i++) {
        var usaOrganizationName =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .OrganizationName;
        var usaPosition =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .PositionTitle;

        console.log(usaPosition);
        console.log(usaOrganizationName);
      }
    });
}

// population of data
