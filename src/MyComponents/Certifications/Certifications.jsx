
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Import images
import nptelLogo from "../../assets/certifications/nptel.jpg";
import codsoftLogo from "../../assets/certifications/codsoft.jpeg";
import hackerrankLogo from "../../assets/certifications/hackerrank.png";
import vaultofcodeLogo from "../../assets/certifications/Vault.png";

// Certifications Data
const certifications = [
  {
    title: "Programming in Java",
    description: "12-week NPTEL course completed from Jan–Apr 2024",
    image: nptelLogo,
    link: "https://drive.google.com/file/d/1KheMqP_8hXFhefVEh0SS4nKcxd3PdyWM/view?usp=drivesdk",
    tags: ["Java", "NPTEL"]
  },
  {
    title: "Python Programming",
    description: "4-week course completed in April–May 2024 via CodSoft",
    image: codsoftLogo,
    link: "https://drive.google.com/file/d/1LAkdpyq6OIflF_R6CenTu-LELnbPfYV7/view?usp=drivesdk",
    tags: ["Python", "CodSoft", "Basics"]
  },
  {
    title: "SQL Certificate",
    description: "Certificate of Accomplishment earned on 04 Aug 2025 via HackerRank",
    image: hackerrankLogo,
    link: "https://drive.google.com/file/d/1RO7NwWkU0iA9bu28wxJil8PCCwtRa7fv/view?usp=drivesdk",
    tags: ["SQL", "HackerRank", "Database"]
  },
  {
    title: "Java",
    description: "4-week course completed in August-September 2025 via VaultOfCode",
    image: vaultofcodeLogo,
    link: "https://drive.google.com/file/d/1VqNf2M9GlIDOhbRXECAQjJOgIZOyfg7o/view?usp=drivesdk",
    tags: ["VaultOfCode","Java"]
  }
];

const CertificationCard = ({ cert, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setPosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative h-96 rounded-2xl overflow-hidden"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          transition: { type: "spring", stiffness: 100, damping: 10 },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="w-full h-full"
            animate={{
              x: isHovered ? rotation.y * -3 : 0,
              y: isHovered ? rotation.x * 3 : 0,
            }}
          >
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <motion.div
            animate={{
              z: isHovered ? 50 : 0,
              transition: { type: "spring", stiffness: 80, damping: 15 },
            }}
          >
            <motion.h3
              className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                isHovered ? "text-blue-500" : "text-white"
              }`}
            >
              {cert.title}
            </motion.h3>
            <motion.p
              className="text-gray-300 text-sm mb-4 line-clamp-2"
              animate={{
                opacity: isHovered ? 1 : 0.8,
                transition: { delay: 0.05 },
              }}
            >
              {cert.description}
            </motion.p>
            <motion.div
              className="flex gap-2 mb-4"
              animate={{
                opacity: isHovered ? 1 : 0.6,
                transition: { delay: 0.1 },
              }}
            >
              {cert.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Spotlight effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)`
              : "none",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* View Certificate button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-white text-black rounded-full text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-opacity-90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Certificate <ArrowUpRight size={16} />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default function Certifications() {
  return (
    <section id="certifications" className="py-16">
      {/* Section heading */}
      <div className="mb-12 text-center">
        <motion.span
          className="block mb-3 text-sm font-medium tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          CERTIFICATIONS
        </motion.span>
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Selected Certifications
        </motion.h2>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {certifications.map((cert, index) => (
          <CertificationCard key={index} cert={cert} index={index} />
        ))}
      </div>
    </section>
  );
}
