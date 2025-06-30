// main.js - Handles Firebase Login and UI Update

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4T_0Pz027-5yOaCnk9BjQ-xnaUCgOhgc",
  authDomain: "coursereviewwall.firebaseapp.com",
  projectId: "coursereviewwall",
  storageBucket: "coursereviewwall.firebasestorage.app",
  messagingSenderId: "210576832312",
  appId: "1:210576832312:web:7be07c53b2631fe02e73cd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements
const loginBtn = document.getElementById("loginBtn");

// Show dropdown menu on click
let userDropdown;

// Login button click handler
loginBtn.addEventListener("click", () => {
  if (auth.currentUser) {
    // Toggle dropdown menu
    if (!userDropdown) createDropdown();
    else toggleDropdown();
  } else {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
      console.error("Login failed:", error);
    });
  }
});

// Auth state change listener
auth.onAuthStateChanged((user) => {
  if (user) {
    const firstName = user.displayName.split(" ")[0];
    loginBtn.textContent = `Hi, ${firstName} ▾`; // ▼ icon
    loginBtn.classList.add("logged-in");
  } else {
    loginBtn.textContent = "Login with Google";
    loginBtn.classList.remove("logged-in");
    if (userDropdown) userDropdown.remove();
  }
});

// Create dropdown
function createDropdown() {
  userDropdown = document.createElement("div");
  userDropdown.className = "user-dropdown";
  userDropdown.innerHTML = `
    <ul>
      <li><button onclick="logoutUser()">Logout</button></li>
    </ul>
  `;
  loginBtn.parentNode.insertBefore(userDropdown, loginBtn.nextSibling);
}

// Toggle dropdown
function toggleDropdown() {
  userDropdown.style.display =
    userDropdown.style.display === "none" ? "block" : "none";
}

// Logout function
function logoutUser() {
  auth.signOut();
  if (userDropdown) userDropdown.remove();
  userDropdown = null;
}

// Search handler placeholder
function searchCourse() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const links = document.querySelectorAll("#course-list a");
  links.forEach((link) => {
    const text = link.textContent.toLowerCase();
    link.parentElement.style.display =
      text.includes(search) ? "list-item" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchCourse);
  }
});
