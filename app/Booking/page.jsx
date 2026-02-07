import Test from "../Pages/Test"
import Booking from "../Pages/Booking";
import Header from "../Pages/Header";

export const metadata = {
  title: 'My Booking | EdHotel',
  description: 'Manage your bookings and reservations at EdHotel.',
};

export default function Page() {

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header page={"Booking"} />
      </div>
      <div className=" pb-10">
        <Test name="MY BOOKING" />
        {/* ROOMS */}
        <Booking />
      </div>
    </div>
  );
}



