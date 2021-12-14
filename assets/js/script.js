var arr = [];
var btnSearch = document.getElementById("btn-search");
var searchResults = document.querySelector(".search-results");

retrieveData();
btnSearch.addEventListener("click", searchFunction);

function searchFunction(event) {
  event.preventDefault();
  var searchTextJob = document.getElementById("text-search-job").value;
  var searchTextCity = document.getElementById("text-search-city").value;
  var searchTextState = document.getElementById("text-search-state").value;
  var radioBTN = document.querySelector("input[name='job-type']:checked").value;

  // Store the Data to local storage
  var test = {
    jobs: searchTextJob,
    city: searchTextCity,
    state: searchTextState,
  };
  arr.push(test);
  storeData();

  // Radio btn to decide whether standard or government jobs
  if (radioBTN === "standard") {
    intSearch(searchTextJob, searchTextCity);
  } else if (radioBTN === "government") {
    intSearchUSA(searchTextJob, searchTextCity, searchTextState);
  }

  for (let i = 0; i < arr.length; i++) {
    var searchHistory = document.createElement("li");
    searchHistory.textContent = arr[i];
  }

  // Clear text areas
  searchTextJob.textContent = "";
  searchTextCity.textContent = "";
  searchTextState.textContent = "";
}

// Jooble api
function intSearch(searchJob, searchCity) {
  var url = "https://jooble.org/api/";
  var key = "114d40cd-a3ab-41a2-8549-cf04a44659fb";
  var params =
    "{ keywords: '" + searchJob + "', location: '" + searchCity + "'}";

  //create xmlHttpRequest object
  var http = new XMLHttpRequest();
  //open connection. true - asynchronous, false - synchronous
  http.open("POST", url + key, true);

  //Send the proper header information
  http.setRequestHeader("Content-type", "application/json");

  //Callback when the state changes
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      for (let i = 0; i < JSON.parse(http.responseText).jobs.length; i++) {
        var joobleOrgName = JSON.parse(http.responseText).jobs[i].company;
        var joobleTitle = JSON.parse(http.responseText).jobs[i].title;
        var joobleDesc = JSON.parse(http.responseText).jobs[i].snippet;
        var joobleSource = JSON.parse(http.responseText).jobs[i].source;
        var joobleUpdated = JSON.parse(http.responseText).jobs[i].updated;
        var joobleUpdatedSlice = joobleUpdated.substring(0, 9);

        console.log(joobleUpdated);

        // Display on DOM
        searchResults.innerHTML += `<div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2"> ${joobleTitle}</div>
          <p class="text-gray-700 text-base">
            ${joobleOrgName}
          </p>
          <p class="text-gray-700 text-base">
            ${joobleDesc}
          </p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${joobleSource}</span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${joobleUpdatedSlice}</span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
        </div>
      </div>`;
      }
    }
  };
  //Send request to the server
  http.send(params);
}

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
        var usaPositionEndDate =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .PositionEndDate;
        var usaPositionEndDateSlice =
          "start: " + usaPositionEndDate.substring(0, 9);

        var usaPositionStartDate =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .PositionStartDate;
        var usaPositionStartDateSlice =
          "end: " + usaPositionStartDate.substring(0, 9);
        var usaPositionDesc =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .QualificationSummary;

        var usaPositionDescSlice = usaPositionDesc.substring(0, 200) + "...";
        var usePositionURL =
          data.SearchResult.SearchResultItems[i].MatchedObjectDescriptor
            .PositionURI;

        console.log(usePositionURL);

        //  https://data.usajobs.gov/api/Search?RemunerationMinimumAmount=26000&RemunerationMaximumAmount=85000
        // Display on DOM

        searchResults.innerHTML += `<div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2"> ${usaPosition}</div>
          <p class="text-gray-700 text-base">
            ${usaOrganizationName}
          </p>
          <p class="text-gray-700 text-base">
            ${usaPositionDescSlice}
          </p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${usaPositionEndDateSlice}</span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${usaPositionStartDateSlice}</span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
        </div>
      </div>`;
      }
    });
}

function storeData() {
  localStorage.setItem("searchHistory", JSON.stringify(arr));
}

function retrieveData() {
  var arrJobs = JSON.parse(localStorage.getItem("searchHistory"));
  arr.push(arrJobs);
}
