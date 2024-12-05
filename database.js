
import {
  getDatabase,
  ref,
  get,
  child,
  update,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

/// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFqgbA_t3EBVO21nW70umJOHX3UdRr9MY",
  authDomain: "parseit-8021e.firebaseapp.com",
  databaseURL: "https://parseit-8021e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parseit-8021e",
  storageBucket: "parseit-8021e.firebasestorage.app",
  messagingSenderId: "15166597986",
  appId: "1:15166597986:web:04b0219b1733780ae61a3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);
getParser(localStorage.getItem("user-parser"));

//for reload purposes
document.getElementById("home_btn").addEventListener("click", function () {
  location.reload();
});

document.getElementById("post_query_btn").addEventListener("click", function () {
  const student_id = localStorage.getItem("user-parser")
  const time = getCurrentTime();
  const post_id = Date.now().toString();
  const description = document.getElementById("queryDescription").value;
  if (description.trim() === "") {
    alert("Query description cannot be empty.");
    return;
  }

  submitQuery(localStorage.getItem("student_username"), time, description, post_id, student_id);

  // Clear the input field and close the modal after posting
  document.getElementById("queryDescription").value = ""; 
  closeModal(); // Call this function to close the query modal

})
async function getParser(student_id) {
  const postsRef = ref(database, `PARSEIT/username/`);

  return await get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();

      // Clear the feed container
      feedContainer.innerHTML = "";

        Object.keys(posts).forEach((postId) => {
        const post = posts[postId];

        if (post === student_id) {
          localStorage.setItem("student_username", postId);
          return postId;

        }
      })
    }
  });
}
const feedContainer = document.getElementById("feedContainer");

function openMenu(menuElement) {
  const menu = menuElement.querySelector('.menu-options');

  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
  } else {
    const allMenus = document.querySelectorAll('.menu-options');
    allMenus.forEach((m) => m.classList.remove('show'));
    menu.classList.add('show');
  }
}

function submitQuery(username, time, description, post_id, student_id) {

  // Add the post to Firebase
  update(ref(database, `PARSEIT/community/posts/${post_id}`), {
    student_id: student_id,
    username: username,
    time: time,
    description: description
  }).catch((error) => {
    console.error("Error posting query:", error);
    alert("Failed to post query. Please try again.");
  });
}

function loadPosts() {
  const postsRef = ref(database, `PARSEIT/community/posts/`);

  get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();

      feedContainer.innerHTML = "";

     Object.keys(posts).forEach((postId) => {
        const post = posts[postId];

        const postElement = document.createElement("div");
        postElement.classList.add("feed");

        postElement.innerHTML = `
          <div class="user">
              <div class="profile-pic">
                  <img src="profile-pic.jpg" alt="User Picture">
              </div>
              <div class="text">
                  <strong class="username">${post.username}</strong><br>
                  <small class="time-posted">${posts[postId].time}</small>
              </div>
          </div>
          <div class="post">
              <p>${post.description}</p>
          </div>
          <div class="feed-footer">
              <small class="view-comments" onclick="openAnswersModal(this.parentElement.parentElement, '${postId}')"> Answer</small>
          </div>
          <div class="comments"></div> <!-- Comments container -->
        `;

        // Add the post to the feed container
        feedContainer.prepend(postElement);
      });
    } else {
      console.log("No posts available.");
    }
  }).catch((error) => {
    console.error("Error loading posts:", error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const student_id = localStorage.getItem("user-parser");
  loadPosts(student_id);
});

function getCurrentTime() {
  const now = new Date();
  
  // Define an array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Get the current month name
  const month = monthNames[now.getMonth()]; // Get month index and map to name
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  // Format the time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

console.log("Active Post ID:", active_post_id);
console.log("Answers being loaded for Post ID:", postId);
//console.log(getCurrentTime());
// Post a comment to the active feed
//console.log("Active Post ID:", localStorage.getItem("active_post_id"));
function postComment(student_id, username, content) {
  const answer_id = Date.now().toString();
  const active_post = localStorage.getItem("active_post_id"); // Retrieve the active post ID
  update(ref(database, `PARSEIT/community/posts/${active_post}/answers/${answer_id}`), {
      student_id: student_id,
      content: content,
      username: username,
      time: getCurrentTime(),
  })
      .then(() => console.log("Answer posted successfully"))
      .catch((error) => {
          console.error("Error posting answer:", error);
          alert("Failed to post answer. Please try again.");
      });
}


document.getElementById("answer_btn").addEventListener("click", function () {
  addAnswer();
});
function addAnswer() {
  const student_id = localStorage.getItem("user-parser");
  const content = document.getElementById("newComment").value;
  if (content.trim() === "") {
    alert("Answer cannot be empty.");
    return;
  }

  postComment(student_id, localStorage.getItem("student_username"), content);
  document.getElementById("newComment").value = ""; // Clear input field
  const active_post_id = localStorage.getItem("active_post_id");
  loadAnswers(active_post_id); // Reload answers to include the new one
}

localStorage.getItem("active_post_id")

async function getUsername(student_id) {
  const postsRef = ref(database, `PARSEIT/username/`);

  return await get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();

      // Clear the feed container
      feedContainer.innerHTML = "";

      // Loop through each post and render it
      Object.keys(posts).forEach((postId) => {
        const post = posts[postId];
        // return console.log(posts[postId]);
        if (post === student_id) {
          return localStorage.setItem("active_username", postId);

        }
      })
    }
  });
}



function loadAnswers(postId) {

  const active_post_id = localStorage.getItem("active_post_id");

  if (!active_post_id) {
      console.error("No active post ID found in localStorage.");
      return;
  }
  const answersRef = ref(database, `PARSEIT/community/posts/${postId}/answers/`);

  get(answersRef)
      .then((snapshot) => {
          const modalBody = document.querySelector(".answers-modal .modal-body");
          modalBody.innerHTML = ""; // Clear previous answers

          if (snapshot.exists()) {
              const answers = snapshot.val();
              Object.keys(answers).forEach((answerId) => {
                  const answer = answers[answerId];
                  const answerElement = document.createElement("div");
                  answerElement.classList.add("answer");
                  answerElement.innerHTML = `
                      <div class="answer-header">
                          <strong>${answer.username}</strong> <small>${answer.time}</small>
                      </div>
                      <p>${answer.content}</p>
                  `;
                  modalBody.appendChild(answerElement);
              });
          } else {
              modalBody.innerHTML = "<p>No answers yet. Be the first to answer!</p>";
          }
      })
      .catch((error) => {
          console.error("Error loading answers:", error);
      });
}


