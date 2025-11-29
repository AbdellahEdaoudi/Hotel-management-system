// Payment.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from "next/link";
import PrintReservation from "./PrintReservation";

export function Payment() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Checkout`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();

    const intervalId = setInterval(() => {
      fetchBookings();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/Login");
      }
    }, [router]);

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`https://ed-hotel-api.vercel.app/Checkout/${id}`);
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="pb-16 mt-5">
      <br /><br />
      {bookings.filter((bk) => bk.email === localStorage.getItem("emailuser")).length > 0 ?
        bookings.filter((bk) => bk.email === localStorage.getItem("emailuser")).map((bk, i) => {
          const checkInDate = new Date(bk.check_in);
          const checkOutDate = new Date(bk.check_out);
          const formattedCheckIn = format(checkInDate, "MMMM do, yyyy", { locale: enUS });
          const formattedCheckOut = format(checkOutDate, "MMMM do, yyyy", { locale: enUS });
          const checkInDateObj = parseISO(bk.check_in);
          const checkOutDateObj = parseISO(bk.check_out);
          const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
          const myDate = new Date();
          myDate.setHours(0, 0, 0, 0);
          const checkOutDt = new Date(bk.check_out);
          if (checkOutDt < myDate) {
            deleteBooking(bk._id);
          } else {
            return (
              <div key={i} className="md:flex items-center justify-around text-black bg-stone-200 mx-5 md:mx-32 my-5 rounded-md p-6">
                <p>Reservation ID: {bk._id}</p>
                <p>{bk.nameR}</p>
                <p>
                  <span className="text-amber-600">FROM: </span>{formattedCheckIn}&nbsp;&nbsp;
                  <span className="text-amber-600">TO: </span>{formattedCheckOut}
                </p>
                <p>
                  <span className="text-amber-600">Price: </span> {`${bk.prix}`}$
                </p>
                <button
                  onClick={() => PrintReservation(bk)}
                  className="p-2 rounded-md bg-blue-500 text-white"
                >
                  Print
                </button>
              </div>
            );
          }
        }) :
        <div className="h-96 w-full text-center">
          <p className="text-4xl text-black">You don't have any reservations</p><br />
          <Link className="p-4 rounded-md bg-amber-400 text-black" href={"/Rooms"}>GO TO ROOMS PAGE</Link>
        </div>
      }
    </div>
  );
}

export default Payment;
