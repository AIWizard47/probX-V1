import axios from "axios";
import { useEffect, useState } from "react";
import HNavbar from "../HomePage_Component/HNavbar";
import CategoryTabs from "../HomePage_Component/Cateogery";
import Footer from "../landingPage_Component/Footer";
import Loader from "../components/Loader";
import { saveUser } from "../utils";

const HomePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3000/api/user/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          saveUser(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-[#f5f5f5]">
      <HNavbar  />
      <CategoryTabs />
      <Footer bgColor="bg-[#f5f5f5]" textColor="text-black" />
    </div>
  );
};

export default HomePage;
