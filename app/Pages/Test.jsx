import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

function Test({ name }) {
  return (
    <div className="relative h-48">
      <Image src="/carousel-1.jpg" alt="EdHotel Banner" fill className="brightness-50 object-cover" />
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white text-lg z-10">
        <p className="text-5xl font-bold animate__animated animate__slideInDown ">{name}</p> <br />
        <Link className="text-yellow-500 " href={"/"}>HOME</Link> / {name}
      </div>
    </div>
  )
}

export default Test
