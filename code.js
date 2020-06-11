

$(document).ready(function () {


  var theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var thisDay = moment().format('DDMMY');
  var rightNow = moment().format('DDMMY');
  var niceDateAndTime;
  var upNext;

  var goBack = 0;

  function upNextInterval() {

  }



  function getRecord(theText) {


    var getStorage = localStorage["davesOrganiser"];


    if (getStorage) {

      // get what we have in storage
      // if getStorageInfo is not empty then parse json otherwise set as empty array
      var results = getStorage ? JSON.parse(getStorage) : [];
      console.log(results);


      //Find index of specific object using findIndex method.    
      var myobjIndex = results.findIndex((obj => obj.record == theText));

      // if we have a match, get the record.
      if (myobjIndex !== -1) {

        for (i = 0; i < results.length; i++) {
          if (results[i].record == theText) {
            return (results[i].theText);
          }
        }
      }

      // we got nothing I'm afraid
      return;

    }
  }


  function doYourPlanningMagic(whichWay) {

    // check to see if this box is an old event. if so, do not proceed
   if ($("#" + whichWay).hasClass("plannerBoxPast") == false) {
 
      
   

    $("#hiddenInputBox").css("visibility", "visible");

    // set up edit box.

    var forwardedDiv = document.getElementById(whichWay);
    var theTime = forwardedDiv.getAttribute('data-time');
    var theDatetoShow = forwardedDiv.getAttribute('data-dd');
    var thisRecordID = theDatetoShow + theTime;
    $("#todaysDate").text("Enter task for " + niceDateAndTime + " at " + theTime);


    var thisString = getRecord(thisRecordID);

    $("#inputTextArea").val(getRecord(thisRecordID));
    // scroll the input box into view (primarily for mobile view.)
    $("#inputTextArea").get(0).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });


    // make the data/time go away.
    $("#cancelEdit").click(function () {
      $("#hiddenInputBox").css("visibility", "hidden");
    })

    // save save - save away. 
    $("#saveEdit").click(function () {

      // the user wrote this
      var userEdits = $("#inputTextArea").val();

      // get what we have in storage
      var getStorageInfo = localStorage["davesOrganiser"];

      // if getStorageInfo is not empty then parse json otherwise set as empty array
      var results = getStorageInfo ? JSON.parse(getStorageInfo) : [];

      //Find index of specific object using findIndex method.    
      objIndex = results.findIndex((obj => obj.record == thisRecordID));
      // console.log (objIndex);


      if (objIndex !== -1) {
        //Log object to Console.
        console.log("Before update: ", results[objIndex])

        //Update object's theText property to avoid duplication.

        results[objIndex].theText = userEdits;
      } else {
        results.push({
          record: thisRecordID,
          theText: userEdits
        });
      }

      // replace with new results
      localStorage["davesOrganiser"] = JSON.stringify(results);
      showThisDay(theDatetoShow);
      $("#hiddenInputBox").css("visibility", "hidden");
      // unbind the saved option to stop the annoying error of repeat saving.
      $("#saveEdit").off();

    })

    // lets check local storage for this record
    var getStorageInfo = localStorage["davesOrganiser"];
    }
  }

  function showThisDay(x) {

    function isEven(value) {
      if (value % 2 == 0)
        return true;
      else
        return false;
    }



    // variable to determine if we are looking at today or any other day
    var weAreHome = false;
    upNext = undefined;
    varRightNow = moment();
    varRightHour = varRightNow.hour();
    console.log("right now " + varRightHour);

    // if this has come from the window it will have a zero x
    // if that's the case, remove all active elements and start again.

    if (x.length > 2) {
      thisDay = x;

      // because javascript is like coding with a potato, and because the artifical placement
      // of a 0 in front of the i integer from the sender is still traunicated, and because
      // regix no longer works, I have to manually look for date ranges that are 7 as opposed 
      // to 8. and upon finding this, add it back into the begining of the string.

      if (thisDay.length == 7) {
        thisDay = "0" + thisDay;
      }
    }




    if (x !== 0) {
      $(".killme").remove();
    } //this resets the callander in light of a new cycle. 
    if (x === 0) {
      weAreHome = true;
    } // meaning that we are on the same day as the events we wish to see.

    // -1 and + 1 are used for plus month next and prev tabs
    // this information (the date) is stored in global variable - this day

    // this detects a referral augment for a month
    if ((x === -1) || (x === +1)) {
      $(".killme").remove();
      x = thisDay
    }

    now = parseInt(moment().format('DDMMY')).toString();

    // set up master date
    // nice date and time used globally
    niceDateAndTime = moment(thisDay.substr(2, 2) + "-" + thisDay.substr(0, 2) + "-" + thisDay.substr(4, 4)).format('dddd, MMMM Do YYYY');
    $("#currentDay").html("<b>" + niceDateAndTime + "</b>");

    if (x.toString().search(now) !== -1) {
      weAreHome = true;
      console.log("match found");
    };

    // so now we have our desired date - we need to search local storage
    // for events corresponding with ThisDay


    var getStorageInfo = localStorage["davesOrganiser"];

    // if getStorageInfo is not empty then parse json otherwise set as empty array
    var results = getStorageInfo ? JSON.parse(getStorageInfo) : [];



    // lets do all 24 hours in the day. x

    // for class purposes, we need to check if the date we are currently viewing, is before today
    // or after today.
    // time that is in the past will result in a blocked cell. time in the future will use the
    // even and odd visuals.



    var isPast = false;
    if (moment(rightNow.substr(2, 2) + "-" + rightNow.substr(0, 2) + "-" + rightNow.substr(4, 4)).isAfter(thisDay.substr(2, 2) + "-" + thisDay.substr(0, 2) + "-" + thisDay.substr(4, 4)) == true) {
      isPast = true;
    }


    for (i = 0; i < 24; i++) {


      var controlTab = $("<div>");
      controlTab.attr("class", "plannerBoxTab killme");
      controlTab.attr("id", "timeID" + i);
      var doTime = i;

      if (i === 12) {
        doTime = 12 + "pm";
      }
      if (i < 12) {
        doTime = i + "am";
      }
      if (i === 0) {
        doTime = 12 + "am"
      };
      if (i > 12) {
        doTime = (i - 12) + "pm";
      }


      controlTab.text(doTime);
      $("#dplanner").append(controlTab);

      var dumpThisTextInTheBox = "";

      // Create the planner box.
      //Find index of specific object using findIndex method.    
      objIndex = results.findIndex((obj => obj.record == thisDay + doTime));
      if (objIndex !== -1) {

        //Log object to Console.
        dumpThisTextInTheBox = results[objIndex].theText;

      }


      var plannerBox = $("<div>");

      // all upcoming days are either odd or even.
      if (isEven(i)) {
        plannerBox.attr("class", "plannerBoxEven killme");
      } else {
        plannerBox.attr("class", "plannerBoxOdd killme");
      }

      // dont show previous days as editable.
      if (isPast === true) {
        plannerBox.attr("class", "plannerBoxPast killme");
      }

      // this switch is specifically for today (as in now) and before now 
      if ((i <= varRightHour) && (isPast == false) && (rightNow == thisDay)) {
        plannerBox.attr("class", "plannerBoxPast killme");

      }
      if ((i === varRightHour) && (weAreHome) && (rightNow == thisDay)) {
        plannerBox.attr("class", "plannerBoxNow killme");
        var afterNow = i;
      }
      plannerBox.attr("data-date", x);
      plannerBox.attr("id", "pboxID" + i);
      plannerBox.attr("data-time", doTime);
      plannerBox.attr("data-dd", thisDay);


      $("#dplanner").append(plannerBox); // main box

      
      if (isPast === false) {
        $("#pboxID" + i).click(function () {
          doYourPlanningMagic(this.id, doTime);
        });
      }


      if (dumpThisTextInTheBox.length) {
        imsertThisText = "#pboxID" + i;
        $(imsertThisText).html(dumpThisTextInTheBox);


        // we want to display the next event in the schedule.
        // so send dumpThisTextInTheBox to upnext. 

        if ((afterNow < i) && (upNext == undefined)) {
          if (dumpThisTextInTheBox) {
            upNext = "Next task at " + doTime + " :" + dumpThisTextInTheBox;
          }
          else {
            upNext = "Nothing scheduled yet";
          }
          $("#upNext").text(upNext);
        }

        // if we got to the end of the day and there are no events
        // then inform user no events outstanding

        if ((i == 23) && (upNext == undefined)) {
          $("#upNext").text('No events outstanding');
        }
      }
    }
    // scroll to the active planner box if this day has an active
    // field class
    if (rightNow == thisDay) {
      $(".plannerBoxNow")[0].scrollIntoView();
    }
  }


  // this function is used to set up the main callender.
  // and uses info to submit to users.

  function setupPage(x) {

    // i HATE this code. There must be a better way to do this.

    if (x === 0) {
      goBack = 0;
    }

    if (x === -1) {
      goBack++;
      $(".dayinMomth").remove();
    }
    if (x === +1) {
      goBack--;
      $(".dayinMomth").remove();
    }


    // the true month
    var theTrueMonth = [parseInt(moment().subtract(0, 'month').format('MM'))];
    var theTrueMonth = theMonths[theTrueMonth - 1];

    // the momth and year
    var parseThis = moment().subtract(goBack, 'month').format('MM') + moment().subtract(0, 'month').format('YYYY');

    // the month today +/- mod
    var theMonthNumber = [parseInt(moment().subtract(goBack, 'month').format('MM'))];
    var theMonth = theMonths[theMonthNumber - 1];

    // the year today +/- mod
    var theYear = parseInt(moment().subtract(goBack, 'month').format('YYYY'));
    // the day today +/- mod
    var theDay = moment().subtract(goBack, 'month').format('DD');

    // set global variable
    thisDay = moment().subtract(goBack, 'month').format('DD') + moment().subtract(goBack, 'month').format('MM') + theYear;

    // do a strip of the first day of the month - Sun Mar 01 2020 00:00:00 GMT+1100
    var findMyFirstDay = moment([theYear, theMonthNumber - 1]).toString();
    var dateArray = findMyFirstDay.split(" ");

    // Tri helped me here.. the previous code was poor.

    var dowArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dow = dowArray.indexOf(dateArray[0]);

    $("#theMonth").html("<p>" + theMonth + " " + theYear + "</p>");

    var thisMonthHasHowMany = parseInt(moment().daysInMonth());
    var thisDayDiv;


    // 7 * 5 = 35 - the total number of squares in any given month
    for (i = 0; i < 35; i++) {

      thisDayDiv = $("<div>");


      // based on the way that the callender works, we want to roll out days
      // based on the correct start of the week so we add the day of the week (dow) to the counter
      // before we start showing the actual days.

      if (i >= dow && i <= thisMonthHasHowMany) {
        thisDayDiv.addClass("dayinMomth daysToDelete");
        thisDayDiv.text((i + 1) - dow);
        // if this block is the current day, give it a different backgdound

        if (i === (parseInt(theDay) + dow) - 1) {
          thisDayDiv.css("background-color", "#dce6f1");
        } else {
          thisDayDiv.css("background-color", "white");
        }

        thisDayDiv.css("cursor", "pointer");
        // this div presents the days of the month that are active.
        thisDayDiv.click(function () {
          $(".daysToDelete").css("background", "#fff");
          $(this).css("background", "#dce6f1");
          showThisDay(this.id);

        })
      } else {
        thisDayDiv.addClass("dayinMomth");
        thisDayDiv.text("");
        thisDayDiv.css("background-color", "#eff0f1");
      }

      thisDayDiv.attr("id", ((i - dow) + 1) + parseThis);

      $("#thedays").append(thisDayDiv);
    }

    showThisDay(x);

  }

  setupPage(0);



  $(".prev").click(function () {
    setupPage(-1);
  });
  $(".next").click(function () {
    setupPage(1);
  });

  // reset back to today.
  $("#showNow").click(function () {
    $(".dayinMomth").remove();
    $(".killme").remove();

    setupPage(0);
  });

  console.log("ready!");

  setInterval(function () {

    function hideagain() {
      document.getElementById("#upNext").style = "visibility:hidden;"
    }

    $("#upNext").fadeTo("slow", 0.15);
    $("#upNext").fadeTo("slow", 0.4);
    $("#upNext").fadeTo("slow", 0.7);



  }, 3000);


});