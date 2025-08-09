// import React from "react";
// import { motion } from "framer-motion";
// import { GraduationCap } from "lucide-react"; // icon package already in portfolio

// const educationData = [
//   {
//     year: "2022 – 2026",
//     degree: "B.Tech - Information Technology",
//     school: "Anil Neerukonda Institute of Technology and Sciences",
//     location: "Visakhapatnam",
//     highlight: "CGPA: 8.59/10",
//   },
//   {
//     year: "2020 – 2022",
//     degree: "Intermediate",
//     school: "Sri Chaitanya Junior College",
//     location: "Visakhapatnam",
//     highlight: "Percentage: 93%",
//   },
//   {
//     year: "2019 – 2020",
//     degree: "Secondary School",
//     school: "Sri Chaitanya Techno School",
//     location: "Visakhapatnam",
//     highlight: "Percentage: 94%",
//   },
// ];

// export default function Education() {
//   return (
//     <section id="education" className="py-16">
//       {/* Heading with icon */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//         className="text-center mb-12"
//       >
//         <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
//           <GraduationCap className="w-8 h-8 text-primary" />
//           Education
//         </h2>
//       </motion.div>

//       {/* Education List */}
//       <div className="max-w-3xl mx-auto space-y-8">
//         {educationData.map((edu, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.2 }}
//             viewport={{ once: true }}
//             className="bg-card rounded-lg p-6 shadow-md border border-border"
//           >
//             <span className="text-sm text-muted-foreground">{edu.year}</span>
//             <h3 className="text-xl font-semibold text-primary mt-1">{edu.degree}</h3>
//             <p className="text-foreground">{edu.school}</p>
//             <p className="text-muted-foreground">{edu.location}</p>
//             <p className="mt-2 font-medium text-secondary">{edu.highlight}</p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
// src/MyComponents/Education/Education.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const educationData = [
  {
    year: "2022 – 2026",
    degree: "B.Tech - Information Technology",
    school: "Anil Neerukonda Institute of Technology and Sciences",
    location: "Visakhapatnam",
    highlight: "CGPA: 8.59/10",
  },
  {
    year: "2020 – 2022",
    degree: "Intermediate",
    school: "Sri Chaitanya Junior College",
    location: "Visakhapatnam",
    highlight: "Percentage: 93%",
  },
  {
    year: "2019 – 2020",
    degree: "Secondary School",
    school: "Sri Chaitanya Techno School",
    location: "Visakhapatnam",
    highlight: "Percentage: 94%",
  },
];

const EducationCard = ({ edu, index }) => {
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
      className="relative h-56 rounded-2xl overflow-hidden"
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
        className="w-full h-full relative rounded-2xl overflow-hidden bg-card shadow-lg border border-border p-6 flex flex-col justify-center"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          transition: { type: "spring", stiffness: 100, damping: 10 },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <span className="text-sm text-muted-foreground">{edu.year}</span>
          <h3
            className={`text-xl font-bold mt-1 transition-colors duration-300 ${
              isHovered ? "text-blue-500" : "text-primary"
            }`}
          >
            {edu.degree}
          </h3>
          <p className="text-foreground">{edu.school}</p>
          <p className="text-muted-foreground">{edu.location}</p>
          <p className="mt-2 font-medium text-secondary">{edu.highlight}</p>
        </div>

        {/* Spotlight effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%)`
              : "none",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function Education() {
  return (
    <section id="education" className="py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          Education
        </h2>
      </motion.div>

      {/* Grid layout for Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {educationData.map((edu, index) => (
          <EducationCard key={index} edu={edu} index={index} />
        ))}
      </div>
    </section>
  );
}
