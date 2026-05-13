import { Bike, Cake, Dumbbell, School, Spade, Utensils } from "../Components/lucide-react";

function Servise() {
  const dataServices = [
    { Icon: <School size={24} strokeWidth={1.5} />, name: "Rooms & Appartment", dec: "Find your perfect vacation rental or long-term accommodation." },
    { Icon: <Utensils size={24} strokeWidth={1.5} />, name: "Food & Restaurant", dec: "Explore a wide variety of cuisines from top-rated restaurants." },
    { Icon: <Spade size={24} strokeWidth={1.5} />, name: "Spa & Fitness", dec: "Relax and rejuvenate with our luxurious treatments and facilities." },
    { Icon: <Bike size={24} strokeWidth={1.5} />, name: "Sports & Entertainment", dec: "Enjoy a wide range of recreational and sporting activities." },
    { Icon: <Cake size={24} strokeWidth={1.5} />, name: "Events & Parties", dec: "Organize your perfect event, from weddings to conferences." },
    { Icon: <Dumbbell size={24} strokeWidth={1.5} />, name: "Gym & Yoga", dec: "Achieve your fitness goals with our modern gym and yoga classes." },
  ];

  return (
    <section className="relative py-8 md:py-10 bg-gray-50 overflow-hidden min-h-screen flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-200/40 blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-1/2 -left-10 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 mb-2 transition-transform hover:scale-105 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold text-orange-600 tracking-wider uppercase">Our Services</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            Explore Our <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">Premium Services</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {dataServices.map(function (dt, i) {
            return (
              <div 
                key={i} 
                className="group relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-6 shadow-xs group-hover:shadow-md">
                    {dt.Icon}
                  </div>
                  
                  {/* Text */}
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-white transition-colors duration-300">
                    {dt.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-snug group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                    {dt.dec}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Servise;