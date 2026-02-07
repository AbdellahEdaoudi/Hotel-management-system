"use client"
import React, { Suspense } from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../Pages/CheckoutForm';
import { useSearchParams } from 'next/navigation';
import Header from '../Pages/Header';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);



function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}

function CheckoutComponent() {
  const searchParams = useSearchParams();
  const options = {
    mode: 'payment',
    currency: 'usd',
    amount: Number(searchParams.get('amount')) * 100,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div>
        <div className='sticky top-0 z-50'>
          <Header page="Booking" />
        </div>
          <CheckoutForm amount={Number(searchParams.get('amount'))} />
      </div>
    </Elements>
  );
}

export default Page;
