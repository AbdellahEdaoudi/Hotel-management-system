import React from "react";
import Test from "../Pages/Test"
import Rooms from "../Pages/Rooms";
import Header from "../Pages/Header";

export const metadata = {
  title: 'Rooms | EdHotel',
  description: 'Browse our luxurious rooms and suites.',
};

export default function Page() {

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header page={"Rooms"} />
      </div>
      <div className="bg-gray-100 pb-10">
      <Test name="ROOMS" />
      {/* ROOMS */}
      <Rooms />
    </div>
    </div>
  );
}


