import { Bike, Cake, Dumbbell, School, Spade, Utensils } from "../Components/lucide-react";

function Servise() {
  const dataServices = [
    { Icon: <School width={44} height={44} />, name: "Rooms & Appartment", dec: "Find your perfect vacation rental or long-term accommodation." },
    { Icon: <Utensils width={44} height={44} />, name: "Food & Restaurant", dec: "Explore a wide variety of cuisines from top-rated restaurants." },
    { Icon: <Spade width={44} height={44} />, name: "Spa & Fitness", dec: "Relax and rejuvenate with our luxurious spa treatments and state-of-the-art fitness facilities." },
    { Icon: <Bike width={44} height={44} />, name: "Sports & Entertainment", dec: "Enjoy a wide range of recreational and sporting activities." },
    { Icon: <Cake width={44} height={44} />, name: "Events & Parties", dec: "Organize your perfect event, from weddings to conferences." },
    { Icon: <Dumbbell width={44} height={44} />, name: "Gym & Yoga", dec: "Achieve your fitness goals with our modern gym and yoga classes." },
  ];
  return (
    <div>
      {/* SERVICES */}
      <div className="w-full h-full mt-14 text-center pb-20">
        <h6 className="text-amber-400 mb-2 text-xl font-bold">__---- OUR SERVICES ----__</h6>
        <h1 className="text-4xl mb-10 text-black font-bold">Explore Our <span className="text-amber-400 ">SERVICES</span></h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mx-10 md:mx-24 gap-4">
          {dataServices.map(function (dt, i) {
            return (
              <div key={i} className=" cursor-pointer shadow-lg hover:bg-yellow-500 hover:text-white w-full h-full flex flex-col items-center justify-center border-2 rounded-md py-20 px-10 space-y-5 bg-white ">
                <p className="  border-2 p-2 rounded-md text-amber-300">{dt.Icon}</p>
                <p className=" text-black text-[23px] font-medium">{dt.name}</p>
                <p className="text-[14px]">{dt.dec}</p>
              </div>
            )
          })}
        </div>
      </div>


    </div>
  )
}

export default Servise