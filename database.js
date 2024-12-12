
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
document.getElementById("community_home_btn").addEventListener("click", function () {
  location.reload();
});
const overlay = document.getElementById("overlay");
const queryModal = document.getElementById("queryModal");
const answersModal = document.getElementById("answersModal");
const closeModalBtn = document.querySelector(".query-close-button");
const closeAnswersBtn = document.querySelector(".answers-close-button");
let activeFeed = null; 

document.getElementById("postbtn").addEventListener("click", function() {
  overlay.classList.add("active");
    queryModal.classList.add("active");
});

document.getElementById("close_btn").addEventListener("click", function() {
  overlay.classList.remove("active");
  queryModal.classList.remove("active");
});

function openAnswersModal(feedElement, postId) {
  localStorage.setItem("active_post_id", postId);
  overlay.classList.add("active");
  answersModal.classList.add("active");
  activeFeed = feedElement; 
  loadAnswers(postId);
}

document.getElementById("close_answermodal").addEventListener("click", function() {
  overlay.classList.remove("active");
  answersModal.classList.remove("active");
  activeFeed = null;
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
      menu.style.display = 'none';
  } else {
      const allMenus = document.querySelectorAll('.menu-options');
      allMenus.forEach((m) => {
          m.classList.remove('show');
          m.style.display = 'none'; // Hide all other menus
      });
      menu.classList.add('show');
      menu.style.display = 'flex'; // Show the menu
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

  get(postsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const posts = snapshot.val();
        feedContainer.innerHTML = ""; // Clear the container

        Object.keys(posts).forEach((postId) => {
          const post = posts[postId];

          // Create a unique ID for each menu and post actions
          const menuId = `menu-${postId}`;
          const editId = `edit-${postId}`;
          const reportId = `report-${postId}`;
          const answerId = `answer-${postId}`;

          const postElement = document.createElement("div");
          postElement.classList.add("feed");

          postElement.innerHTML = `
            <div class="user">
                <div class="profile-pic">
                    <img src="profile-pic.jpg" alt="User Picture">
                </div>
                <div class="text">
                    <strong class="username">${post.username}</strong><br>
                    <small class="time-posted">${post.time}</small>
                </div>
                <div class="menu-icon" id="${menuId}">
                    &#8942; 
                    <div class="menu-options">
                        <div class="menu-item" id="${editId}">
                        <img src="edit_icon.png"/>
                        Edit</div>
                        <div class="menu-item" id="${reportId}">
                        <img src="report.png" />
                        Report</div>
                    </div>
                </div>
            </div>
            <div class="post">
                <p>${post.description}</p>
            </div>
            <div class="feed-footer">
                <small class="view-comments" id="${answerId}">Answer</small>
            </div>
            <div class="comments"></div> <!-- Comments container -->
          `;
          feedContainer.prepend(postElement);

          document.getElementById(menuId).addEventListener("click", () => openMenu(document.getElementById(menuId))); // Use openMenu here
          document.getElementById(editId).addEventListener("click", () => editPost(postId));
          document.getElementById(reportId).addEventListener("click", () => reportPost(postId));
          document.getElementById(answerId).addEventListener("click", () => openAnswersModal(postElement, postId));
        });
      } else {
        console.log("No posts available.");
      }
    })
    .catch((error) => {
      console.error("Error loading posts:", error);
    });
}


document.addEventListener("DOMContentLoaded", function () {
  const student_id = localStorage.getItem("user-parser");
  loadPosts(student_id);
});

function getCurrentTime() {
  const now = new Date();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[now.getMonth()];
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

console.log("Active Post ID:", active_post_id);
console.log("Answers being loaded for Post ID:", postId);
function postComment(student_id, username, content) {
  const answer_id = Date.now().toString();
  const active_post = localStorage.getItem("active_post_id");
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
  document.getElementById("newComment").value = "";
  const active_post_id = localStorage.getItem("active_post_id");
  loadAnswers(active_post_id); 
}

localStorage.getItem("active_post_id")

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
          modalBody.innerHTML = ""; 

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



overlay.addEventListener("click", () => {
    closeModal();
    closeAnswersModal();
});


function toggleMenu(menuElement) {
  // Close any open menus
  const allMenus = document.querySelectorAll('.menu-icon');
  allMenus.forEach((menu) => {
      if (menu !== menuElement) {
          menu.classList.remove('active');
      }
  });

  // Toggle the active state for the clicked menu
  menuElement.classList.toggle('active');
}

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  const allMenus = document.querySelectorAll('.menu-icon');
  allMenus.forEach((menu) => {
      if (!menu.contains(event.target)) {
          menu.classList.remove('active');
      }
  });
});
const images = document.querySelectorAll('.header_icons img');

images.forEach(img => {
    img.addEventListener('click', function() {
        images.forEach(image => image.classList.remove('active'));
        
        this.classList.add('active');
    });
});