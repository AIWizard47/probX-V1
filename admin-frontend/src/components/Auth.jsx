import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
   const navigate =useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [loginMessage, setLoginMessage] = useState({ text: "", type: "" });
  const [signupMessage, setSignupMessage] = useState({ text: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation - in a real app you would send this to a server
    if (loginEmail && loginPassword) {
      try {
        // Make API call to the authentication endpoint
        const response = await axios.post("http://localhost:3000/api/admin/auth/login", {
          email: loginEmail,
          password: loginPassword
        });

        if (response.data.message === "Login successful") {
          // Store token in localStorage
          const token = response.data.token;
          localStorage.setItem('token', token);

          // Show success message
          setLoginMessage({
            text: "Login successful!",
            type: "success"
          });
          navigate('/dashboard')

          // You could add navigation logic here
          // For example: router.push('/dashboard');
        } else {
          // Handle other successful responses that don't match expected format
          setLoginMessage({
            text: "Unexpected response from server.",
            type: "error"
          });
        }
      } catch (error) {
        // Handle error response
        console.error("Login error:", error);

        // Show error message
        setLoginMessage({
          text: error.response?.data?.message || "An error occurred during login.",
          type: "error"
        });
      }
    } else {
      setLoginMessage({
        text: "Please fill in all fields.",
        type: "error"
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setSignupMessage({
        text: "Please fill in all fields.",
        type: "error"
      });
      return;
    }

    // Check if passwords match
    if (signupPassword !== signupConfirm) {
      setSignupMessage({
        text: "Passwords do not match.",
        type: "error"
      });
      return;
    }

    try {
      // Make API call to the signup endpoint
      const response = await axios.post("http://localhost:3000/api/admin/auth/signup", {
        username: signupName,
        email: signupEmail,
        password: signupPassword
      });

      // For demo purposes, show success message

      if(response.data.message === "User created"){

          setSignupMessage({
            text: "Account created successfully!",
            type: "success"
          });

          setActiveTab("login");
      }

      // You could add additional logic here after successful signup
      // For example: automatically log in the user

    } catch (error) {
      console.error("Signup error:", error);

      // Show error message
      setSignupMessage({
        text: error.response?.data?.message || "An error occurred during signup.",
        type: "error"
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex bg-gray-50">
          <button
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              activeTab === "login"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("login");
              setLoginMessage({ text: "", type: "" });
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              activeTab === "signup"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("signup");
              setSignupMessage({ text: "", type: "" });
            }}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {/* Login Form */}
          {activeTab === "login" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="login-email">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="login-password">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>

              {loginMessage.text && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    loginMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {loginMessage.text}
                </div>
              )}
            </div>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-email">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-password">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="signup-confirm"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSignup}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>

              {signupMessage.text && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    signupMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {signupMessage.text}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}