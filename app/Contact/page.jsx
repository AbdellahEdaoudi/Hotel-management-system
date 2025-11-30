import Test from "../Pages/Test"
import 'react-toastify/dist/ReactToastify.css';
import Contact from "../Pages/Contact";

export const metadata = {
  title: 'Contact Us | EdHotel',
  description: 'Get in touch with EdHotel for reservations and inquiries.',
};

function Page() {
  return (
    <div>
      <Test name="CONTACT" />
      {/* CONTACT */}
      <Contact />
    </div>
  );
}
export default Page;


