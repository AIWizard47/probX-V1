import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Bouncy size="45" speed="1.75" color="black" />
    </div>
  );
};

export const ButtonLoader = () => {
  return <Bouncy size="20" speed="1.75" color="white" />; // smaller size for inside button
};

export default Loader;
