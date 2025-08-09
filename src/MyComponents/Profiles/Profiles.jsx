// import React from "react";
// import { motion } from "framer-motion";
// import leetcodeLogo from "../../assets/profiles/leetcode.png";
// import hackerrankLogo from "../../assets/profiles/hackerrank.jpeg";
// import gfgLogo from "../../assets/profiles/gfg.jpeg";
// import githubLogo from "../../assets/profiles/github.png";
// import linkedinLogo from "../../assets/profiles/linkedin.png";


// const profiles = [
//   {
//     platform: "LeetCode",
//     username: "@saikamalesh415",
//     logo: leetcodeLogo,
//     link: "https://leetcode.com/u/saikamalesh415/",
//   },
//   {
//     platform: "HackerRank",
//     username: "@saikamalesh415",
//     logo: hackerrankLogo,
//     link: "https://www.hackerrank.com/profile/saikamalesh415",
//   },
//   {
//     platform: "GeeksforGeeks",
//     username: "@saikamalvi5z",
//     logo: gfgLogo,
//     link: "https://www.geeksforgeeks.org/user/saikamalvi5z/",
//   },
//   {
//     platform: "GitHub",
//     username: "@saikamalesh415",
//     logo: githubLogo,
//     link: "https://github.com/saikamalesh415",
//   },
//   {
//     platform: "LinkedIn",
//     username: "Sai Kamalesh Boyina",
//     logo: linkedinLogo,
//     link: "https://www.linkedin.com/in/saikamalesh-boyina-7341a9305/",
//   },
// ];

// export default function Profiles() {
//   return (
//     <section id="profiles" className="py-16">
//       {/* Heading */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//         className="text-center mb-12"
//       >
//         <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
//            My Profiles
//         </h2>
//       </motion.div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {profiles.map((profile, index) => (
//           <motion.a
//             key={index}
//             href={profile.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.2 }}
//             viewport={{ once: true }}
//             className="bg-card rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition-transform duration-300 border border-border flex flex-col items-center p-6"
//           >
//             {/* Logo */}
//             <div className="h-20 flex justify-center items-center mb-4">
//               <img
//                 src={profile.logo}
//                 alt={profile.platform}
//                 className="object-contain h-full w-auto"
//               />
//             </div>
//             {/* Platform */}
//             <h3 className="text-xl font-semibold text-primary">{profile.platform}</h3>
//             {/* Username */}
//             <p className="text-muted-foreground">{profile.username}</p>
//           </motion.a>
//         ))}
//       </div>
//     </section>
//   );
// }
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import leetcodeLogo from "../../assets/profiles/leetcode.png";
import hackerrankLogo from "../../assets/profiles/hackerrank.jpeg";
import gfgLogo from "../../assets/profiles/gfg.jpeg";
import githubLogo from "../../assets/profiles/github.png";
import linkedinLogo from "../../assets/profiles/linkedin.png";

const profiles = [
  {
    platform: "LeetCode",
    username: "@saikamalesh415",
    logo: leetcodeLogo,
    link: "https://leetcode.com/u/saikamalesh415/",
  },
  {
    platform: "HackerRank",
    username: "@saikamalesh415",
    logo: hackerrankLogo,
    link: "https://www.hackerrank.com/profile/saikamalesh415",
  },
  {
    platform: "GeeksforGeeks",
    username: "@saikamalvi5z",
    logo: gfgLogo,
    link: "https://www.geeksforgeeks.org/user/saikamalvi5z/",
  },
  {
    platform: "GitHub",
    username: "@saikamalesh415",
    logo: githubLogo,
    link: "https://github.com/saikamalesh415",
  },
  {
    platform: "LinkedIn",
    username: "Sai Kamalesh Boyina",
    logo: linkedinLogo,
    link: "https://www.linkedin.com/in/saikamalesh-boyina-7341a9305/",
  },
];

const ProfileCard = ({ profile, index }) => {
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
      className="relative h-80 rounded-2xl overflow-hidden"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
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
        {/* Logo */}
        <div className="absolute inset-0 overflow-hidden bg-white flex items-center justify-center">
          <motion.img
            src={profile.logo}
            alt={profile.platform}
            className="object-contain h-32 w-auto"
            animate={{
              x: isHovered ? rotation.y * -3 : 0,
              y: isHovered ? rotation.x * 3 : 0,
            }}
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <motion.div
            animate={{ z: isHovered ? 50 : 0 }}
            className="transform-style-3d"
          >
            <motion.h3
              className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                isHovered ? "text-primary" : "text-white"
              }`}
              animate={{ y: isHovered ? -5 : 0 }}
            >
              {profile.platform}
            </motion.h3>
            <motion.p
              className="text-gray-300 text-sm"
              animate={{ y: isHovered ? -3 : 0 }}
            >
              {profile.username}
            </motion.p>
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

        {/* View Profile button */}
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
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-white text-black rounded-full text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-opacity-90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Profile <ArrowUpRight size={16} />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default function Profiles() {
  return (
    <section id="profiles" className="py-16">
      <div className="mb-12 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Profiles
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {profiles.map((profile, index) => (
          <ProfileCard key={profile.platform} profile={profile} index={index} />
        ))}
      </div>
    </section>
  );
}
