"use client";
import React from 'react';
import Image from 'next/image';

function About() {
  return (
    <div className="pb-10">
      <div className="w-full h-full mt-6 text-center pb-5">
        <div className="text-amber-400 mb-2 text-xl font-bold">__---- ABOUT US ----__</div>
        <div className="md:text-4xl text-3xl text-black font-bold">
          Welcome to <span className="text-amber-400">EdHotel</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mx-7 md:mx-16">
        <div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            EdHotel is a premier luxury hotel offering world-class amenities and exceptional service.
            Our mission is to provide guests with an unforgettable experience, combining comfort,
            elegance, and modern convenience.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            With state-of-the-art facilities, gourmet dining options, and personalized services,
            we ensure that every stay is memorable. Whether you're here for business or leisure,
            EdHotel is your home away from home.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our dedicated team is committed to exceeding your expectations and making your visit
            truly special. Experience the difference at EdHotel.
          </p>
        </div>
        <div className="relative h-64 md:h-auto">
          <Image src="/about-1.jpg" alt="EdHotel Facilities and Services" fill className="rounded-md object-cover" />
        </div>
      </div>
    </div>
  );
}

export default About;