$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   **/
  var npsURL = "https://developer.nps.gov/api/v1/";
  var npsAPIkey = "PtYiGrnXjG4FL7v9tOprJACeJgJV4KxlTarrmWXF";
  var mapQuestAPIkey = "UKFuk0Xe7EAKnJmVEVb3gfUAKRVOlAzR";
  var allParksInState = {};
  /**
   * DOM ELEMENTS
   **/
  var landingPageHeader = $("#landingPageHeader");
  var assessmentBtn = $("#assessmentBtn");
  var distanceBtn = $("#distanceBtn");
  var activityBtn = $("#activityBtn");
  var assessmentDiv = $("#assessmentDiv");
  var distanceDiv = $("#distanceDiv");
  var activityDiv = $("#activityDiv");
  var parkListDiv = $("#parkListDiv");
  var parkDiv = $("#parkDiv");
  var container = $("#container");
  var originalPage = $("#originalPage");
  var addressSubmit = $("#addressSubmit");
  var inputAddress = $("#inputAddress");
  var inputCity = $("#inputCity");
  var inputState = $("#inputState");
  var inputZip = $("#inputZip");
  /**
   * FUNCTION DEFINITIONS
   */
  function clearScreen() {
    originalPage.attr("style", "display:none");
    activityDiv.empty();
  }

  // Function - AJAX Call using the State Code
  function ajaxCallState(state) {
    var stateParksURL = `${npsURL}parks/?api_key=${npsAPIkey}&stateCode=${state}`;
    $.ajax({
      url: stateParksURL,
      method: "GET",
    }).then(function (response) {
      allParksInState = response;
      // console.log(allParksInState);
    });
  }

// Function to compute distance to parks
function distanceToPark()
{

  $.ajax({
    url: "https://developer.nps.gov/api/v1/parks/?api_key=tYiGrnXjG4FL7Pv9tOprJACeJgJV4KxlTarrmWXF&stateCode=GA",
    method:"GET"
  }).then(function(parks){

       var fromAddressString = "4285 Roswell Rd NE,Atlanta,GA";
       var toAddressString = "";

       console.log(parks.data[0].addresses[0]);
       if(parks.data[0].addresses[0].type === "Physical")
       {
         console.log("physical address");
         toAddressString = parks.data[0].addresses[0].line3 + "," + parks.data[0].addresses[0].city + "," +  parks.data[0].addresses[0].stateCode + "," +  parks.data[0].addresses[0].postalCode;
         console.log(toAddressString);
       }

      toAddressString = "31.2214699,-81.39452014";

       console.log("http://open.mapquestapi.com/directions/v2/route?from=" + fromAddressString + "&to="  + toAddressString + "&key=UKFuk0Xe7EAKnJmVEVb3gfUAKRVOlAzR");
       $.ajax({
         url:"http://open.mapquestapi.com/directions/v2/route?from=" + fromAddressString + "&to="  + toAddressString + "&key=UKFuk0Xe7EAKnJmVEVb3gfUAKRVOlAzR",
         method: "GET"
       }).then(function(routeResponse){

         console.log(routeResponse);

       });

  });

}






  /**
   * FUNCTION CALLS
   */

  distanceToPark();


  /**
   * EVENT HANDLERS
   */

  //Address entry form
  // Function to add event listener to distance button
  // distanceBtn.on("click", function (event) {
  //   console.log("Distance button event handler");
  //   clearScreen();
  //   distanceDiv.attr("style", "display:block");
  // });
  addressSubmit.on("click", function (event) {
    event.preventDefault();
    distanceDiv.attr("class", "displayNone");
    originalPage.attr("class", "display");
    var addy = `${inputAddress.val()}, ${inputCity.val()}, ${inputState.val()} ${inputZip.val()}`;
    // console.log(addy);

    ajaxCallState(inputState.val());
  });
  // ACTIVITY BUTTON SECTION START!
  activityBtn.on("click", function () {
    clearScreen();
    // console.log(allParksInState);
    activityDiv.attr("class", "display");
    var header = $("<h2>");
    header.text("Which of the following activities most interests you?");
    activityDiv.append(header);
    var selections = [
      "Camping",
      "Fishing",
      "Biking",
      "Shopping",
      "Guided Tours",
      "Wildlife Watching",
      "Hiking",
    ];
    for (i = 0; i < selections.length; i++) {
      var choice = $("<button>");
      choice.attr("class", "btn btn-primary");
      choice.attr("button-value", selections[i]);
      choice.text(selections[i]);
      activityDiv.append(choice);
    }
  });
  var parksThatHaveActivity = [];
  //event listener for the newly generated buttons
  activityDiv.on("click", ".btn", function () {
    // console.log($(this).attr("button-value"));
    var val = $(this).attr("button-value");
    // ajaxCallActivities(val);
    // console.log(allParksInState);

    for (i = 0; i < allParksInState.data.length; i++) {
      var parks = allParksInState.data[i].activities;
      // console.log(parks);
      // var activities = parks.activities;
      // console.log(allParksInState.data);
      for (x = 0; x < parks.length; x++) {
        // console.log(parks[x].name);
        if (parks[x].name == val) {
          // console.log(parks[x].name);
          parksThatHaveActivity.push(allParksInState.data[i]);
          // console.log(allParksInState.data[i].fullName);
        }
      }
    }
    clearScreen();
    for (y = 0; y < parksThatHaveActivity.length; y++) {
      
      activityDiv.attr("class", "card-deck row row-cols-3 mt-5");
        var col = $("<div class = 'col'> </div>");
          var card = $("<div class='card'></div>");
            var img = $("<img class='card-img-top' alt='park-image'/>");
            img.attr("src", parksThatHaveActivity[y].images[0].url);
            // console.log(parksThatHaveActivity);
            var div = $("<div class='card-body'></div>");
              var h5 = $("<h5 class='card-title'>Header goes here</h5>");
              var p = $("<p class='card-text'>Lorem Ipsum blah blah blah blha lbskjdfowiej woijfwo</p>");

      card.append(img, div);
      div.append(h5, p); 

      activityDiv.append(col);
    }
  });

  // console.log(parksThatHaveActivity);

  //function for api call based on button clicked
  // function ajaxCallState(state) {
  // var activitiesParkUrl = `${npsURL}activities/parks/?api_key=${npsAPIkey}&q=${val}`;
  // var activitiesParkUrl = `${npsURL}parks/?api_key=${npsAPIkey}&stateCode=${state}`;
  // $.ajax({
  //   url: activitiesParkUrl,
  //   method: "GET",
  // }).then(function (response) {
  //   // console.log(response);
  //   allParksInState = response;
  //   console.log(allParksInState);
  // });
  // $.ajax({
  //   url: activitiesParkUrl,
  //   method: "GET",
  // }).then(function (response) {
  //   // console.log(response);
  //   var resultsArray = [];
  //   for (i = 0; i < response.data[0].parks.length; i++) {
  //     if (response.data[0].parks[i].states == "GA") {
  //       // console.log(response.data[0].parks[i]);
  //       var results = response.data[0].parks[i];
  //       var code = results.parkCode;
  //       resultsArray.push(results.parkCode);
  //       // console.log(resultsArray.length);
  //       for (j = 0; j < resultsArray.length; j++) {
  //         $.ajax({
  //           url: `${npsURL}parks/?api_key=${npsAPIkey}&parkCode=${code}`,
  //           method: "GET",
  //         }).then(function (r) {
  //           // console.log("test");
  //           console.log(r);
  //         });
  //       }
  //     }
  //   }
  // });
  // }
  // ACTIVITY BUTTON SECTION END


  // Event Listener - Loading Page Assessment Button
  assessmentBtn.on("click", function () {
    clearScreen();

    var topicsArray = [
      "African American Heritage",
      "American Revolution",
      "Asian American Heritage",
      "Colonization and Settlement",
      "Great Depression",
      "Hispanic American Heritage",
      "Latino American Heritage",
      "LGBTQ American Heritage",
      "Military",
      "Monuments and Memorials",
      "Native American Heritage",
      "Pacific Islander Heritage",
      "Presidents",
      "Women's History",
    ];

    var questionHeader = $("<h1>");
    questionHeader.text("Which topic would you like to explore?");
    assessmentDiv.append(questionHeader);
    assessmentDiv.attr("class", ".display");

    for (i = 0; i < topicsArray.length; i++) {
      var option = $(
        "<button type='button' class='btn btn-primary'>" +
          topicsArray[i] +
          "</button>"
      );
      assessmentDiv.append(option);
    }
  });

  var parksWithTopics = [];

  assessmentDiv.on("click", ".btn", function () {
    var userChoice = $(this).text();
    // console.log(userChoice);
    // console.log(allParksInState);
    // console.log(allParksInState.data[0].topics);

    for (var i = 0; i < allParksInState.data.length; i++) {
      for (var j = 0; j < allParksInState.data[i].topics.length; j++) {
        if (allParksInState.data[i].topics[j].name === userChoice) {
          parksWithTopics.push(allParksInState.data[i]);
        }
      }
    }
    console.log(parksWithTopics);
  });
});
