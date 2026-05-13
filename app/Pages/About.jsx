"use client";
import React from 'react';
import Image from 'next/image';

function About() {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-orange-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
        <div className="absolute top-1/2 -right-12 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Image Section */}
          <div className="relative order-2 lg:order-1 group">
            <div className="absolute -inset-2 bg-linear-to-r from-orange-400 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-lg"></div>
            
            <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] w-full rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-700 group-hover:scale-[1.02]">
              <Image 
                src="/about-1.jpg" 
                alt="EdHotel Premium Facilities" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-transparent"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 md:-left-6 md:right-auto md:bottom-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 transform transition-transform duration-500 hover:-translate-y-1 z-20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 leading-tight">5-Star</div>
                  <div className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Luxury Hotel</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-4 transition-transform hover:scale-105 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">About EdHotel</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                A Symphony of <br/>
                <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">
                  Luxury & Comfort
                </span>
              </h2>
              
              <div className="space-y-3 text-base md:text-sm text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-800 text-lg md:text-base">
                  EdHotel is a premier luxury destination offering world-class amenities and exceptional service. Our mission is to provide guests with an unforgettable experience.
                </p>
                <p>
                  With state-of-the-art facilities, gourmet dining options, and meticulously personalized services, we ensure that every single stay is memorable. Whether you're here for high-stakes business or tranquil leisure, EdHotel is your sanctuary away from home.
                </p>
              </div>
            </div>

            {/* Features/Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="group cursor-default">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500 mb-1 group-hover:scale-110 transition-transform origin-left w-max">
                  15+
                </div>
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">Years of Excellence</div>
                <div className="text-xs text-gray-500 mt-0.5">Perfecting hospitality.</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500 mb-1 group-hover:scale-110 transition-transform origin-left w-max">
                  24/7
                </div>
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">Dedicated Service</div>
                <div className="text-xs text-gray-500 mt-0.5">Always here for you.</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default About;