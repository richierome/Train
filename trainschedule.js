// Steps to complete:
// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Calculate Total time

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCNPau7o_WF7dDY0QYngkRwf3sO-qTMskc",
  authDomain: "train-schedule-33fe0.firebaseapp.com",
  databaseURL: "https://train-schedule-33fe0.firebaseio.com",
  projectId: "train-schedule-33fe0",
  storageBucket: "",
  messagingSenderId: "21865877382"
};
  
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Train
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var time = moment($("#time").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency").val().trim();
    

    //console.log(currentTime);
    // Creates local "temporary" object for holding train data
    var trainSchedule = {
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,  
      
    };

  

  
    // Uploads train data to the database
    database.ref().push(trainSchedule);
  
    // Logs everything to console
    console.log(trainSchedule.name);
    console.log(trainSchedule.destination);
    console.log(trainSchedule.time);
    console.log(trainSchedule.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#name").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;
    var nextArrival = childSnapshot.val().nextArrival;
    // Train Info
    console.log(name);
    console.log(destination);
    console.log(time);
    console.log(frequency);
    // Calculate the next arrival  using hardcore math
    var nextArrival = moment(time,'HH:mm').add(frequency,'minutes').format("HH:mm");
    console.log(nextArrival);
    //First time with one year subtracted to make sure it comes before the current time.
	var timeConverted = moment(time, "HH:mm A").subtract(1, "years");
	console.log(timeConverted);

	//Current time
	var currentTime = moment();
	console.log("CURRENT TIME:" + currentTime);

	//Difference between times
	var diffTime = moment().diff(moment(timeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	//Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	// Mins until train arrives
	var minutesAway = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + minutesAway);

	// Next train arrival time using standard 12 hour time (i.e. 10:30 PM) to improve user experience.
	var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
	console.log("ARRIVAL TIME: " + nextArrival);

   
  // Create the new row
   var newRow = $("<tr>").append(
      $("<td>").text(name),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
 
  
  
  
  