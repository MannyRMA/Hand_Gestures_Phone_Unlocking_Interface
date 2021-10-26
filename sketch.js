/*
CPSC 581 Fall 2021 Project 2
Hand Gesture "Secret Handshake" Phone Unlokcing Interface
Justin Chow, Kaynen Mitchell, Manny Rodriguez, Zahra Ghavasieh
Code is inspired by The Coding Train / Daniel Shiffman teachable machine tutorial
https://thecodingtrain.com/TeachableMachine/1-teachable-machine.html
*/

// The video
let video;

// The starting output
let gesture_label = "Starting Please Show Hand Gesture...";
let emoji_feedback = "✋";

// The classifier
let classifier;

// gesture combination that unlocks the phone
let gesture_combination = ['Fist', 'Fist', 'Open Hand', 'Open Hand', 'Fist', 'Fist', 'Horns', 'Horns'];

// The array of gestures read
let gestures_read = [];

// counter for correct gestures detected
let correct_gesture_count = 0;

// model from the google teachable machine
let modelURL = 'https://teachablemachine.withgoogle.com/models/KHFQuOLKc/';

// Load the model
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}


// setup the environment/canvas
function setup() {
  createCanvas(640, 520);
  // Create the video
  video = createCapture(VIDEO);
  video.hide();

  // classify the video
  classify_Video();
}

// function that classifies the video
function classify_Video() {
  classifier.classify(video, Read_Results);
}

function draw() {
  background(0);

  // Render the video
  image(video, 0, 0, width, (height * 0.92));

  // Render the gesture label
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(gesture_label, width / 2, height - 16);

  // Render the emoji feedback
  textSize(56);
  text(emoji_feedback, width / 2, height / 1.3);
  

}

// Function to read the results of the camera interpretation every 2 seconds
function Read_Results(error, results) {
  window.setTimeout(function() {
    // handle an error if it occurs
    if (error) {
      console.error(error);
      return;
    }

    // phone has been unlocked, stop reading gestures
    if(correct_gesture_count === 7) {
      console.log("Phone has Unlocked");
      gesture_label = "Phone Unlocked!"
      emoji_feedback = "🔓";
      return;
    } 
    // read the gesture
    gesture_label = results[0].label;
    console.log("read a gesture: %s", gesture_label);

    // append the gesture into the array of read gestures
    gestures_read.push(gesture_label);

    // check if the gesture read is correct in the right spot, then output the check mark emoji
    if(gestures_read[correct_gesture_count] === gesture_combination[correct_gesture_count]) {
      // increase the counter for the next iteration
      correct_gesture_count++;
      emoji_feedback = "✔️";
      
    }

    // incorrect gesture has been read, reset the counter and the gestures read array and output the "x" emoji
    else if(gestures_read[correct_gesture_count] != gesture_combination[correct_gesture_count]) {
      correct_gesture_count = 0;
      gestures_read = [];
      emoji_feedback = "❌";
    
    }
    // Read the next gesture
      classify_Video();
      
  }, 1000); // Have a 1 second delay between gesture readings
  
}
