"use client"
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const [Booking, setBooking] = useState([]);
  const [Bookinge, setBookinge] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`);
        setBooking(res.data);
        setBookinge(res.data.filter((bk) => bk.email === data?.user.email));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchData();
  }, [data]);

  const DeleteAllBooking = async () => {
    const userBookings = Booking.filter((bk) => bk.email === data?.user.email);

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/BookingdAll`, {
        data: { bookings: userBookings }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting bookings:', error);
    }
  };

  const sendPayment = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URl}/CheckoutDoc`, Bookinge);
      console.log('Payment successfully:', response.data);
      toast('Payment successfully!', {
        type: 'success',
        position: 'top-center',
        autoClose: 1000,
      });
      router.push("/payment-confirm")
    } catch (error) {
      console.error('Error adding Payment:', error);
      toast('Error adding Payment!', {
        type: 'error',
        position: 'top-center',
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const handleError = (error) => {
      setLoading(false);
      setErrorMessage(error.message);
    };

    await sendPayment();
    await DeleteAllBooking();

    try {
      const res = await fetch("/CheckApi/create-intent", {
        method: "POST",
        body: JSON.stringify({
          amount: amount
        })
      });
      const clientSecret = await res.json();
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: "https://edhotel.vercel.app/payment-confirm",
        },
      });

      if (result.error) {
        console.log(result.error.message);
      } else {
        // Handle success if needed
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='mx-10 md:mx-72 my-28'>
        <PaymentElement />
        <button className='w-full rounded-md py-3 bg-sky-600 text-white mt-3'>Submit</button>
      </div>
      {Bookinge.length > 0 ?
        Bookinge.map((bk, i) => {
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
            Delete(bk._id);
          } else {
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
              </div>
            );
          }
        }) :
        null
      }
      <ToastContainer />
    </form>
  );
};

export default CheckoutForm;
