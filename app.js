// created firebase
// configuration of the firebase
var firebaseConfig = {
  apiKey: "AIzaSyCnEKMd4UBqKHurysJSCGjPBwqevrvWXqI",
  authDomain: "train-scheduler-32939.firebaseapp.com",
  databaseURL: "https://train-scheduler-32939.firebaseio.com",
  projectId: "train-scheduler-32939",
  storageBucket: "train-scheduler-32939.appspot.com",
  messagingSenderId: "537018225558",
  appId: "1:537018225558:web:0bbc5d02c585ab2d"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();
  
  // Button for adding train schedules
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTime = moment($("#first-train-time-input").val().trim(), "HH:mm").toString();
    var trainFreq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: firstTime,
      frequency: trainFreq
    };

    // Uploads new train schedule to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log("----------------------")
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);
  
    // alert("Train schedule successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });
  
  // Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var fireTN = childSnapshot.val().name;
    var fireD = childSnapshot.val().destination;
    var fireT = childSnapshot.val().start;
    var fireF = childSnapshot.val().frequency;
  
    // calculates the time untill the next train 
    var next = calculateTime(fireT, fireF);
    var nArrival = moment().add(next, "minutes");

    // Create the new row
    var newRow = $("<tr>").append(
      // Adds Train Name
      $("<td>").text(fireTN),
      // Adds Destination
      $("<td>").text(fireD),
      // Adds Frequency
      $("<td style='text-align: center'>").text(fireF),
      // Adds Next Arrival
      $("<td style='text-align: center'>").text(nArrival),
      // Adds Minutes Away
      $("<td style='text-align: center'>").text(next)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  
  }, function(errorObject) {

  // In case of error this will print the error
  console.log("The read failed: " + errorObject.code);
});
  
// Function to calculate the time difference
function calculateTime (timeFirst, timeFreq) {

  var tFreq = timeFreq;
  var firstTime = timeFirst;

  var firstTimeConverted = moment(firstTime, "hh:mm")
  console.log("FIRST TIME CONVERTED: " + firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFreq;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFreq - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

return tMinutesTillTrain;
}