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

function openAnswersModal(feedElement, active_post_id) {
  localStorage.setItem("active_post_id", active_post_id);
  overlay.classList.add("active");
  answersModal.classList.add("active");
  activeFeed = feedElement; 
  loadAnswers(active_post_id);
}


 

// Close the answers modal
function closeAnswersModal() {
    overlay.classList.remove("active");
    answersModal.classList.remove("active");
    activeFeed = null;
}

overlay.addEventListener("click", () => {
    closeModal();
    closeAnswersModal();
});

closeModalBtn.addEventListener("click", closeModal);
closeAnswersBtn.addEventListener("click", closeAnswersModal);

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
