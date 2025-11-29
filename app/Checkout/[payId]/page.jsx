"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FolderDot, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function Page({ params }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [name, setName] = useState("");
  const [nameR, setnameR] = useState("");
  const [id, setid] = useState("");
  const [check_in, setcheck_in] = useState("");
  const [check_out, setcheck_out] = useState("");
  const [because,setBecause]=useState('');
  const [loading,setloading]=useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Checkout/${params.payId}`)
      .then((res) => {
        setEmail(res.data.email);
        setSubject(`Cancellation Of Paynig`);
        setName(res.data.nameC);
        setnameR(res.data.nameR);
        setid(res.data._id);
        const checkInDate = new Date(res.data.check_in);
        const checkOutDate = new Date(res.data.check_out);
        const checkInString = `${checkInDate.getFullYear()}-${checkInDate.getMonth() + 1}-${checkInDate.getDay()}`;
        const checkOutString = `${checkOutDate.getFullYear()}-${checkOutDate.getMonth() + 1}-${checkOutDate.getDay()}`;
        setcheck_in(checkInString);
        setcheck_out(checkOutString);
        setHtml(
          `Your reservation Payment
          for the <span style="color: #D97706;">${res.data.nameR}</span> room
           from <span style="color: #D97706;">${checkInString}</span>
            to <span style="color: #D97706;">${checkOutString}</span>
             has been cancelled`
        );})
      .catch((error) => {
        console.error('Error fetching contact:', error);
      });
  }, [params.payId]);

  const Delete = async (id) => {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Checkout/${id}`);
        console.log(response.data.message);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (error) {
        console.error(`Error deleting booking with ID ${id}:`, error);
      }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setloading(true)
    const printContent = `
    <html>
      <head>
        <title>EdHotel</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            color: #333;
            background-color: #f9f9f9;
          }
          .invoice-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-header img {
            max-width: 100px;
            margin-bottom: 20px;
          }
          .invoice-header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
          }
          .invoice-details p {
            font-size: 18px;
            text-align: center;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 20px;
          }
          .invoice-footer p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>EdHotel</h1>
            <img src="https://urlimage.vercel.app/Logo-my-hotel-app.png" alt="Hotel Logo"/>
          </div>
          <div class="invoice-details">
           <p>${html}</p>
           <p > Because : <span style="color: #D97706;">${because}</span></p>
          </div>
          <div class="invoice-footer">
            <p>Thank you for choosing our hotel!</p>
          </div>
        </div>
      </body>
    </html>
  `;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URl}/SendEmail`, {
        to: email,
        subject,
        html : printContent,
      });
      Delete(id);
      toast("Email sent successfully", {
        type: "success",
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => { router.push('/Admin') }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      toast("Failed to send email", {
        type: "error",
        position: "top-center",
        autoClose: 3000,
      });
      setloading(false)
    }
  };

  const logout = () => {
    localStorage.removeItem("accessTokenAdmin");
    router.push("/AdminLogin");
  };

  return (
    <div className="flex border-b-2">
      <div className="flex flex-col bg-gray-800 p-4 md:w-auto w-1/2">
        <button className="md:w-60 p-2 rounded-md font-medium text-black py-4 mb-16 bg-white flex gap-2 items-center justify-around" onClick={logout}>
          <span title="LogOut" className="bg-red-500 p-1 rounded-md text-white"><LogOut /></span>
          <span className="flex gap-2"><FolderDot /> ADMIN PAGE</span>
        </button>
        {["ROOMS", "BOOKING", "PAYING", "CONTACT"].map((item) => (
          <span
            key={item}
            onClick={() => {
              localStorage.setItem("admin", item);
              router.push("/Admin");
            }}
            className="p-2 rounded-md font-medium text-gray-400 w-full py-4 mb-7 text-center cursor-pointer"
          >
            {item}
          </span>
        ))}
      </div>
      <div style={{
        backgroundImage: `url('/rooms/bg.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} className="flex flex-col p-6 w-full justify-center items-center ">
        <form ref={formRef} onSubmit={sendEmail} className="flex flex-col space-y-4 p-12 text-black backdrop-blur-sm rounded-md">
          <div className="text-center text-white text-3xl">Cancel Paying For {(name).split(' ')[0]}</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email to"
            required
            className="bg-white p-3 border border-black rounded-md w-[600px]"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            name="subject"
            placeholder="Subject"
            required
            className="bg-white p-3 border border-black rounded-md"
          />
          <textarea
            name="html"
            value={because}
            onChange={(e) => setBecause(e.target.value)}
            placeholder="Reason"
            required
            className="bg-white p-3 border border-black rounded-md"
          />
          <button type="submit" disabled={loading} className="p-4 bg-yellow-500 text-black rounded-md">
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Page;
