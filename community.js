const overlay = document.getElementById("overlay");
const queryModal = document.getElementById("queryModal");
const answersModal = document.getElementById("answersModal");
const feedContainer = document.getElementById("feedContainer");
const closeModalBtn = document.querySelector(".query-close-button");
const closeAnswersBtn = document.querySelector(".answers-close-button");
let activeFeed = null; 

function openModal() {
    overlay.classList.add("active");
    queryModal.classList.add("active");
}

function closeModal() {
    overlay.classList.remove("active");
    queryModal.classList.remove("active");
}

// Open the answers modal and display comments for the selected feed
function openAnswersModal(feedElement, active_post_id) {
    localStorage.setItem("active_post_id", active_post_id);
    overlay.classList.add("active");
    answersModal.classList.add("active");
    activeFeed = feedElement; // Set the current feed as active
    loadAnswers(active_post_id); // Load answers for this post
  }

  function loadAnswers(postId) {
    const answersRef = ref(database, `PARSEIT/community/posts/${postId}/answers/`);
  
    get(answersRef)
      .then((snapshot) => {
        const modalBody = document.querySelector(".answers-modal .modal-body");
        modalBody.innerHTML = ""; // Clear previous answers
  
        if (snapshot.exists()) {
          const answers = snapshot.val();
          console.log("Answers Snapshot:", snapshot.val());

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
  

// Close the answers modal
function closeAnswersModal() {
    overlay.classList.remove("active");
    answersModal.classList.remove("active");
    activeFeed = null;
}

// Update the "View Comments" text dynamically
function updateCommentCount(feedElement) {
    const commentsContainer = feedElement.querySelector(".comments");
    const commentCount = commentsContainer.children.length;
    const viewCommentsElement = feedElement.querySelector(".view-comments");

    viewCommentsElement.textContent = `${commentCount} ${commentCount === 1 ? "Comment" : "Comments"}`;
}


overlay.addEventListener("click", () => {
    closeModal();
    closeAnswersModal();
});

closeModalBtn.addEventListener("click", closeModal);
closeAnswersBtn.addEventListener("click", closeAnswersModal);
