"use client";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context/UserContext';

import { useSearchParams } from 'next/navigation';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const bookingId = searchParams.get('bookingId');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking`, {
          withCredentials: true
        });
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.response?.status === 401) {
          router.push('/auth/Login');
        }
      }
    };

    fetchBookings();
  }, [router]);

  const getFilteredBookings = () => {
    if (bookingId) {
      return bookings.filter(b => b._id === bookingId);
    }
    if (type === 'all') {
      return bookings.filter(b => b.status === 'pending');
    }
    return bookings;
  };

  const displayBookings = getFilteredBookings();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet. Please wait.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Submit the form elements first (required by Stripe)
      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message);
      }

      // Create payment intent
      const res = await fetch("/CheckApi/create-intent", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      if (!res.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await res.json();
      const { clientSecret } = data;

      // Validate clientSecret
      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      console.log('Client secret received:', clientSecret);

      // Build return URL with bookingId if present
      const returnUrl = new URL(`${window.location.origin}/payment-confirm`);
      if (bookingId) {
        returnUrl.searchParams.append('bookingId', bookingId);
      }

      // Confirm payment
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message, {
          position: 'top-center',
          autoClose: 5000,
        });
        setLoading(false);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Payment successful - Update booking status
        try {
          if (bookingId) {
            await axios.put(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking/${bookingId}`,
              { status: 'paid' },
              { withCredentials: true }
            );
          } else {
            await axios.put(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking/all`,
              { status: 'paid' },
              { withCredentials: true }
            );
          }

          // Redirect to success page
          router.push(`/payment-confirm?payment_intent=${result.paymentIntent.id}&bookingId=${bookingId || ''}`);
        } catch (updateError) {
          console.error("Error updating booking status:", updateError);
          toast.error("Payment successful but failed to update booking status. Please contact support.", {
            position: 'top-center'
          });
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Payment failed. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    return differenceInDays(parseISO(checkOut), parseISO(checkIn));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-orange-200/20 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {displayBookings.map((booking, index) => {
                  const nights = calculateNights(booking.check_in, booking.check_out);
                  return (
                    <div key={booking._id || index} className="pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800">{booking.room?.name || 'Room'}</span>
                        <span className="font-bold text-orange-600">${booking.prix}</span>
                      </div>
                      <p className="text-xs text-gray-500">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(booking.check_in), "MMM dd")} - {format(parseISO(booking.check_out), "MMM dd, yyyy")}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t-2 border-orange-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">${amount}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Tax (0%)</span>
                  <span className="font-semibold text-gray-800">$0</span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-orange-100 to-amber-100 p-3 rounded-lg">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    ${amount}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-semibold">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>

          {/* Payment Form - Right Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-8 border border-orange-200/20 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Details
                </h2>

                <div className="mb-6">
                  <PaymentElement />
                </div>

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay ${amount}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>

              {/* Booking Details Cards */}
              {displayBookings.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Your Bookings</h3>
                  {displayBookings.map((booking, index) => {
                    const nights = calculateNights(booking.check_in, booking.check_out);
                    const checkInFormatted = format(parseISO(booking.check_in), "MMMM do, yyyy", { locale: enUS });
                    const checkOutFormatted = format(parseISO(booking.check_out), "MMMM do, yyyy", { locale: enUS });

                    return (
                      <div
                        key={booking._id || index}
                        className="bg-white/95 backdrop-blur-md rounded-lg shadow-md p-6 border border-orange-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{booking.room?.name || 'Room'}</h4>
                            <p className="text-sm text-gray-500">{booking.room?.type || 'Standard Room'}</p>
                          </div>
                          <span className="text-xl font-bold text-orange-600">${booking.prix}</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Check-in</p>
                            <p className="font-semibold text-gray-800">{checkInFormatted}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Check-out</p>
                            <p className="font-semibold text-gray-800">{checkOutFormatted}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckoutForm;
