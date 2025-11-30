import React from "react";
import Test from "../Pages/Test"
import Rooms from "../Pages/Rooms";

export const metadata = {
  title: 'Rooms | EdHotel',
  description: 'Browse our luxurious rooms and suites.',
};

export default function Page() {

  return (
    <div className="bg-gray-100 pb-10">
      <Test name="ROOMS" />
      {/* ROOMS */}
      <Rooms />
    </div>
  );
}


