$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   */

  /**
   * DOM ELEMENTS
   */
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
   * FUNCTION   CALLS
   */


  /**
   * EVENT HANDLERS
   */
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
      choice.attr("btn btn-sm btn-primary");
      choice.text(selections[i]);
      activityDiv.append(choice);
    }
  });

  // Event Listener - Loading Page Assessment Button
  assessmentBtn.on("click", function () {
    clearScreen();

    var topicsArray = ["Animals", "Arctic", "Caves, Caverns and Karst", "Forests and Woodlands", "Glaciers", "Lakes", "Monuments and Memorials", "Mountains", "Oceans", "Volcanoes", "Wilderness"];

    var questionHeader = $("<h1>");
    questionHeader.text("Which topic would you like to explore?");
    assessmentDiv.append(questionHeader);
    assessmentDiv.attr("class", ".display");

    for (i = 0; i < topicsArray.length; i++) {
    var option = $("<button type='button' class='btn btn-primary'>" + topicsArray[i] + "</button>");
    assessmentDiv.append(option);
    }
  });

  // Function to add event listener to distance button
  distanceBtn.on("click", function (event) {
    console.log("Distance button event handler");
    clearScreen();
    distanceDiv.attr("style","display:block");

  });
});
