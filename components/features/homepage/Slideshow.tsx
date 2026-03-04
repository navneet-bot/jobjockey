"use client"; 

import wipro from '@/public/wipro-white.jpg'
import capgemini from '@/public/capgemini.jpg'
import cognizant from '@/public/cognizant.jpg'
import ltm from '@/public/ltm.jpg'
import { motion } from 'framer-motion';
import Image from 'next/image';


const slides = [
  { 
    id: 1, 
    image: wipro, 
    name: "Wipro" 
  },
  { 
    id: 2, 
    image: cognizant, 
    name: "Cognizant" 
  },
  { 
    id: 3, 
    image: ltm, 
    name: "LTM" 
  },
  { 
    id: 4, 
    image: capgemini, 
    name: "Capgemini" 
  },
]


const Slideshow = () => {
  const duplicatedSlides = [...slides, ...slides, ...slides, ...slides];

  return (
    <div className="relative w-full overflow-hidden bg-white py-10">
      <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white dark:from-black to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white dark:from-black to-transparent" />

      <motion.div
        className="flex"
        animate={{
          x: ['0%', '-100%'],
          transition: {
            ease: 'linear',
            duration: 20, 
            repeat: Infinity,
          }
        }}
      >
        {duplicatedSlides.map((slide, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 px-8 md:px-12 lg:px-16" 
            style={{ width: 'auto' }} 
          >
            <div className="flex items-center justify-center h-16 md:h-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image 
                src={slide.image} 
                alt={slide.name} 
                width={150} 
                height={50} 
                className="object-contain max-w-[120px] md:max-w-[150px]"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Slideshow;
