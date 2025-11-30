import React from "react";
import Test from "../Pages/Test"
import Booking from "../Pages/Booking";

export const metadata = {
  title: 'My Booking | EdHotel',
  description: 'Manage your bookings and reservations at EdHotel.',
};

export default function Page() {

  return (
    <div className=" pb-10">
      <Test name="MY BOOKING" />
      {/* ROOMS */}
      <Booking />
    </div>
  );
}



