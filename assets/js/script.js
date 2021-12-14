var arr = [];
var btnSearch = document.getElementById("job-search");
var searchResults = document.querySelector(".search-results");
var resultContainer = document.getElementById("search-result-header");
var previousSearches = document.getElementById("previous-search");

retrieveData();
displaySavedSearches();

btnSearch.addEventListener("submit", searchFunction);

function searchFunction(event) {
  event.preventDefault();

  // Need this to remove previous job searches from the page
  $("#search-results").children().each(function () {
    $(this).remove();
  });

  var searchTextJob = document.getElementById("text-search-job");
  var searchTextCity = document.getElementById("text-search-city");
  // var searchTextState = document.getElementById("text-search-state").value;
  var radioBTN = document.querySelector("input[name='job-type']:checked").value;

  var location = parseCityState(searchTextCity.value);

  // Store the Data to local storage
  var searchData = {
    job: searchTextJob.value,
    city: location.city,
    state: location.state,
  };
  // arr.push(searchData);
  // storeData();

  // Radio btn to decide whether standard or government jobs
  if (radioBTN === "standard") {
    intSearch(searchData.job, searchData.city);
  } else {
    intSearchUSA(searchData.job, searchData.city, searchData.state);
  }

  for (let i = 0; i < arr.length; i++) {
    var searchHistory = document.createElement("li");
    searchHistory.textContent = arr[i];
  }

  // Clear text areas
  searchTextJob.value = "";
  searchTextCity.value = "";
  // searchTextState.textContent = "";
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
      resultContainer.textContent = "All '" + searchJob + "' results near " + searchCity;
      resultContainer.setAttribute("class", "pb-3 font-medium");

      console.log(JSON.parse(http.responseText))


      for (let i = 0; i < JSON.parse(http.responseText).jobs.length; i++) {
        var joobleOrgName = JSON.parse(http.responseText).jobs[i].company;
        var joobleTitle = JSON.parse(http.responseText).jobs[i].title;

        // Display on DOM
        searchResults.innerHTML +=
          `<div class="max-w-sm rounded overflow-hidden shadow-lg">
            <div class="px-6 py-4 border-purple-900" id="job-container">
              <div class="font-bold text-xl mb-2" id="job-title"> ${joobleTitle}</div>
              <div class='flex justify-between'>
                  <p class="text-gray-700 text-base" id="org-name">
                    ${joobleOrgName}
                  </p>
                  <form>
                    <button class=" inline-block bg-purple-900 rounded px-2 py-2 text-sm font-semibold text-yellow-500 mr-2 mb-2 hover:bg-purple-500" type="submit"> 
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </form>
              </div>
            </div>
            <div class="flex items-center px-6 pt-4 pb-2 border-b-2 s-purple-900">
              <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#${joobleTitle.split(" ")[0]}</span>
              <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#${joobleTitle.split(" ")[1]}</span>
              <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#Standard</span>
            </div>
          </div>
            `
      }
    } else {
      resultContainer.textContent = "Could not find results for '" + searchJob + "' near " + searchCity + " please try again";
      resultContainer.setAttribute("class", "pb-3 font-medium");
    }

    // Listen to click on 'Add' button for each of the job listings, and add them to local storage
    ($("*[id=job-container]")).each(function () {
      $(this).on("submit", function (e) {
        e.preventDefault();
        // console.log($(this).find("#job-title").val())
        console.log($(this).find("#job-title")[0].innerText)
        console.log($(this).find("#org-name")[0].innerText)

        var jobTitle = $(this).find("#job-title")[0].innerText;
        var orgName = $(this).find("#org-name")[0].innerText;

        var holdObj = {
          job: jobTitle + " @ " + orgName,
          city: searchCity,
          state: "Random State",
          type: "Standard"
        }

        arr.push(holdObj);
        storeData();
      })
    });

  };
  //Send request to the server
  http.send(params);
}

// usajobs api
function intSearchUSA(searchJob, searchCity, searchState) {
  var host = "data.usajobs.gov";
  var userAgent = "ileach81@gmail.com";
  var authKey = "DOjDrxB7JE8vgKd3ajtL9XhA7+TQudbZSTT2N6tzPlo=";
  var url = "https://data.usajobs.gov/api/search?Keyword=" + searchJob + "&LocationName=" + searchCity + ",%20" + searchState;
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

        // Display on DOM
        if (searchState === "") {
          resultContainer.textContent = "All '" + searchJob + "' results near " + searchCity;
          resultContainer.setAttribute("class", "pb-3 font-medium");
        } else {
          resultContainer.textContent = "All '" + searchJob + "' results near " + searchCity + ", " + searchState;
          resultContainer.setAttribute("class", "pb-3 font-medium");
        }

        searchResults.innerHTML += `
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4 border-purple-900" id="job-container-gov">
              <div class="font-bold text-xl mb-2" id="job-title"> ${usaPosition}</div>
              <div class='flex justify-between'>
                  <p class="text-gray-700 text-base" id="org-name">
                    ${usaOrganizationName}
                  </p>
                  <form>
                    <button class=" inline-block bg-purple-900 rounded px-2 py-2 text-sm font-semibold text-yellow-500 mr-2 mb-2 hover:bg-purple-500" type="button"> 
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </form>
              </div>
            </div>
        <div class="px-6 pt-4 pb-2">
        <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#Job</span>
        <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#Testing</span>
        <span class="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-violet-800 mr-2 mb-2">#Governement</span>
        </div>
      </div>
      `

      }
      console.log($("*[id=job-container-gov").each(function(){
        $(this).on("click", function(){
          console.log($(this).find("#job-title")[0].innerText)
          console.log($(this).find("#org-name")[0].innerText)

          var jobTitle = $(this).find("#job-title")[0].innerText;
          var orgName = $(this).find("#org-name")[0].innerText;

          var holdObj = {
            job: jobTitle + " @ " + orgName,
            city: searchCity,
            state: searchState,
            type: "Government"
          }
          arr.push(holdObj);
          storeData();
        })
      }))
    });
}

function storeData() {
  localStorage.setItem("searchHistory", JSON.stringify(arr));
}

function retrieveData() {
  var arrJobs = JSON.parse(localStorage.getItem("searchHistory"));
  if (arrJobs) {
    for (job of arrJobs) {
      arr.push(job);
    }
  }
}

function parseCityState(string) {
  if (typeof string.split(",")[1] == "undefined") {
    var location = {
      city: string.split(",")[0],
      state: ""
    };
  } else {
    var holdStringLeft = string.split(",")[0];
    var holdStringRight = string.split(",")[1].split(" ")[1];

    var location = {
      city: holdStringLeft,
      state: holdStringRight
    };
  }
  return location;
};


function displaySavedSearches() {
  for (job of arr) {
    previousSearches.innerHTML += `
    <div class="max-w-sm w-full lg:max-w-full lg:border-b border-r border-b shadow-md">
      <div class=" border-gray-400 lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal ">
        <div class="mb-8">
          <div class="text-gray-900 font-bold text-xl mb-2">${job.job}</div>
          <p class="text-gray-700 text-base">It's a chill job man</p>
          <p>${job.city}, ${job.state}</p>
        </div>
      </div>
    </div>
    `
  }
}

