$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   **/
  var npsURL = "https://developer.nps.gov/api/v1/";
  var npsAPIkey = "PtYiGrnXjG4FL7v9tOprJACeJgJV4KxlTarrmWXF";

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
  /**
   * FUNCTION DEFINITIONS
   */
  function clearScreen() {
    originalPage.attr("style", "display:none");
  }

  /**
   * FUNCTION CALLS
   */

  /**
   * EVENT HANDLERS
   */
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
  //event listener for the newly generated buttons
  activityDiv.on("click", ".btn", function () {
    // console.log($(this).attr("button-value"));
    var val = $(this).attr("button-value");
    ajaxCallActivities(val);
  });

  //function for api call based on button clicked
  function ajaxCallActivities(val) {
    var activitiesParkUrl = `${npsURL}activities/parks/?api_key=${npsAPIkey}&q=${val}`;
    $.ajax({
      url: activitiesParkUrl,
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      for (i = 0; i < response.data[0].parks.length; i++) {
        if (response.data[0].parks[i].states == "GA") {
          console.log(response.data[0].parks[i]);
        }
      }
    });
  }
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

  assessmentDiv.on("click", ".btn", function () {
    ajaxTopics($(this).text());
  });

   //function for api call based on button clicked
   function ajaxTopics(topic) {
    var topicsURL = npsURL + "topics/parks/?api_key=" + npsAPIkey + "&q=" + topic;
    $.ajax({
      url: topicsURL,
      method: "GET",
    }).then(function (response) {

    });
  }

  // Function to add event listener to distance button
  distanceBtn.on("click", function (event) {
    console.log("Distance button event handler");
    clearScreen();
    distanceDiv.attr("style", "display:block");
  });
});
