$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   */
  console.log("Hello Paradise");

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
  console.log("test")
  /**
   * EVENT HANDLERS
   */
  activityBtn.on("click", function () {
    clearScreen();
  });

  assessmentBtn.on("click", function(){

  });
      // Function to add event listener to distance button
    distanceBtn.on("click", function (event) {
        console.log("Distance button event handler")
    );
});
