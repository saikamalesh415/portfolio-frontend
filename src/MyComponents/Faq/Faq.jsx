"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { AnimatedText } from '../../components/ui/animated-text'

const faqs = [
  {
    question: "How do I contact you for inquiries or collaborations?",
    answer: "You can directly drop me a message through the contact form on this website or simply email me at dhruv.sathe11@gmail.com. I typically respond within 24-48 hours."
  },
  {
    question: "What services do you offer as a freelancer?",
    answer: "I specialize in web design, frontend and backend development, UI/UX design, mobile app development, and SEO optimization. My goal is to deliver tailored solutions that help you achieve your business objectives."
  },
  {
    question: "How long does it take to complete a project?",
    answer: "The timeline depends on the project's complexity. A simple portfolio or landing page may take 1-2 weeks, while a more complex application could take 2-3 months. I'll provide a detailed timeline after discussing your requirements."
  },
  {
    question: "What is your approach to freelancing projects?",
    answer: "I follow a structured process: understanding your needs, researching your industry, creating wireframes and prototypes, iterating based on feedback, and delivering a polished product. Collaboration and transparency are key throughout the journey."
  },
  {
    question: "Do you provide post-project support?",
    answer: "Absolutely! I offer maintenance and support services to ensure your website or application stays updated, secure, and performs optimally. Let's discuss a plan that works for you."
  }
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-40 right-10 w-64 h-64 rounded-full bg-gray-100 opacity-60 mix-blend-multiply blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-yellow-100 opacity-60 mix-blend-multiply blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        {/* <div className="text-center mb-16">
          <motion.span 
            className="block mb-3 text-sm font-medium tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            QUESTIONS & ANSWERS
          </motion.span>
          <AnimatedText 
            text="Frequently Asked Questions"
            className="text-3xl md:text-5xl font-bold"
            once={true}
            delay={0.1}
          />
        </div> */}
        
        {/* Final CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-6 text-gray-600">
            Still have questions? Feel free to reach out directly.
          </p>
          <motion.a 
            href="#contact"
            className="inline-block px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Contact me
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}