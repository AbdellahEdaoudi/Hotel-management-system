import Home from "./Pages/Home";
import Rooms from "./Pages/Rooms";
import About from "./Pages/About";
import Servise from "./Pages/Servise";
import Contact from "./Pages/Contact";
import Footer from "./Pages/Footer";
import Header from "./Pages/Header";

export const metadata = {
  title: 'Home | EdHotel',
  description: 'Welcome to EdHotel, your premium hotel management solution.',
};

export default function Page() {
  return (
    <div >
      <div className="sticky top-0 z-50">
          <Header page="Home" />
      </div>
      <Home />
      <Rooms />
      <About />
      <Servise />
      <Contact />
      <Footer />
    </div>
  );
}
