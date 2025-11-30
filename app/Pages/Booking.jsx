"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from "next/link";

export function Booking() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  const fetchBookings = async () => {
    if (!email) return; // Don't fetch if email is not available yet
    try {
      setIsLoading(true); // Set loading to true before fetching
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`);
      setBookings(response.data.filter((bk) => bk.email === email));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  const deleteAllBookings = async () => {
    if (confirm('Are you sure you want to cancel All bookings?')) {
      const userBookings = bookings.filter((bk) => bk.email === email);
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/BookingdAll`, {
          data: { bookings: userBookings }
        });
        fetchBookings(); // Refresh bookings after deletion
      } catch (error) {
        console.error('Error deleting bookings:', error);
      }
    }
  };

  const deleteBooking = async (id) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmed) {
        return;
      }
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking/${id}`);
      fetchBookings(); // Refresh bookings after deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const deleteBookingAuto = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking/${id}`);
      fetchBookings(); // Refresh bookings after auto-deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  useEffect(() => {
    if (email) { // Only start fetching if email is available
      fetchBookings(); // Initial fetch when email is set
    }
  }, [email]); // Re-run effect when email changes

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!accessToken) {
      router.push("/Login");
    } else {
      // If already on /Booking, no need to push again, might cause re-renders
      // router.push("/Booking"); 
    }
  }, [router]);

  const getTotal = () => {
    let total = 0;
    bookings.forEach((bk) => { // bookings are already filtered by email
      total += bk.prix;
    });
    return total;
  };

  useEffect(() => {
    bookings.forEach((bk) => {
      const checkOutDate = new Date(bk.check_out);
      const myDate = new Date();
      myDate.setHours(0, 0, 0, 0);
      if (checkOutDate < myDate) {
        deleteBookingAuto(bk._id);
      }
    });
  }, [bookings]); // Depend on bookings to re-evaluate when they change

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 mt-5">
      <div className={`float-end mx-5 md:mx-32 ${bookings.length === 0 ? "hidden" : ""}`}>
        <button onClick={deleteAllBookings} className="p-2 bg-amber-400 rounded-md mr-2 text-black">
          CANCEL ALL RESERVATIONS
        </button>
        <button onClick={() => router.push(`/Checkout?amount=${getTotal()}`)} className="p-2 bg-sky-500 rounded-md text-black">
          PAYING
        </button>
      </div>
      <br /><br />
      {bookings.length > 0 ?
        bookings.map((bk, i) => {
          const checkInDate = new Date(bk.check_in);
          const checkOutDate = new Date(bk.check_out);
          const formattedCheckIn = format(checkInDate, "MMMM do, yyyy", { locale: enUS });
          const formattedCheckOut = format(checkOutDate, "MMMM do, yyyy", { locale: enUS });
          const checkInDateObj = parseISO(bk.check_in);
          const checkOutDateObj = parseISO(bk.check_out);
          // const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj); // This variable is not used
          const myDate = new Date();
          myDate.setHours(0, 0, 0, 0);
          const checkOutDt = new Date(bk.check_out);

          // The auto-deletion logic should ideally be handled in the useEffect above
          // or on the server side to prevent race conditions or UI flickering.
          // For now, we'll remove the conditional rendering here to ensure all bookings are displayed.
          // The useEffect will handle the deletion in the background.
          return (
            <div key={i} className="md:flex items-center justify-around text-black bg-stone-200 mx-5 md:mx-32 my-5 rounded-md p-6">
              <p>{bk.nameR}</p>
              <p>
                <span className="text-amber-600">FROM: </span>{formattedCheckIn}&nbsp;&nbsp;
                <span className="text-amber-600">TO: </span>{formattedCheckOut}
              </p>
              <p>
                <span className="text-amber-600">Prix : </span> {`${bk.prix}`}$
              </p>
              <button onClick={() => { deleteBooking(bk._id); }} className="p-2 bg-amber-400 rounded-md">CANCEL RESERVATION</button>
            </div>
          );
        }) :
        <div className="h-96 w-full text-center">
          <p className="text-4xl text-black">You don't have any reservations</p><br />
          <Link className="p-4 rounded-md bg-amber-400 text-black" href={"/Rooms"}>GO TO ROOMS PAGE</Link>
        </div>
      }
    </div>
  );
}

export default Booking;
