// Initialize Firebase
var config = {
  apiKey: "AIzaSyCqizUwQytK17DRrz6eb5BLI1PBTiZhO6g",
  authDomain: "train-scheduler-c4b19.firebaseapp.com",
  databaseURL: "https://train-scheduler-c4b19.firebaseio.com",
  projectId: "train-scheduler-c4b19",
  storageBucket: "train-scheduler-c4b19.appspot.com",
  messagingSenderId: "819295876116"
};
firebase.initializeApp(config);



var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;



$("#addTrain").on("click", function() {

  trainName = $('#nameInput').val().trim();
  destination = $('#destinationInput').val().trim();
  firstTrainTime = $('#firstTrainInput').val().trim();
  frequency = $('#frequencyInput').val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded:  firebase.database.ServerValue.TIMESTAMP
  });

    return false;
});



database.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val());


  trainName = snapshot.val().trainName;
  destination = snapshot.val().destination;
  firstTrainTime = snapshot.val().firstTrainTime;
  frequency = snapshot.val().frequency;


  // moment.js methods for time calls and calculations.
  var firstTrainMoment = moment(firstTrainTime, 'HH:mm');
  var currentMoment = moment(); //

  var minutesSinceFirstArrival = currentMoment.diff(firstTrainMoment, 'minutes');
  var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
  var minutesAway = frequency - minutesSinceLastArrival;

  var nextArrival = currentMoment.add(minutesAway, 'minutes');
  var formatNextArrival = nextArrival.format("HH:mm");



  var tr = $('<tr>');
  var a = $('<td>');
  var b = $('<td>');
  var c = $('<td>');
  var d = $('<td>');
  var e = $('<td>');
  a.append(trainName);
  b.append(destination);
  c.append(frequency);
  d.append(formatNextArrival);
  e.append(minutesAway);
  tr.append(a).append(b).append(c).append(d).append(e);
  $('#newTrains').append(tr);


  }, function (errorObject) {


    console.log("The read failed: " + errorObject.code);

});
