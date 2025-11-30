import React from "react";
import Test from "../Pages/Test"
import About from "../Pages/About";

function page() {
  return (
    <div className=" bg-gray-50">
      <Test name="ABOUT" />
      {/* ABOUT */}
      <About />
    </div>
  )
}

export default page