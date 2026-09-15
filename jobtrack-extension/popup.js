const API_URL = "http://localhost:5000/api";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const loginSection = document.getElementById("loginSection");
const loggedInSection = document.getElementById("loggedInSection");

const message = document.getElementById("message");
const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

const showLoggedIn = (user) => {
  loginSection.style.display = "none";
  loggedInSection.style.display = "block";

  welcome.textContent = `Welcome, ${user.name}`;
};

const showLoggedOut = () => {
  loginSection.style.display = "block";
  loggedInSection.style.display = "none";
};

const checkLogin = async () => {
  const result = await chrome.storage.local.get([
    "token",
    "user",
  ]);

  if (result.token && result.user) {
    showLoggedIn(result.user);
  } else {
    showLoggedOut();
  }
};

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  message.textContent = "";

  try {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    await chrome.storage.local.set({
      token: data.token,
      user: data.user,
    });

    showLoggedIn(data.user);

  } catch (error) {
    console.error("Login error:", error);

    message.textContent =
      error.message || "Unable to login.";

  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});

logoutBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove([
    "token",
    "user",
  ]);

  showLoggedOut();
});

checkLogin();