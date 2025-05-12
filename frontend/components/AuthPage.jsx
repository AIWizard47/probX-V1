import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  //login
  const [LoginDetail, setLoginDetail] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  //signup
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [confirmpassword, setsetconfirmpassword] = useState("");

  // Handle Sing Up

  const handleSignUpClick = async () => {
    try {
      //check password
      if (password !== confirmpassword) {
        toast.warning("password & confirmpassword must be same");
        // alert("password & confirmpassword must be same");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/user/auth/signup",
        {
          email,
          password,
          username,
        }
      );

      if (response.data.message === "User created") {
        toast.success("User Created !");
        handleAuthpageRoute();
        // alert("User created");
      }
    } catch (error) {
      if (error.response.data.message === "Email already exists") {
        toast.warning("Email Already Exist .");
      } else if (error.response.data.message === "Username already exists") {
        toast.warning("Username already exists");
      } else {
        toast.error("Sign-Up Failed");
      }
      // alert("signup failed");
    }
  };

  //Handle Singn in
  const handleSignInClick = async () => {
    try {
      const isEmail = LoginDetail.slice(-10) === "@gmail.com";
      const loginKey = isEmail ? "email" : "username";

      const response = await axios.post(
        "http://localhost:3000/api/user/auth/login",
        {
          [loginKey]: LoginDetail,
          password: LoginPassword,
        }
      );

      if (response.data.message === "Login successful") {
        const token = response.data.token;
        localStorage.setItem("token", token);
        toast.success("Login Successful!");
        handleHomepageRoute();
      }
    } catch (error) {
      if (error.response.data.message === "Invalid credentials") {
        toast.warning("Invalid credentials");
      } else {
        toast.error("Login Failed");
      }

      console.error(error);
    }
  };

  // Handle for Login Page
  const handleSignUppage = () => {
    setIsSignUpMode(true);
  };

  //handle for sign Up page
  const handleSignInpage = () => {
    setIsSignUpMode(false);
  };

  // route to the Homepage
  const navigate = useNavigate();
  const handleHomepageRoute = () => {
    navigate("/homepage");
  };

  //route to the same page for login again
  const handleAuthpageRoute = () => {
    handleSignInpage();
    //navigate("/auth");
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <div className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Username / email"
                required
                onChange={(u) => setLoginDetail(u.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(v) => setLoginPassword(v.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleSignInClick}
              className="btn solid"
            >
              Login
            </button>
          </div>
          <div className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(v) => setusername(v.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(v) => setpassword(v.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                onChange={(e) => setsetconfirmpassword(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleSignUpClick} className="btn">
              Sign up
            </button>
          </div>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Enhance your knowledge and apply your insights to engage with
              real-world events.
            </p>
            <button className="btn transparent" onClick={handleSignUppage}>
              Sign up
            </button>
          </div>
          <img
            src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader-img-20250509_v1.png&w=1200&q=75"
            className="image"
            alt="login"
          />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Welcome Again !</h3>
            <p>India’s Leading Online Skill Gaming Platform</p>
            <button className="btn transparent" onClick={handleSignInpage}>
              Sign in
            </button>
          </div>
          <img
            src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader-img-20250509_v1.png&w=1200&q=75"
            className="image"
            alt="register"
          />
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          position: relative;
          width: 100%;
          background-color: #fff;
          min-height: 100vh;
          overflow: hidden;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .sign-in-form,
        .sign-up-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0rem 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        .sign-in-form {
          z-index: 2;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #444;
          margin-bottom: 10px;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 5px;
          display: grid;
          grid-template-columns: 99% 1%;
          padding: 0 1.1rem;
          position: relative;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }

        .input-field input::placeholder {
          color: #aaa;
          font-weight: 500;
        }

        .btn {
          width: 120px;
          background-color: #000;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 4px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
        }

        // .btn:hover {
        //   background-color: #4d84e2;
        // }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 40%;
          transform: translateY(-50%);
          // background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
          background-image: linear-gradient(-55deg, #000 0%, #000 100%);
          transition: 1s ease-in-out;
          border-radius: 40%;
          z-index: 6;
        }

        .image {
          width: 100%;

          transition: transform 1.1s ease-in-out;
          transition-delay: 0.4s;
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
        }

        .panel p {
          font-size: 1rem;
          padding: 0.7rem 3rem;
        }

        .btn.transparent {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .right-panel .image,
        .right-panel .content {
          transform: translateX(800px);
        }

        /* ANIMATION */

        .container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .container.sign-up-mode .left-panel .image,
        .container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .container.sign-up-mode .sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .container.sign-up-mode .sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .container.sign-up-mode .right-panel .image,
        .container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        @media (max-width: 870px) {
          .container {
            min-height: 800px;
            height: 100vh;
          }
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .container.sign-up-mode .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 3 / 4;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .image {
            width: 200px;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.6s;
          }

          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }

          .panel h3 {
            font-size: 1.2rem;
          }

          .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }

          .btn.transparent {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }

          .container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }

          .container.sign-up-mode .left-panel .image,
          .container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }

          .container.sign-up-mode .right-panel .image,
          .container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }

          .right-panel .image,
          .right-panel .content {
            transform: translateY(300px);
          }

          .container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .sign-in-form,
          .sign-up-form {
            padding: 0 1.5rem;
          }

          .image {
            display: none;
          }
          .panel .content {
            padding: 0.5rem 1rem;
          }
          .container {
            padding: 1.5rem;
          }

          .container:before {
            bottom: 72%;
            left: 50%;
          }

          .container.sign-up-mode:before {
            bottom: 28%;
            left: 50%;
          }
        }
      `}</style>
    </div>
  );
}
