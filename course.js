// course.js – Handles Firebase login, review form, and displaying course reviews

// 🔧 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4T_0Pz027-5yOaCnk9BjQ-xnaUCgOhgc",
  authDomain: "coursereviewwall.firebaseapp.com",
  projectId: "coursereviewwall",
  storageBucket: "coursereviewwall.firebasestorage.app",
  messagingSenderId: "210576832312",
  appId: "1:210576832312:web:7be07c53b2631fe02e73cd",
  databaseURL: "https://coursereviewwall-default-rtdb.asia-southeast1.firebasedatabase.app" // ✅ Region-correct URL
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database(); // Now correctly configured to your database region

// 🔐 Login Button Logic
const loginBtn = document.getElementById("loginBtn");
let userDropdown;

// Handle login/logout toggle
loginBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (user) {
    // Already logged in — show dropdown
    if (!userDropdown) createDropdown();
    else toggleDropdown();
  } else {
    // Login with Google
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((err) => {
      console.error("Login failed:", err);
      alert("Login failed.");
    });
  }
});

// Create logout dropdown
function createDropdown() {
  userDropdown = document.createElement("div");
  userDropdown.className = "user-dropdown";
  userDropdown.innerHTML = `<ul><li><button onclick="logoutUser()">Logout</button></li></ul>`;
  loginBtn.parentNode.insertBefore(userDropdown, loginBtn.nextSibling);
}

// Toggle dropdown
function toggleDropdown() {
  userDropdown.style.display =
    userDropdown.style.display === "none" ? "block" : "none";
}

// Logout function
function logoutUser() {
  auth.signOut().then(() => {
    if (userDropdown) userDropdown.remove();
    userDropdown = null;
    loginBtn.textContent = "Login with Google";
  });
}

// 📘 Show Course Title
const urlParams = new URLSearchParams(window.location.search);
const courseCode = urlParams.get("code") || "Unknown";
document.getElementById("courseTitle").textContent = `Course: ${courseCode}`;

// 📝 Review Submission
const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Please log in to submit a review.");

  const review = {
    uid: user.uid,
    difficulty: difficultyInput.value || '',
    delivery: reviewForm.delivery.value,
    groupWork: reviewForm.groupWork.value,
    comment: reviewForm.comment.value.trim(),
    timestamp: new Date().toISOString()
  };

  db.ref(`reviews/${courseCode}`).push(review)
    .then(() => {
      alert("Review submitted successfully!");
      reviewForm.reset();

      // 👇 Reset difficulty bar manually
      difficultyInput.value = "";
      difficultyLabel.textContent = "Difficulty: Not selected";
      levels.forEach(lvl => lvl.classList.remove("active"));
    })
    .catch((err) => {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    });
});

//  Difficulty Selector Bar Logic
const difficultyInput = document.getElementById("difficulty");
const difficultyLabel = document.getElementById("difficultyLabel");
const levels = document.querySelectorAll(".difficulty-bar .level");

const levelText = {
  1: "Very Easy",
  2: "Easy",
  3: "Average",
  4: "Difficult",
  5: "Very Difficult"
};

levels.forEach(level => {
  level.addEventListener("click", () => {
    const value = parseInt(level.dataset.value);
    difficultyInput.value = value;
    difficultyLabel.textContent = `Difficulty: ${value} - ${levelText[value]}`;

    levels.forEach(lvl => {
      const lvlValue = parseInt(lvl.dataset.value);
      if (lvlValue <= value) {
        lvl.classList.add("active");
      } else {
        lvl.classList.remove("active");
      }
    });
  });
});

// 📥 Load & Display Reviews
function loadReviews() {
  db.ref(`reviews/${courseCode}`).on("value", (snapshot) => {
    console.log("Loaded reviews:", snapshot.val()); // ✅ Add this for debugging

    reviewsList.innerHTML = "";
    const now = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);

    snapshot.forEach((child) => {
      const review = child.val();
      const reviewDate = new Date(review.timestamp);
      if (reviewDate < fiveYearsAgo) return;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Difficulty:</strong> ${review.difficulty} - ${levelText[review.difficulty] || "Unknown"} <br>
        <strong>Delivery:</strong> ${review.delivery} <br>
        <strong>Group Work:</strong> ${review.groupWork} <br>
        <strong>Comment:</strong> ${review.comment || "(No comment)"} <br>
        <small>Posted on: ${reviewDate.toDateString()}</small>
      `;

      const currentUser = auth.currentUser;
      // Show Delete for own reviews
      if (currentUser && review.uid === currentUser.uid) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
          if (confirm("Delete this review?")) {
            db.ref(`reviews/${courseCode}/${child.key}`).remove();
          }
        };
        li.appendChild(delBtn);
      }

      // Show Report for others
      if (!currentUser || (currentUser && review.uid !== currentUser.uid)) {
        const reportBtn = document.createElement("button");
        reportBtn.textContent = "Report";
        reportBtn.style.marginLeft = "10px";
        reportBtn.style.backgroundColor = "#f59e0b";
        reportBtn.style.color = "#fff";

        reportBtn.onclick = () => {
          if (!auth.currentUser) {
            alert("Please log in to report a review.");
          } else {
            const reason = prompt("Please describe the issue with this review:");
            if (reason && reason.trim()) {
              const report = {
                reviewerUid: review.uid,
                reporterUid: auth.currentUser.uid,
                reason,
                course: courseCode,
                timestamp: new Date().toISOString()
              };
              db.ref(`reports/${courseCode}`).push(report)
                .then(() => alert("Report submitted. Thank you."))
                .catch(() => alert("Failed to submit report."));
            }
          }
        };
        li.appendChild(reportBtn);
      }
      reviewsList.appendChild(li);
    });
  });
}

// ✅ Auth Ready
auth.onAuthStateChanged((user) => {
  if (user) {
    const firstName = user.displayName?.split(" ")[0] || "User";
    loginBtn.textContent = `Hi, ${firstName} ▾`;
    loginBtn.classList.add("logged-in");
  } else {
    loginBtn.textContent = "Login with Google";
    loginBtn.classList.remove("logged-in");
    if (userDropdown) userDropdown.remove();
  }

  loadReviews(); // Always reload reviews when auth changes
});