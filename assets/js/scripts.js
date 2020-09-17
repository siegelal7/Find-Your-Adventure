$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   **/
  var npsAPIkey = "PtYiGrnXjG4FL7v9tOprJACeJgJV4KxlTarrmWXF";
  var npsURL = `https://developer.nps.gov/api/v1/parks/?api_key=${npsAPIkey}&stateCode=`;
  var allParksInState = {};
  var mapQuestAPIkey = "UKFuk0Xe7EAKnJmVEVb3gfUAKRVOlAzR";
  var mapsUrl = `http://www.mapquestapi.com/directions/v2/route?key=${mapQuestAPIkey}&`;
  var userAddress;
  
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
    var stateParksURL = npsURL+=state;
    $.ajax({
      url: stateParksURL,
      method: "GET",
    }).then(function (response) {
      allParksInState = response;
    });
  }

  /**
   * FUNCTION CALLS
   */

  /**
   * EVENT HANDLERS
   */

  addressSubmit.on("click", function (event) {
    event.preventDefault();
    distanceDiv.attr("class", "displayNone");
    originalPage.attr("class", "display");
    userAddress = `${inputAddress.val()}, ${inputCity.val()}, ${inputState.val()} ${inputZip.val()}`;

    ajaxCallState(inputState.val());
  });


  // ACTIVITY BUTTON SECTION START!
  activityBtn.on("click", function () {
    clearScreen();

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
    var val = $(this).attr("button-value");

    for (i = 0; i < allParksInState.data.length; i++) {
      var parks = allParksInState.data[i].activities;

      for (x = 0; x < parks.length; x++) {
        if (parks[x].name == val) {
          parksThatHaveActivity.push(allParksInState.data[i]);
        }
      }
    }

    clearScreen();
    for (y = 0; y < parksThatHaveActivity.length; y++) {
      
      // Adds Class Card-Deck to Activity Div
      activityDiv.attr("class", "card-deck row row-cols-3 mt-5");
        // Creates Col Div
        var colDiv = $("<div class='col mb-4'></div>");
          // Creates Card Div
          var cardDiv = $("<div class='card'></div>");
            // Creates Image
            var img = $("<img class='card-img-top park-image' alt='park-image'/>");
              if (parksThatHaveActivity[y].images[0] != undefined) {
                img.attr("src", parksThatHaveActivity[y].images[0].url);
              } else {
                img.attr(
                  "src",
                  "https://files.tripstodiscover.com/files/2018/08/32533575_1785635178193287_5065019941074239488_o.jpg"
                );
              }
              img.attr(
                "data-value",
                `${parksThatHaveActivity[y].addresses[0].line1},  ${parksThatHaveActivity[y].addresses[0].city}, ${parksThatHaveActivity[y].addresses[0].stateCode} ${parksThatHaveActivity[y].addresses[0].postalCode}`
              );

            // Creates Card-Body Div
            var cardBodyDiv = $("<div class='card-body'></div>");
              // Creates Card Header
              var h5 = $("<h5 class='card-title'>Header goes here</h5>");
              // Creates Card Paragraph
              var p = $(
                "<p class='card-text'>Lorem Ipsum blah blah blah blha lbskjdfowiej woijfwo</p>"
              );

      cardBodyDiv.append(h5, p);
      cardDiv.append(img, cardBodyDiv);
      colDiv.append(cardDiv);
      activityDiv.append(colDiv);
    }
  });

  activityDiv.on("click", ".park-image", function () {
    clearScreen();

    mapsUrl += `from=${userAddress}&to=${$(this).attr("data-value")}`;
    $.ajax({
      url: mapsUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  });

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
