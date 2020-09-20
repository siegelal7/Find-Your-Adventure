$(document).ready(function () {
  /**
   * GLOBAL VARIABLES
   **/

  var npsAPIkey = "PtYiGrnXjG4FL7v9tOprJACeJgJV4KxlTarrmWXF";
  var npsURL = `https://developer.nps.gov/api/v1/parks/?api_key=${npsAPIkey}&stateCode=`;
  var specificParkUrl = `https://developer.nps.gov/api/v1/parks/?api_key=${npsAPIkey}&parkCode=`;
  var allParksInState = {};
  var listOfParksArray = [];
  var mapQuestAPIkey = "UKFuk0Xe7EAKnJmVEVb3gfUAKRVOlAzR";
  var mapsUrl = `https://www.mapquestapi.com/directions/v2/route?key=${mapQuestAPIkey}&`;
  var userAddress;
  var userAdventure = "";
  var adventureArray = [];
  var question;
  var favoriteParks = [];

  /**
   * DOM ELEMENTS
   **/
  var landingPageHeader = $("#landingPageHeader");
  var topicsBtn = $("#topicsBtn");
  var distanceBtn = $("#distanceBtn");
  var activityBtn = $("#activityBtn");
  var adventureDiv = $("#adventureDiv");
  var adventureDivWrapper = $("#adventureDivWrapper");
  var distanceDiv = $("#distanceDiv");
  var parkListDiv = $("#parkListDiv");
  var container = $("#container");
  var originalPage = $("#originalPage");
  var addressSubmit = $("#addressSubmit");
  var inputAddress = $("#inputAddress");
  var inputCity = $("#inputCity");
  var inputState = $("#inputState");
  var inputZip = $("#inputZip");
  var parkDetails = $("#park-details");
  var parkDirectionsList = $("#directions-list");
  var parkDetailInfo = $("#park-detail-info");
  var parkName = $("#park-name");
  var parkCode = $("#park-code");
  var favoriteParksListEL = $("#FavoriteParksList");
  var navMenu = $("#navbarSupportedContent");
  var navMainPageOption = $("#nav-mainPage");
  var navSearchPageOption = $("#nav-search");
  var validationAlert = $("#validationAlert");
  var searchBtn = $("#searchBtn");
  /**
   * FUNCTION DEFINITIONS
   */

  function addGobackBtn(divName, currentPage) {
    var newRow = $("<row>");
    newRow.addClass("tobeDeleted");
    var newDiv = $("<div>");
    newDiv.addClass("col text-center");

    var goBackBtn = $("<button>");
    goBackBtn.text("Go Back");
    goBackBtn.addClass(" btn-primary selection-btn goBack");

    goBackBtn.attr("data-value", currentPage);
    newDiv.append(goBackBtn);
    newRow.append(newDiv);

    if (currentPage === "parkList") {
      adventureDivWrapper.children(".tobeDeleted").remove();
      adventureDivWrapper.prepend(newRow);
    } else if (
      currentPage === "parkDetails" ||
      currentPage === "parkDetailsMainMenu"
    ) {
      divName.prepend(newRow);
    } else {
      divName.append(newRow);
    }
  }

  // Function - Clears the Current Screen
  function clearScreen() {
    originalPage.attr("style", "display:none");
    distanceDiv.attr("style", "display:none");
    parkListDiv.attr("style", "display:none");
    parkDetails.attr("style", "display:none");
    adventureDiv.empty();
  }

  // Function - sets the array to localstorage value or leaves it blank if none; then populates list with faves
  function getFavoriteList() {
    var faves = JSON.parse(localStorage.getItem("parks"));
    if (faves !== null) {
      favoriteParks = faves;
    }
    for (i = 0; i < favoriteParks.length; i++) {
      var listItem = $("<li>");
      listItem.text(favoriteParks[i].park);
      listItem.attr("parkCode", favoriteParks[i].parkCode);
      listItem.attr("class", "favorite-list-item");
      //FIXME: click even listener for the list items
      listItem.on("click", function () {
        // console.log($(this).attr("parkCode"));
        $.ajax({
          url: specificParkUrl + $(this).attr("parkCode"),
          method: "GET",
        }).then(function (response) {
          // clearScreen();
          //ClearScreen() didn't have below functionality
          distanceDiv.addClass("displayNone");
          distanceDiv.attr("style", "display:none");
          // $("#directionsDiv").attr("style", "display:none");
          // console.log(response.data[0]);
          var data = response.data[0];
          var address = data.addresses[0];
          parkDetailsFunction(
            data.fullName,
            data.parkCode,
            data.operatingHours[0].description,
            JSON.stringify(data.operatingHours[0].standardHours),
            JSON.stringify(data.images),
            `${address.line1},  ${address.city}, ${address.stateCode} ${address.postalCode}`
          );
        });
      });
      favoriteParksListEL.append(listItem);
    }
  }

  // Function - AJAX Call using the State Code
  function ajaxCallNPSbyState(state) {
    var stateParksURL = npsURL + state;
    $.ajax({
      url: stateParksURL,
      method: "GET",
    }).then(function (response) {
      allParksInState = response;
    });
  }

  // Function - Creates a new page with buttons
  function createButtons(question, div, array) {
    clearScreen();

    var questionHeader = $("<h1>");
    questionHeader.text(question);
    div.append(questionHeader);
    div.attr("class", ".display");

    for (i = 0; i < array.length; i++) {
      var option = $("<button>");
      option.attr({
        type: "button",
        class: "btn btn-primary selection-btn",
        "data-value": "" + array[i],
      });
      option.text(array[i]);
      div.append(option);
    }
    addGobackBtn(div, "adventuresList");
    navMenu.attr("style", "display:block");
    navSearchPageOption.removeClass("disabled");
    div.attr("style", "display:");
  }

  // Function - Creates a List of Parks
  function createListOfParks(userChoice) {
    var parks;
    listOfParksArray = [];

    for (var i = 0; i < allParksInState.data.length; i++) {
      if (userAdventure === "Activity") {
        parks = allParksInState.data[i].activities;
      } else if (userAdventure === "Topics") {
        parks = allParksInState.data[i].topics;
      }

      for (var j = 0; j < parks.length; j++) {
        if (parks[j].name === userChoice) {
          listOfParksArray.push(allParksInState.data[i]);
        }
      }
    }

    noResultListOfParks();
  }

  // Function - Checks the List of Parks
  function noResultListOfParks() {
    if (listOfParksArray.length === 0) {
      adventureDiv.empty();

      var counter = 5;
      var errorHeader = $("<h1>");
      errorHeader.attr("style", "background-color: transparent");
      var errorHeaderSpan = $("<span>" + counter + "</span>.");
      errorHeader
        .text(
          "Sadly there are no national parks in your state that include your selection. Redirecting you to the last page in "
        )
        .append(errorHeaderSpan)
        .append(" seconds.");
      adventureDiv.append(errorHeader);

      var timer = setInterval(function () {
        counter--;
        errorHeaderSpan.text(counter);
        console.log(counter);

        if (counter === 0) {
          clearInterval(timer);
          createButtons(question, adventureDiv, adventureArray);
        }
      }, 1000);
    } else {
      createParksPage();
    }
  }

  // Function - Creates the Parks Page
  function createParksPage() {
    clearScreen();

    addGobackBtn(adventureDiv, "parkList");

    for (i = 0; i < listOfParksArray.length; i++) {
      // Adds Class Card-Deck to Activity Div
      adventureDiv.attr("class", "card-deck row row-cols-3 mt-5 mb-5");
      var colDiv = $("<div class='col mb-4'></div>");
      var cardDiv = $("<div class='card'></div>");

      var img = $(
        "<img class='card-img-top park-image' alt='park-image' style='height: 210px'/>"
      );
      if (listOfParksArray[i].images[0] != undefined) {
        img.attr("src", listOfParksArray[i].images[0].url);
      } else {
        img.attr(
          "src",
          "https://files.tripstodiscover.com/files/2018/08/32533575_1785635178193287_5065019941074239488_o.jpg"
        );
      }
      cardDiv.attr(
        "data-value",
        `${listOfParksArray[i].addresses[0].line1},  ${listOfParksArray[i].addresses[0].city}, ${listOfParksArray[i].addresses[0].stateCode} ${listOfParksArray[i].addresses[0].postalCode}`
      );

      cardDiv.attr({
        name: listOfParksArray[i].fullName,
        operatingHours: listOfParksArray[i].operatingHours[0].description,
        standardHours: JSON.stringify(
          listOfParksArray[i].operatingHours[0].standardHours
        ),
        parkCode: listOfParksArray[i].parkCode,
        entranceFees: listOfParksArray[i].entranceFees[0].cost,
        images: JSON.stringify(listOfParksArray[i].images),
        id: "optionCard",
      });

      // Creates Card-Body Div
      var cardBodyDiv = $("<div class='card-body'></div>");
      // Creates Card Header
      var h5 = $("<h5 class='card-title'></h5>");
      h5.text(listOfParksArray[i].fullName);
      // Creates Card Paragraph
      var p = $("<p class='card-text'></p>");
      p.text(
        `${listOfParksArray[i].addresses[0].city}, ${listOfParksArray[i].addresses[0].stateCode}`
      );

      cardBodyDiv.append(h5, p);
      cardDiv.append(img, cardBodyDiv);
      colDiv.append(cardDiv);
      adventureDiv.append(colDiv);
    }
  }

  // Function - Parse Parks' Standard Hours
  function parseStandardHours(hoursString) {
    var standardHrs = JSON.parse(hoursString);

    var list = $("<ul class='hours'>");
    var listEl = $("<li>");
    listEl.text("Monday: " + standardHrs.Monday);
    list.append(listEl);

    listEl = $("<li>");
    listEl.text("Tuesday: " + standardHrs.Tuesday);
    list.append(listEl);

    listEl = $("<li>");
    listEl.text("Wednesday: " + standardHrs.Wednesday);
    list.append(listEl);

    listEl = $("<li>");
    listEl.text("Thursday: " + standardHrs.Thursday);
    list.append(listEl);
    parkDetailInfo.append(list);

    listEl = $("<li>");
    listEl.text("Friday: " + standardHrs.Friday);
    list.append(listEl);
    listEl = $("<li>");
    listEl.text("Saturday: " + standardHrs.Saturday);
    list.append(listEl);
    listEl = $("<li>");
    listEl.text("Sunday: " + standardHrs.Sunday);
    list.append(listEl);
  }

  //Function - Parse Park Images
  function parseParkImage(imagesObject) {
    var imagesArray = JSON.parse(imagesObject);

    if (imagesArray.length > 1) {
      var carouselDiv = $(
        "<div id='carouselExampleControls' class='carousel slide' data-ride='carousel'></div>"
      );
      var carouselInnerDiv = $("<div class='carousel-inner'></div>");
      var carouselItemDiv = $("<div class='carousel-item active'></div>");
      var imageEl = $("<img>");
      imageEl.attr({
        src: imagesArray[0].url,
        alt: imagesArray[0].altText,
        id: "park-detail-img" + i,
        class: "d-block w-100 h-100",
      });
      carouselItemDiv.append(imageEl);
      carouselInnerDiv.append(carouselItemDiv);

      for (var i = 1; i < imagesArray.length; i++) {
        var carouselItemDiv2 = $("<div class='carousel-item'></div>");
        var imageEl2 = $("<img>");
        imageEl2.attr({
          src: imagesArray[i].url,
          alt: imagesArray[i].altText,
          id: "park-detail-img" + i,
          class: "d-block w-100 h-100",
        });
        carouselItemDiv2.append(imageEl2);
        carouselInnerDiv.append(carouselItemDiv2);
      }

      var carouselCtrlPrev = $(
        "<a class='carousel-control-prev' href='#carouselExampleControls' role='button' data-slide='prev'>"
      );
      var prevSpan = $(
        "<span class='carousel-control-prev-icon' aria-hidden='true'></span>"
      );
      var prevSpan2 = $("<span class='sr-only'>Previous</span>");
      carouselCtrlPrev.append(prevSpan, prevSpan2);
      var carouselCtrlNext = $(
        "<a class='carousel-control-next' href='#carouselExampleControls' role='button' data-slide='next'>"
      );
      var nextSpan = $(
        "<span class='carousel-control-next-icon' aria-hidden='true'></span>"
      );
      var nextSpan2 = $("<span class='sr-only'>Next</span>");
      carouselCtrlNext.append(nextSpan, nextSpan2);

      carouselDiv.append(carouselInnerDiv, carouselCtrlPrev, carouselCtrlNext);
      parkDetailInfo.append(carouselDiv);
    }
  }

  /**
   * FUNCTION CALLS
   */
  getFavoriteList();
  /**
   * EVENT HANDLERS
   */

  // Event Listener - User clicks Address Submit, Address is stored, Call AJAX
  addressSubmit.on("click", function (event) {
    event.preventDefault();

    if (inputState.val() == "none") {
      validationAlert.attr("style", "display:block");
    } else {
      distanceDiv.attr("class", "displayNone");
      distanceDiv.attr("style", "display:none");
      originalPage.attr("class", "display");
      originalPage.attr("style", "display:Block");
      navMenu.attr("style", "display:block");
      userAddress = `${inputAddress.val()}, ${inputCity.val()}, ${inputState.val()} ${inputZip.val()}`;

      ajaxCallNPSbyState(inputState.val());
    }
  });

  // FIXME: not working from the final results page for some reason
  searchBtn.on("click", function (event) {
    event.preventDefault();

    var term = $(this).siblings().val();
    var searchURL = `https://developer.nps.gov/api/v1/parks/?api_key=PtYiGrnXjG4FL7v9tOprJACeJgJV4KxlTarrmWXF&q=${term}`;

    $.ajax({
      url: searchURL,
      method: "GET",
    }).then(function (response) {
      clearScreen();

      for (i = 0; i < response.data.length; i++) {
        // Adds Class Card-Deck to Activity Div
        var results = response.data[i];
        adventureDiv.attr("class", "card-deck row row-cols-3 mt-5");
        var colDiv = $("<div class='col mb-4'></div>");
        var cardDiv = $("<div class='card'></div>");

        var img = $(
          "<img class='card-img-top park-image' alt='park-image' style='height: 210px'/>"
        );
        if (results.images[0] != undefined) {
          img.attr("src", results.images[0].url);
        } else {
          img.attr(
            "src",
            "https://files.tripstodiscover.com/files/2018/08/32533575_1785635178193287_5065019941074239488_o.jpg"
          );
        }
        cardDiv.attr(
          "data-value",
          `${results.addresses[0].line1},  ${results.addresses[0].city}, ${results.addresses[0].stateCode} ${results.addresses[0].postalCode}`
        );

        cardDiv.attr({
          name: results.fullName,
          operatingHours: results.operatingHours[0].description,
          standardHours: JSON.stringify(
            results.operatingHours[0].standardHours
          ),
          parkCode: results.parkCode,
          entranceFees: results.entranceFees[0].cost,
          images: JSON.stringify(results.images),
          id: "optionCard",
        });

        // Creates Card-Body Div
        var cardBodyDiv = $("<div class='card-body'></div>");
        // Creates Card Header
        var h5 = $("<h5 class='card-title'></h5>");
        h5.text(results.fullName);
        // Creates Card Paragraph
        var p = $("<p class='card-text'></p>");
        p.text(
          `${results.addresses[0].city}, ${results.addresses[0].stateCode}`
        );

        cardBodyDiv.append(h5, p);
        cardDiv.append(img, cardBodyDiv);
        colDiv.append(cardDiv);
        adventureDiv.append(colDiv);
      }
    });
  });

  // ACTIVITY BUTTON SECTION START!

  // Event Listener - User clicks Activity Button, Populate the Screen with Activities
  activityBtn.on("click", function () {
    userAdventure = $(this).attr("data-value");
    adventureArray = [
      "Camping",
      "Fishing",
      "Biking",
      "Shopping",
      "Guided Tours",
      "Wildlife Watching",
      "Hiking",
      "Playground",
      "Junior Ranger Program",
      "Food",
      "Astronomy",
      "Boating",
      "Living History",
      "Skiing",
      "Swimming",
    ];

    question = "Which of the following activities most interests you?";
    createButtons(question, adventureDiv, adventureArray);
  });

  // Event Listener - User clicks Topics Button, Populate the Screen with Topics
  topicsBtn.on("click", function () {
    userAdventure = $(this).attr("data-value");
    adventureArray = [
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

    question = "Which topic would you like to explore?";
    createButtons(question, adventureDiv, adventureArray);
  });

  // Event Listener - User clicks Activity or Topic, Create list of Parks
  adventureDiv.on("click", ".btn", function () {
    var userChoice = $(this).text();
    createListOfParks(userChoice);
  });

  //FIXME: FIXME: effffffff
  function parkDetailsFunction(
    name,
    parkCode,
    operatingHours,
    standardHours,
    images,
    to
  ) {
    clearScreen();

    navMenu.attr("style", "display:block");
    navSearchPageOption.addClass("disabled");

    var parkNameText = name;
    //had to add park code so that localstorage could search by code it's hidden on page tho
    var parkCodeText = parkCode;
    // var parkNameText = $(this).children("img").attr("name");
    var parkOperatingHours = operatingHours;
    // var parkOperatingHours = $(this).children("img").attr("operatingHours");
    parkName.text(parkNameText);
    // parkCode.text(parkCodeText);
    var newParaEl = $("<p>").text(
      "Current Operating Details: " + parkOperatingHours
    );
    parkDetailInfo.append(newParaEl);
    newParaEl = $("<p class='operating-hours'>").text(
      "Standard Operating Hours"
    );
    parkDetailInfo.append(newParaEl);
    parseStandardHours(standardHours);
    parseParkImage(images);

    // Favorite button
    var favoriteBtn = $("<button>");
    favoriteBtn.text("Favorite");
    favoriteBtn.attr("id", "favoriteBtn");
    favoriteBtn.attr("class", "btn btn-primary btn-sm");
    parkDetailInfo.prepend(favoriteBtn);
    addGobackBtn(parkDetails, "parkDetailsMainMenu");

    mapsUrl += `from=${userAddress}&to=${to}`;
    $.ajax({
      url: mapsUrl,
      method: "GET",
    }).then(function (response) {
      parkDetails.attr({
        style: "display:block",
        class: "mb-5",
      });
      var orderedDirectionsList = $("<ol>");
      parkDirectionsList.append(orderedDirectionsList);

      for (var i = 0; i < response.route.legs[0].maneuvers.length; i++) {
        // console.log(response.route.legs[0].maneuvers[i].narrative);

        var newParaEl = $("<li>");
        newParaEl.text(response.route.legs[0].maneuvers[i].narrative);

        orderedDirectionsList.append(newParaEl);
      }
      var totalDistance = $("<p>").text(
        `Total Distance: ${response.route.distance} miles`
      );
      var travelTime = $("<p>").text(
        `Total time: ${response.route.formattedTime}`
      );
      parkDirectionsList.prepend(totalDistance, travelTime);
    });
  }

  // Event Listener - User clicks one Park, Display Park Details
  adventureDiv.on("click", ".card", function () {
    //clearScreen();
    adventureDiv.attr("style", "display:none");
    adventureDivWrapper.children(".tobeDeleted").attr("style", "display:none");

    // Fill in the selected park detail
    var parkNameText = $(this).attr("name");
    //had to add park code so that localstorage could search by code
    var parkCodeText = $(this).attr("parkCode");
    var parkOperatingHours = $(this).attr("operatingHours");
    var cost = parseFloat($(this).attr("entranceFees"));

    parkName.text(parkNameText);
    parkCode.text(parkCodeText);
    var newParaEl = $("<p>").text("Current Operating Details");
    var costParaEl = $("<p>").text("Entrance Fee: $" + cost);
    costParaEl.attr("style", "text-align: left");
    newParaEl.attr("style", "text-decoration: underline");
    parkDetailInfo.append(costParaEl, newParaEl, parkOperatingHours);
    newParaEl = $("<p class='operating-hours'>").text(
      "Standard Operating Hours"
    );
    parkDetailInfo.append(newParaEl);
    parseStandardHours($(this).attr("standardHours"));
    parseParkImage($(this).attr("images"));

    var address = $("<p>").text("Address: " + $(this).attr("data-value"));

    var mapsQueryUrl = "";
    mapsQueryUrl =
      mapsUrl + `from=${userAddress}&to=${$(this).attr("data-value")}`;
    //TODO: here's the favorite button for now

    var favoriteBtn = $("<button>");
    favoriteBtn.append(
      "<svg width='1.6em' height='1.6em' viewBox='0 0 16 16' class='bi bi-star' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'/></svg>"
    );
    favoriteBtn.attr("id", "favoriteBtn");
    favoriteBtn.attr("class", "btn btn-primary btn-sm mr-3");
    parkName.prepend(favoriteBtn);
    addGobackBtn(parkDetails, "parkDetails");

    $.ajax({
      url: mapsQueryUrl,
      method: "GET",
    }).then(function (response) {
      parkDetails.attr({
        style: "display:block",
        class: "mb-5",
      });
      var orderedDirectionsList = $("<ol>");
      parkDirectionsList.append(orderedDirectionsList);

      for (var i = 0; i < response.route.legs[0].maneuvers.length; i++) {
        var newParaEl = $("<li>");
        newParaEl.text(response.route.legs[0].maneuvers[i].narrative);

        orderedDirectionsList.append(newParaEl);
      }
      var totalDistance = $("<p>").text(
        `Total Distance: ${response.route.distance} miles`
      );
      var travelTime = $("<p>").text(
        `Total Time: ${response.route.formattedTime}`
      );
      parkDirectionsList.prepend(address, totalDistance, travelTime);
    });
  });

  //event listener for add to favorites button
  $(this).on("click", "#favoriteBtn", function () {
    var nameOfPark = parkName.text();
    var code = parkCode.text();
    var faveObject = {
      park: nameOfPark,
      parkCode: code,
    };
    // found this function here (answer #3): https://stackoverflow.com/questions/22844560/check-if-object-value-exists-within-a-javascript-array-of-objects-and-if-not-add
    const checkArrayForObj = (obj) => obj.park === faveObject.park;
    if (favoriteParks.some(checkArrayForObj) == false) {
      favoriteParks.push(faveObject);
    }
    localStorage.setItem("parks", JSON.stringify(favoriteParks));
  });

  // Event Listener to return to main page
  $("#mainMenuBtn").on("click", function (event) {
    event.preventDefault();

    distanceDiv.attr("class", "display");
    distanceDiv.attr("style", "display:block");

    originalPage.attr("class", "displayNone");
    originalPage.attr("style", "display:none");

    navMenu.attr("style", "display:none");
  });

  $(document).on("click", ".goBack", function (event) {
    event.preventDefault();
    if ($(this).attr("data-value") === "parkDetails") {
      adventureDiv.attr("style", "display:");
      parkDetails.attr("class", "displayNone");
      parkDetails.attr("style", "display:None");
      parkDetailInfo.empty();
      parkDirectionsList.empty();
      parkDetails.children(".tobeDeleted").remove();
      addGobackBtn(adventureDiv, "parkList");
    } else if ($(this).attr("data-value") === "parkDetailsMainMenu") {
      distanceDiv.addClass("display");
      distanceDiv.attr("style", "display:block");
      parkDetails.addClass("displayNone");
      parkDetails.attr("style", "display:none");
      parkDetailInfo.empty();
      parkDirectionsList.empty();
      parkDetails.children(".tobeDeleted").remove();
    } else {
      adventureDiv.attr("style", "display:none");
      originalPage.addClass(".display");

      originalPage.attr("style", "display:block");
      adventureDivWrapper.children(".tobeDeleted").remove();
      adventureDiv.empty();
    }
  });

  navMainPageOption.on("click", function (event) {
    event.preventDefault();

    distanceDiv.addClass("display");
    distanceDiv.attr("style", "display:block");

    adventureDiv.attr("style", "display:none");
    adventureDivWrapper.children(".tobeDeleted").remove();
    adventureDiv.empty();

    originalPage.addClass(".displayNone");
    originalPage.attr("style", "display:none");

    parkDetails.attr("style", "display:none");
    parkDetailInfo.empty();
    parkDirectionsList.empty();
    parkDetails.children(".tobeDeleted").remove();

    navMenu.attr("style", "display:none");
  });

  navSearchPageOption.on("click", function (event) {
    event.preventDefault();

    distanceDiv.addClass("displayNone");
    distanceDiv.attr("style", "display:none");

    adventureDiv.attr("style", "display:none");
    adventureDivWrapper.children(".tobeDeleted").remove();
    adventureDiv.empty();

    originalPage.addClass(".display");
    originalPage.attr("style", "display:block");

    parkDetails.attr("style", "display:none");
    parkDetailInfo.empty();
    parkDirectionsList.empty();
    parkDetails.children(".tobeDeleted").remove();
  });
});
