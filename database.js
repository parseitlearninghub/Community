
import { getDatabase,
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

document.getElementById("post_query_btn").addEventListener("click", function() {
  const student_id = localStorage.getItem("user-parser")
  const time =  getCurrentTime();
  const post_id = Date.now().toString();
  const description = document.getElementById("queryDescription").value;
  // const username = localStorage.getItem("student_username");
 // console.log(username, time, description, post_id, student_id);
  submitQuery(localStorage.getItem("student_username"), time, description, post_id, student_id);
//console.log(username, time, title, description, post_id, student_id );
})
// console.log(getParser("7210706"));
async function getParser(student_id) {
  const postsRef = ref(database, `PARSEIT/username/`);
    
  return await get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();

      // Clear the feed container
      feedContainer.innerHTML = "";

      // Loop through each post and render it
      Object.keys(posts).forEach((postId) => {
        const post = posts[postId];
       
        if(post === student_id) {
          localStorage.setItem("student_username", postId);
          return  postId;
          
        }
      })
  }
}); 
}
// Reference to the feed container in the DOM
const feedContainer = document.getElementById("feedContainer");

// Submit query and add to Firebase + display on the feed
// Function to open/close the three-dot menu
function openMenu(menuElement) {
  // Find the corresponding menu for the clicked three dots
  const menu = menuElement.querySelector('.menu-options');
  
  // Toggle the 'show' class to display or hide the menu
  if (menu.classList.contains('show')) {
      menu.classList.remove('show');
  } else {
      // Close any other open menus before opening the new one
      const allMenus = document.querySelectorAll('.menu-options');
      allMenus.forEach((m) => m.classList.remove('show'));
      menu.classList.add('show');
  }
}

// Add the menu options in each post
function submitQuery(username, time, description, post_id, student_id) {
  
  // Add the post to Firebase
  update(ref(database, `PARSEIT/community/posts/${post_id}`), {
      student_id: student_id,
      username : username,
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

      // Clear the feed container
      feedContainer.innerHTML = "";

      // Loop through each post and render it
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
              <small class="view-comments" onclick="openAnswersModal(this.parentElement.parentElement, ${postId})"> Answer</small>
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

// Call this function after the page has loaded
document.addEventListener("DOMContentLoaded", function () {
  const student_id = localStorage.getItem("user-parser");
  loadPosts(student_id);
});
//localStorage.setItem("user-parser", "7210706");

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// console.log(getUsername(localStorage.getItem("student_id")));
// function displayComments(feedElement) {
//   const commentsContainer = feedElement.querySelector(".comments");
//   const modalBody = document.querySelector(".answers-modal .modal-body");
//   modalBody.innerHTML = commentsContainer.innerHTML;
// }
console.log(getCurrentTime());
// Post a comment to the active feed
function postComment(student_id, username, content) {
  //const comment = document.getElementById("newComment").value;
  const answer_id = Date.now().toString();
  const active_post = localStorage.getItem("active_post_id");
  update(ref(database, `PARSEIT/community/posts/${active_post}/answers/${answer_id}`), {
      student_id: student_id,
      content : content,
      username : username,
      time: getCurrentTime(),
  }).catch((error) => {
      console.error("Error posting query:", error);
      alert("Failed to post query. Please try again.");
  });
}
document.getElementById("answer_btn").addEventListener("click", function() {
  addAnswer();
});
function addAnswer() {
  const student_id = localStorage.getItem("user-parser")
  const content = document.getElementById("newComment").value;
  postComment(student_id, localStorage.getItem("student_username") , content) 
  
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
            if(post === student_id) {
              return localStorage.setItem("active_username", postId);

            }
          })
      }
  }); 
}