import Test from "../Pages/Test"
import 'react-toastify/dist/ReactToastify.css';
import Contact from "../Pages/Contact";
import Header from "../Pages/Header";

export const metadata = {
  title: 'Contact Us | EdHotel',
  description: 'Get in touch with EdHotel for reservations and inquiries.',
};

function Page() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header page={"Contact"} />
      </div>
      <div className=" bg-gray-50 ">
      <Test name="CONTACT" />
      {/* CONTACT */}
      <Contact />
    </div>
    </div>
  );
}
export default Page;


