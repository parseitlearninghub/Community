
import {
  getDatabase,
  ref,
  get,
  child,
  update,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFqgbA_t3EBVO21nW70umJOHX3UdRr9MY",
  authDomain: "parseit-8021e.firebaseapp.com",
  databaseURL: "https://parseit-8021e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parseit-8021e",
  storageBucket: "parseit-8021e.firebasestorage.app",
  messagingSenderId: "15166597986",
  appId: "1:15166597986:web:04b0219b1733780ae61a3b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

const studentId = localStorage.getItem("user-parser");
const overlay = document.getElementById("overlay");
const queryModal = document.getElementById("queryModal");
const answersModal = document.getElementById("answersModal");
let activeFeed = null; 

document.getElementById("community_home_btn").addEventListener("click", function () {
  location.reload();
});


//executed when clicking the have a question div
document.getElementById("postbtn").addEventListener("click", function() {
  overlay.classList.add("active");
  queryModal.classList.add("active");
});
// open the answer section
function openAnswersModal(feedElement, postId) {
  localStorage.setItem("active_post_id", postId);
  overlay.classList.add("active");
  answersModal.classList.add("active");
  activeFeed = feedElement; 
  loadAnswers(postId);
}
//close the answer section
document.getElementById("close_answermodal").addEventListener("click", function() {
  overlay.classList.remove("active");
  answersModal.classList.remove("active");
  activeFeed = null;
});

// to close the post query section
function closeModal() {
  overlay.classList.remove("active");
  queryModal.classList.remove("active");
}

document.getElementById("close_btn").addEventListener("click", closeModal);

// Consolidated toggle logic
function toggleSection(buttonId, sectionId) {
  const icons = document.querySelectorAll('.header_icons div');
  const sections = document.querySelectorAll('.section');

  // Deactivate all icons and sections
  icons.forEach(icon => icon.classList.remove('active'));
  sections.forEach(section => section.classList.remove('active'));

  // Activate the clicked icon and corresponding section
  document.getElementById(buttonId).classList.add('active');
  document.getElementById(sectionId).classList.add('active');
}

function setupToggleEvent(buttonId, sectionId) {
  document.getElementById(buttonId).addEventListener('click', () => {
    toggleSection(buttonId, sectionId);
  });
}

setupToggleEvent('notification_btn', 'notif_page_section');
setupToggleEvent('messages_page_btn', 'messages_page_section');
setupToggleEvent('user_profile_btn', 'profile_mgmt_section');
setupToggleEvent('community_home_btn', 'community_home_section');

const username = localStorage.getItem("student_username");
if (username) {
    document.getElementById('username-placeholder').textContent = username;
} else {
  document.getElementById('username-placeholder').textContent = "Parser";
}

async function getParser(student_id) {
  const postsRef = ref(database, `PARSEIT/username/`);

  return await get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();
      Object.keys(posts).forEach((postId) => {
        const post = posts[postId];
        if (post === student_id) {
          localStorage.setItem("student_username", postId);
          const username = localStorage.getItem("student_username");
          if (username) {
            document.getElementById('username-placeholder').textContent = username;
          }
        }
      });
    }
  });
}
getParser(studentId);

const feedContainer = document.getElementById("feedContainer");

document.getElementById("post_query_btn").addEventListener("click", function () {
  const student_id = studentId;
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
  closeModal(); 
  loadPosts();
})
const time = Date.now(); // Current time as a numeric timestamp
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
  const currentUserId = studentId;
  const currentUsername = localStorage.getItem("student_username"); 

  get(postsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const posts = snapshot.val();
        feedContainer.innerHTML = ""; // Clear the container before loading new posts

        Object.keys(posts).forEach((postId) => {
          const post = posts[postId];
          console.log("Post time:", post.time);
          const menuId = `menu-${postId}`;
          const editId = `edit-${postId}`;
          const reportId = `report-${postId}`;
          const answerId = `answer-${postId}`;
          
          // Get the number of answers (comments) for the post
          const answersCount = post.answers ? Object.keys(post.answers).length : 0;
          const answerText = answersCount === 0 ? "Answer" : `${answersCount} Answer${answersCount > 1 ? "s" : ""}`;

          const postElement = document.createElement("div");
          postElement.classList.add("feed");

          postElement.innerHTML = `
            <div class="user">
                <div class="profile-pic">
                    <img src="images/profile-pic.jpg" alt="User Picture">
                </div>
                <div class="text">
                    <strong class="username">${post.username}</strong><br>
                    <small class="time-posted">${formatTime(post.time)}</small>
                </div>
                <div class="menu-icon" id="${menuId}">
                    &#8942; 
                    <div class="menu-options">
                        ${post.username === currentUsername ? 
                            `<div class="menu-item" id="${editId}">
                                <img src="images/edit_icon.png"/>
                                Edit</div>` 
                            : 
                            `<div class="menu-item" id="${reportId}"> 
                                <img src="images/report.png" />
                                Report</div>`}
                    </div>
                </div>
            </div>
            <div class="post">
                <p>${post.description}</p>
            </div>
            <div class="feed-footer">
                <small class="view-comments" id="${answerId}">${answerText}</small>
            </div>
            <div class="comments"></div> <!-- Comments container -->
          `;

          feedContainer.prepend(postElement);

          document.getElementById(menuId).addEventListener("click", () => toggleMenu(postElement));

          // Add event listeners for Edit, Report, and Answer actions
          if (post.username === currentUsername) {
            // Only allow the post owner to edit
            document.getElementById(editId).addEventListener("click", () => editPost(postId));
          } else {
            // Otherwise, only show the Report option
            document.getElementById(reportId).addEventListener("click", () => reportPost(postId));
          }
          document.getElementById(answerId).addEventListener("click", () => openAnswersModal(postElement, postId));
        });
      } else {
        console.log("No posts available.");
      }
    })
    .catch((error) => {
      alert("Error loading posts:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const student_id = studentId;
  loadPosts(student_id);
});

// The function to post a comment (answer) to the correct post in Firebase
function postComment(student_id, username, content) {
  const answer_id = Date.now().toString();
  const active_post = localStorage.getItem("active_post_id");

  if (!active_post) {
    alert("No active post found.");
    return;
  }


  // Adding the answer to the correct post's answers
  update(ref(database, `PARSEIT/community/posts/${active_post}/answers/${answer_id}`), {
    student_id: student_id,
    content: content,
    username: username,
    time: Number(getCurrentTime()),
  })
  .then(() => {
    console.log("Answer posted successfully");
    loadAnswers(active_post);  // Reload the answers for the active post after posting a comment
  })
  .catch((error) => {
    console.error("Error posting answer:", error);
    alert("Failed to post answer. Please try again.");
  });
}

// Event listener for adding a comment (answer)
document.getElementById("answer_btn").addEventListener("click", function () {
  addAnswer();
});

function addAnswer() {
  const student_id = studentId;
  const content = document.getElementById("newComment").value;

  if (content.trim() === "") {
    alert("Answer cannot be empty.");
    return;
  }
 // Post the answer to Firebase
 postComment(student_id, localStorage.getItem("student_username"), content);

 // Clear the input field after posting the answer
 document.getElementById("newComment").value = "";
}

// Function to load answers for the active post
// Helper function to calculate relative time
function timeAgo(timestamp) {
  // Ensure the timestamp is a valid number
  const timestampNumber = Number(timestamp);
  if (isNaN(timestampNumber)) {
      return "Invalid time";
  }

  const now = Date.now(); // Current time in milliseconds
  const difference = now - timestampNumber; // Difference in milliseconds

  const seconds = Math.floor(difference / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}



// Updated loadAnswers function
function loadAnswers(postId) {
  if (!postId) {
    console.error("No active post ID found.");
    return;
  }

  const answersRef = ref(database, `PARSEIT/community/posts/${postId}/answers/`);
  get(answersRef)
    .then((snapshot) => {
      const modalBody = document.querySelector(".answer-modal-body");
      modalBody.innerHTML = ""; // Clear previous answers

      if (snapshot.exists()) {
        const answers = snapshot.val();
        Object.keys(answers).forEach((answerId) => {
          const answer = answers[answerId];

          // Format the time using the timeAgo function
          const formattedTime = timeAgo(answer.time);

          const answerElement = document.createElement("div");
          answerElement.classList.add("answer");
          answerElement.innerHTML = `
            <div class="answer-header">
              <strong>${answer.username}</strong> <small>${formattedTime}</small>
            </div>
            <p class="community-answers">${answer.content}</p>
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



async function getUsername(student_id) {
  const postsRef = ref(database, `PARSEIT/username/`);

  return await get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const posts = snapshot.val();

      feedContainer.innerHTML = "";

      Object.keys(posts).forEach((postId) => {
        const post = posts[postId];
        if (post === student_id) {
          return localStorage.setItem("active_username", postId);

        }
      })
    }
  });
}


function getCurrentTime() {
  return Date.now(); // Numeric timestamp for storage
}
function formatTime(timestamp) {
  // Ensure the timestamp is a valid number
  const timestampNumber = Number(timestamp);
  if (isNaN(timestampNumber)) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid time";
  }

  const now = new Date(timestampNumber);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila", // Specifies Philippine Time
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
}




//FUNCTIONS FOR EDIT AND REPORT 
function toggleMenu(postElement) {
  // Find the menu associated with the current post
  const menu = postElement.querySelector('.menu-options');
  if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      menu.style.display = 'none';
  } else {
      menu.classList.add('show');
      menu.style.display = 'flex'; // Show the menu for the clicked post

  }

  // Close all other menus
  const allMenus = document.querySelectorAll('.menu-options');
  allMenus.forEach((m) => {
      if (m !== menu) {
          m.classList.remove('show');
          m.style.display = 'none';
      }
  });
}

// Close the menu when clicking outside of any menu icon
document.addEventListener('click', function(event) {
  const allMenuIcons = document.querySelectorAll('.menu-icon');
  const allMenuOptions = document.querySelectorAll('.menu-options');

  let clickedInsideMenu = false;

  // Check if the click is inside any menu icon/ menu options
  allMenuIcons.forEach(menuIcon => {
    if (menuIcon.contains(event.target)) {
      clickedInsideMenu = true;
    }
  });

  allMenuOptions.forEach(menuOption => {
    if (menuOption.contains(event.target)) {
      clickedInsideMenu = true;
    }
  });

  // If the click is outside, close all menus
  if (!clickedInsideMenu) {
    allMenuOptions.forEach(menuOption => {
      menuOption.classList.remove('show');
      menuOption.style.display = 'none';
    });
  }
});

// Edit Post Functionality
function editPost(postId) {
  const newDescription = prompt("Edit your post:");
  if (newDescription !== null && newDescription.trim() !== "") {
      update(ref(database, `PARSEIT/community/posts/${postId}`), {
          description: newDescription,
      })
          .then(() => {
              alert("Post updated successfully!");
              loadPosts(); // Reload posts
          })
          .catch((error) => {
              console.error("Error updating post:", error);
              alert("Failed to update the post.");
          });
  }
}

// Report Post Functionality
function reportPost(postId) {
  if (confirm("Are you sure you want to report this post?")) {
      update(ref(database, `PARSEIT/community/posts/${postId}`), {
          reported: true, // Add a 'reported' flag
      })
          .then(() => {
              alert("Post reported successfully.");
          })
          .catch((error) => {
              console.error("Error reporting post:", error);
              alert("Failed to report the post.");
          });
  }
}