// Save user data to localStorage
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Get user data from localStorage
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Remove user data (logout)
export function removeUser() {
  localStorage.removeItem("user");
}