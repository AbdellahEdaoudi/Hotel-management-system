"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
    const router = useRouter();
    const emaill = <img src="email.png" alt="email" width={22} height={11} />;

    const [name, setName] = useState(typeof window !== 'undefined' ? localStorage.getItem("nameuser") || "" : "");
    const [subject, setSubject] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(null);
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          setEmail(localStorage.getItem("email"));
        }
      }, []);

    const PostContact = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!subject || !msg) {
            toast("Please fill in all fields", {
                type: "error",
                position: "top-center",
                autoClose: 3000,
            });
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URl}/Contact`,
                { name, email, subject, msg },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log(response.data);
            toast("Sent successfully", {
                type: "success",
                position: "top-center",
                autoClose: 2000,
            });
            setSubject("");
            setMsg("");
        } catch (error) {
            console.error(error);
            toast("An error occurred. Please try again.", {
                type: "error",
                position: "top-center",
                autoClose: 2000,
            });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="w-full h-full mt-7 text-center">
                <h6 className="text-amber-400 mb-2 text-xl font-bold">__---- CONTACT US ----__</h6>
                <h1 className="text-4xl mb-10 text-black font-bold">Contact <span className="text-amber-400">FOR ANY QUERY</span></h1>
            </div>
            <div className="text-amber-500 md:space-y-0 space-y-7 md:flex md:justify-between mx-5 md:mx-16 mb-5">
                <span className="font-bold">BOOKING ----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} book@Hotel.app</span></span>
                <span className="font-bold">TECHNICAL ----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} tech@Hotel.app</span></span>
                <span className="font-bold">GENERAL ----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} info@Hotel.app</span></span>
            </div>
            <form method="post" className="mx-5 md:mx-16 md:flex gap-4 py-10">
                <div className="md:w-1/2 md:mb-0 mb-5" data-wow-delay="0.1s">
                    <iframe
                        className="w-full h-full"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13413.497715884776!2d-13.19815!3d27.154256!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc37731e21ffd02f%3A0xb5d8ba3b30a4a46b!2sH%C3%B4tel%20Al%20Massira!5e0!3m2!1sen!2sbd!4v1643685191346!5m2!1sen!2sbd"
                        frameBorder="0"
                        style={{ minHeight: "350px", border: "0" }}
                        allowFullScreen=""
                        aria-hidden="false"
                        tabIndex="0"
                    ></iframe>
                </div>
                <div className="md:w-1/2 w-full">
                    <nav className="md:flex">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" className="mr-3 p-4 mb-5 bg-white text-black rounded-md border w-full" />
                        <input value={email} onChange={(e) => setEmail(email)} type="text" placeholder="Your Email" className="p-4 mb-5 bg-white text-black rounded-md border w-full" />
                    </nav>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" type="text" className="p-4 mb-5 bg-white text-black rounded-md border w-full" />
                    <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message" className="p-4 bg-white h-36 text-black rounded-md border w-full" />
                    <button onClick={PostContact} disabled={isLoading} className="w-full p-4 bg-amber-500 text-white rounded-md">
                        {isLoading ? "SENDING....." : "SEND MESSAGE"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Contact;
