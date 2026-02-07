import React from "react";
import Test from "../Pages/Test"
import About from "../Pages/About";
import Header from "../Pages/Header";

function page() {
  return (
    <div>
      <div className="sticky top-0 z-50">
     <Header page="About" />
      </div>
    <div className=" bg-gray-50">
      <Test name="ABOUT" />
      {/* ABOUT */}
      <About />
    </div>
    </div>
  )
}

export default page