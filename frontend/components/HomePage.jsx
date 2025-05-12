import axios from "axios";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3000/api/user/userdata", {
          headers: {
            Authorization: `Bearer ${token}`, // send token as bearer
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user", err);
        });
    }
  }, []);
  return (
    <div>
      <h1>Home Page</h1>
      <h1 className="">Hello {user.username} , Ready to check Your Luck . </h1>
      <h1>Your Balance is : {user.balance}</h1>
    </div>
  );
};

export default HomePage;
