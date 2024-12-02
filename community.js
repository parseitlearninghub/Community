
// localStorage.setItem("user-parser", "707");
const overlay = document.getElementById("overlay");
const queryModal = document.getElementById("queryModal");
const answersModal = document.getElementById("answersModal");
const feedContainer = document.getElementById("feedContainer");
const closeModalBtn = document.querySelector(".query-close-button");
const closeAnswersBtn = document.querySelector(".answers-close-button");
let activeFeed = null; // To track which feed's comment section is active

// Open the query modal
function openModal() {
    overlay.classList.add("active");
    queryModal.classList.add("active");
}

// Close the query modal
function closeModal() {
    overlay.classList.remove("active");
    queryModal.classList.remove("active");
}

// Open the answers modal and display comments for the selected feed
function openAnswersModal(feedElement, active_post_id) {
    localStorage.setItem("active_post_id", active_post_id)
    overlay.classList.add("active");
    answersModal.classList.add("active");
    activeFeed = feedElement; // Set the current feed as active for comments
    // displayComments(activeFeed);
}

// Close the answers modal
function closeAnswersModal() {
    overlay.classList.remove("active");
    answersModal.classList.remove("active");
    activeFeed = null;
}

// Post a new query and add it to the feed


// Update the relative time dynamically
// function updateTimeAgo() {
//     const feedPosts = document.querySelectorAll(".feed");

//     feedPosts.forEach((feed) => {
//         const timestamp = parseInt(feed.dataset.timestamp, 10);
//         const timeAgoElement = feed.querySelector(".time-posted");
//         const timeElapsed = Date.now() - timestamp;

//         timeAgoElement.textContent = formatTimeAgo(timeElapsed, timestamp);
//     });
// }

// Format the elapsed time
// function formatTimeAgo(elapsed, timestamp) {
//     const seconds = Math.floor(elapsed / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (seconds < 60) return "Just now";
//     if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
//     if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

//     const date = new Date(timestamp);
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return date.toLocaleDateString(undefined, options);
// }

// Update the relative time every minute
//setInterval(updateTimeAgo, 60000);

// Display comments in the answers modal

// Update the "View Comments" text dynamically
function updateCommentCount(feedElement) {
    const commentsContainer = feedElement.querySelector(".comments");
    const commentCount = commentsContainer.children.length;
    const viewCommentsElement = feedElement.querySelector(".view-comments");

    // Update the text based on the comment count
    viewCommentsElement.textContent = `${commentCount} ${commentCount === 1 ? "Comment" : "Comments"}`;
}

// Increment like count
// function incrementLikes(likeElement) {
//     const likeCountElement = likeElement.querySelector(".like-count");
//     let currentCount = parseInt(likeCountElement.textContent, 10);
//     currentCount += 1;
//     likeCountElement.textContent = currentCount;

//     // Update the "Like" text dynamically based on the count
//     likeElement.innerHTML = `<span class="like-count">${currentCount}</span> ${currentCount === 1 ? "Like" : "Likes"}`;
// }

// Close both modals when clicking outside them
overlay.addEventListener("click", () => {
    closeModal();
    closeAnswersModal();
});

// Event listeners for the close buttons
closeModalBtn.addEventListener("click", closeModal);
closeAnswersBtn.addEventListener("click", closeAnswersModal);
