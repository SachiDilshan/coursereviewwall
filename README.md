# 🎓 Course Review Wall

A lightweight web application that allows students to anonymously share their feedback on university courses — including delivery methods, difficulty level, group work, and personal tips.

> 🔗 **Live Site**: [https://sachidilshan.github.io/coursereviewwall/](https://sachidilshan.github.io/coursereviewwall/)

---

## 🚀 Features

- 🔐 **Google Sign-In**: Only authenticated users can submit or report reviews
- 📝 **Submit Reviews**: Rate difficulty, delivery mode, and group work expectations
- 💬 **View Feedback**: All users can read existing reviews per course
- 🗑️ **Delete Own Reviews**: Users can manage their own submissions
- 🚩 **Report Reviews**: Flag inappropriate content for moderation
- 🔥 **Realtime Updates**: Powered by Firebase Realtime Database

---

## 🛠️ Technologies Used

- **HTML/CSS/JavaScript**
- **Firebase**
  - Authentication (Google Sign-In)
  - Realtime Database
- **GitHub Pages** (free static hosting)

---

## 📦 Folder Structure

```
Course Review Wall/
├── index.html         # Home / Course search page
├── course.html        # Review submission + viewing page
├── course.js          # Logic for review handling (per course)
├── main.js            # Login & homepage interaction
├── style.css          # Common styling
```

---

## 📄 How to Run Locally

> You can also use it fully online via [GitHub Pages](https://sachidilshan.github.io/coursereviewwall/)

If you'd like to run it locally:
1. Clone the repo:
   ```bash
   git clone https://github.com/SachiDilshan/coursereviewwall.git
   ```
2. Open the folder in **VS Code**
3. Open `index.html` using **Live Server** or any browser
4. Login with your Google account and start using the app

> ⚠️ Make sure your Firebase project allows the domain you're testing from.

---

## 🔐 Firebase Setup Notes (for developers)

- Make sure Firebase Authentication is enabled with **Google Sign-In**
- Realtime Database rules:
```json
{
  "rules": {
    "reviews": {
      "$course": {
        ".read": true,
        "$reviewId": {
          ".write": "auth != null"
        }
      }
    },
    "reports": {
      "$course": {
        "$reviewId": {
          ".read": false,
          ".write": "auth != null"
        }
      }
    }
  }
}
```

---

## 📚 License

This project was developed as part of the EEI5280 Creative Design module at [OUSL](https://www.ou.ac.lk/). It is for educational use only.

---

## 👨‍💻 Author

**Sachintha Dilshan (W.A.S.D. Ethakada)**  
Bachelor of Software Engineering (Hons) – OUSL  
