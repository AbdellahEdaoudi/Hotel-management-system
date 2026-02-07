import Test from "../Pages/Test"
import Servise from "../Pages/Servise";
import Header from "../Pages/Header"; 

function page() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header page={"Services"} />
      </div>
      <div className=" bg-gray-50 ">
      <Test name="SERVICES" />
      {/* SERVICES */}
      <Servise />
    </div>
    </div>
  )
}

export default page 
