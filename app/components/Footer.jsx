import React from 'react'
import Image from 'next/image'

import {
  Instagram, Youtube
} from "lucide-react";

const Footer = () => {
  return (
    <div className='bg-card text-white py-8'>
      <div className='flex justify-evenly items-center h-[200px]'>
        <div className='flex flex-col justify-center gap-2'>
          <Image src="/assets/logo-skeleton.svg" alt="Logo" width={40} height={40}/>
          <h1>Markaz Umaza</h1>
          <p>© 2023 Markaz Umaza</p>
        </div>

        <div className='flex flex-col justify-center gap-2'>
          <h1>Phone: +1 (289) 456-9089</h1>
          <h1>Whatsapp/Telegram: +1 (289) 456-9089</h1>
          <h1>Email: m.saleem@markazumaza.com</h1>
        </div>

        <div className='flex flex-col justify-center gap-2'>
          <Image src="/assets/logo-skeleton.svg" alt="Logo" width={18} height={18}/>
          <Image src="/assets/logo-skeleton.svg" alt="Logo" width={18} height={18}/>
          <Instagram size={18} />
          <Youtube size={18} />
        </div>
      </div>
    </div>

  )
}

export default Footer