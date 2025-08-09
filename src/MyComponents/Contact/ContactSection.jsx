// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowRight, Send, Loader2, CheckCircle, XCircle, Mail, MapPin } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { ParticleBackground } from "../../components/ui/particle-background";
// import { AnimatedText } from "../../components/ui/animated-text";

// // API endpoint configuration
// const API_URL = "https://portfolio-d10i.onrender.com";
// const API_TIMEOUT = 20000; // 20 seconds timeout

// export default function ContactSection() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);
//   const [serverStatus, setServerStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
//   const [lastCheck, setLastCheck] = useState(0);

//   const checkServerStatus = useCallback(async (retries = 2) => {
//     // Don't spam health checks if we already know the status
//     if (serverStatus === 'online' && Date.now() - lastCheck < 60000) {
//       return;
//     }
    
//     setServerStatus('unknown');
//     setLastCheck(Date.now());
    
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 8000);
    
//     try {
//       const response = await fetch(`${API_URL}/health`, {
//         method: 'GET',
//         cache: 'no-store',
//         signal: controller.signal
//       });
      
//       clearTimeout(timeoutId);
      
//       if (response.ok) {
//         setServerStatus('online');
//       } else {
//         setServerStatus('offline');
//       }
//     } catch (error) {
//       if (retries > 0) {
//         // If we have retries left, wait and try again
//         // This helps with cold starts where the first request might time out
//         setTimeout(() => {
//           checkServerStatus(retries - 1);
//         }, 3000);
//       } else {
//         console.error('Server health check error:', error);
//         setServerStatus('offline');
//       }
//     }
//   }, [serverStatus, lastCheck]);

//   // Check server health when component mounts
//   useEffect(() => {
//     checkServerStatus();
//   }, [checkServerStatus]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleFocus = (field) => {
//     setFocusedField(field);
//   };

//   const handleBlur = () => {
//     setFocusedField(null);
//   };

//   const resetForm = () => {
//     setFormData({ name: "", email: "", message: "" });
//     setSubmitted(false);
//     setError(false);
//   };

//   const sendEmail = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(false);

//     // Better messaging based on server status
//     if (serverStatus === 'offline') {
//       toast.custom((t) => (
//         <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg">
//           <Loader2 className="text-yellow-500 animate-spin" size={18} />
//           <p>Server might be warming up. Your message will still be sent. Please wait...</p>
//         </div>
//       ));
//     } else if (serverStatus === 'unknown') {
//       toast.custom((t) => (
//         <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
//           <Loader2 className="text-blue-500 animate-spin" size={18} />
//           <p>Server status unknown. We'll try to send your message anyway...</p>
//         </div>
//       ));
//     }

//     try {
//       // Create an AbortController to handle timeouts
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => {
//         controller.abort();
//         handleSubmissionError('Request timed out. The server might be starting up. Please try again in a minute.');
//       }, API_TIMEOUT);

//       const response = await fetch(`${API_URL}/send-email`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           email: formData.email, 
//           message: formData.message,
//           name: formData.name
//         }),
//         signal: controller.signal,
//       });
      
//       // Clear the timeout since the request completed
//       clearTimeout(timeoutId);
      
//       const data = await response.json();
      
//       setLoading(false);
      
//       if (response.ok && data.message === "Email sent successfully") {
//         setSubmitted(true);
//         // Server is definitely online if we got here
//         setServerStatus('online');
//         toast.custom((t) => (
//           <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
//             <CheckCircle className="text-green-500" size={18} />
//             <p>Message sent successfully!</p>
//           </div>
//         ));
//       } else {
//         handleSubmissionError('Server returned an error: ' + (data.error || 'Unknown error'));
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         // Already handled in the timeout callback
//       } else {
//         handleSubmissionError('Failed to send message: ' + error.message);
//       }
//     }
//   };

//   const handleSubmissionError = (errorMsg) => {
//     setLoading(false);
//     setError(true);
    
//     toast.custom(() => (
//       <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
//         <XCircle className="text-red-500" size={18} />
//         <p>{errorMsg}</p>
//       </div>
//     ));
//   };

//   const inputClasses = (field) => `
//     w-full px-4 py-3 border rounded-lg transition-all
//     ${focusedField === field ? 'border-black ring-1 ring-black' : 'border-gray-200'} 
//     focus:ring-black focus:border-black
//   `;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Check server status before attempting submission
//     if (serverStatus === 'unknown') {
//       await checkServerStatus();
//     }
    
//     // Additional client-side validation
//     if (!name || !email || !message) {
//       toast({
//         title: "Error",
//         description: "Please fill out all required fields",
//         variant: "destructive",
//       });
//       setIsSubmitting(false);
//       return;
//     }
    
//     // If server is offline and we're not in development mode
//     if (serverStatus === 'offline' && import.meta.env.MODE === 'production') {
//       toast({
//         title: "Server Unavailable",
//         description: "Our server is currently waking up from sleep mode. Please try again in a few moments.",
//         variant: "warning",
//         duration: 5000,
//       });
//       // Auto retry server health check
//       setTimeout(checkServerStatus, 3000);
//       setIsSubmitting(false);
//       return;
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    
//     try {
//       const response = await fetch(`${API_URL}/contact`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           message,
//         }),
//         signal: controller.signal
//       });
      
//       clearTimeout(timeoutId);
      
//       if (response.ok) {
//         // Successfully submitted
//         setSuccess(true);
//         resetForm();
//         toast({
//           title: "Message Sent",
//           description: "I'll get back to you soon!",
//           variant: "success",
//         });
//         // Update server status since we know it's responsive
//         setServerStatus('online');
//         setLastCheck(Date.now());
//       } else {
//         const data = await response.json().catch(() => ({}));
//         toast({
//           title: "Error",
//           description: data.message || "Something went wrong. Please try again.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         toast({
//           title: "Request Timeout",
//           description: "The server took too long to respond. It might be waking up from sleep mode. Please try again.",
//           variant: "warning",
//           duration: 5000,
//         });
//         // Retry the server health check
//         setTimeout(checkServerStatus, 2000);
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to send message. Please try again later.",
//           variant: "destructive",
//         });
//         console.error("Form submission error:", error);
//         // Mark server as potentially offline
//         setServerStatus('unknown');
//         // Re-check server status
//         setTimeout(checkServerStatus, 2000);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
//       {/* Particle background for subtle movement */}
//       <ParticleBackground quantity={30} staticity={30} ease={40} color="#000000" className="opacity-40 z-0" />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
//           {/* Left column - Text content */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <motion.span 
//               className="block mb-3 text-sm font-medium tracking-wider"
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4 }}
//             >
//               GET IN TOUCH
//             </motion.span>
            
//             <AnimatedText
//               text="Let's work together"
//               className="text-3xl md:text-5xl font-bold mb-6"
//               once={true}
//               delay={0.1}
//             />
            
//             <motion.p 
//               className="text-gray-600 mb-8 md:text-lg md:pr-8"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               I'm currently open to freelance opportunities and collaborative tech projects.
//               With hands-on experience in Java, Python, MySQL, and machine learning, I enjoy building data-driven applications and user-focused software solutions.
//               If you have a project idea or need support with development, automation, or predictive modeling — feel free to connect with me!
//             </motion.p>
            
//             <div className="space-y-6">
//               <motion.div 
//                 className="flex items-start gap-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//               >
//                 <motion.div 
//                   className="bg-white p-3 rounded-full shadow-sm"
//                   whileHover={{ 
//                     scale: 1.1, 
//                     backgroundColor: "#000",
//                     color: "#fff"
//                   }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Mail className="w-5 h-5" />
//                 </motion.div>
//                 <div>
//                   <h3 className="font-medium mb-1">Email</h3>
//                   <a 
//                     href="mailto:saikamalesh415@gmail.com" 
//                     className="text-gray-600 hover:text-black transition-colors relative group"
//                   >
//                     saikamalesh415@gmail.com
//                     <motion.span 
//                       className="absolute bottom-0 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"
//                       whileHover={{ width: "100%" }}
//                     />
//                   </a>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="flex items-start gap-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//               >
//                 <motion.div 
//                   className="bg-white p-3 rounded-full shadow-sm"
//                   whileHover={{ 
//                     scale: 1.1, 
//                     backgroundColor: "#000",
//                     color: "#fff"
//                   }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <MapPin className="w-5 h-5" />
//                 </motion.div>
//                 <div>
//                   <h3 className="font-medium mb-1">Location</h3>
//                   <p className="text-gray-600">
//                     Visakhapatnam, India
//                   </p>
//                 </div>
//               </motion.div>
//             </div>
            
//             {/* Decorative element */}
//             <motion.div
//               className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl opacity-20"
//               animate={{ 
//                 scale: [1, 1.2, 1],
//               }}
//               transition={{
//                 duration: 8,
//                 repeat: Infinity,
//                 repeatType: "reverse"
//               }}
//             />
//           </motion.div>
          
//           {/* Right column - Contact Form or Success Message */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="bg-white rounded-2xl shadow-sm p-8 md:p-10 relative overflow-hidden min-h-[450px]"
//           >
//             <AnimatePresence mode="wait">
//               {submitted ? (
//                 <motion.div
//                   key="success"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.5 }}
//                   className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8"
//                 >
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: [0, 1.2, 1] }}
//                     transition={{ 
//                       duration: 0.8, 
//                       times: [0, 0.6, 1],
//                       ease: "easeInOut"
//                     }}
//                     className="flex items-center justify-center mb-8"
//                   >
//                     <div className="relative">
//                       <motion.div 
//                         className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
//                       >
//                         <CheckCircle className="w-10 h-10 text-green-600" />
//                       </motion.div>
//                       <motion.div
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ 
//                           scale: [0, 1.5, 1],
//                           opacity: [0, 0.8, 0]
//                         }}
//                         transition={{ 
//                           duration: 1.5,
//                           delay: 0.2,
//                           repeat: 2,
//                           repeatDelay: 1
//                         }}
//                         className="absolute inset-0 rounded-full border-4 border-green-400"
//                       />
//                     </div>
//                   </motion.div>
                  
//                   <motion.div 
//                     className="text-center w-full max-w-sm px-4"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.3, delay: 0.5 }}
//                   >
//                     <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
//                     <p className="text-gray-600 mb-8 text-base">
//                       Thanks for reaching out. I'll get back to you soon.
//                     </p>
                    
//                     <motion.button
//                       onClick={resetForm}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-6 py-3 bg-black text-white rounded-lg font-medium"
//                     >
//                       Send another message
//                     </motion.button>
//                   </motion.div>
                  
//                   {/* Success animation particles */}
//                   <AnimatePresence>
//                     {[...Array(10)].map((_, i) => (
//                       <motion.div
//                         key={`particle-${i}`}
//                         initial={{ 
//                           x: 0, 
//                           y: 0,
//                           opacity: 0,
//                           scale: 0
//                         }}
//                         animate={{ 
//                           x: (Math.random() - 0.5) * 200,
//                           y: (Math.random() - 0.5) * 200,
//                           opacity: [0, 1, 0],
//                           scale: [0, 1, 0.5, 0]
//                         }}
//                         transition={{ 
//                           duration: 1.5 + Math.random(),
//                           delay: 0.2 + i * 0.1,
//                           ease: "easeOut"
//                         }}
//                         className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
//                         style={{ 
//                           backgroundColor: i % 3 === 0 ? '#10B981' : i % 2 === 0 ? '#000000' : '#FBBF24',
//                           zIndex: 20
//                         }}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </motion.div>
//               ) : (
//                 <motion.form
//                   key="form"
//                   onSubmit={sendEmail} 
//                   className="space-y-6"
//                   initial={{ opacity: 1 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Name
//                     </label>
//                     <motion.div
//                       whileFocus={{ scale: 1.01 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         onFocus={() => handleFocus('name')}
//                         onBlur={handleBlur}
//                         placeholder="Your name"
//                         required
//                         className={inputClasses('name')}
//                       />
//                     </motion.div>
//                   </div>
                  
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                     </label>
//                     <motion.div
//                       whileFocus={{ scale: 1.01 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         onFocus={() => handleFocus('email')}
//                         onBlur={handleBlur}
//                         placeholder="your@email.com"
//                         required
//                         className={inputClasses('email')}
//                       />
//                     </motion.div>
//                   </div>
                  
//                   <div>
//                     <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
//                       Message
//                     </label>
//                     <motion.div
//                       whileFocus={{ scale: 1.01 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <textarea
//                         id="message"
//                         name="message"
//                         value={formData.message}
//                         onChange={handleChange}
//                         onFocus={() => handleFocus('message')}
//                         onBlur={handleBlur}
//                         placeholder="Tell me about your project..."
//                         required
//                         rows={5}
//                         className={`${inputClasses('message')} resize-none`}
//                       />
//                     </motion.div>
//                   </div>
                  
//                   {serverStatus === 'offline' && (
//                     <div className="text-sm text-yellow-600 flex items-center gap-2">
//                       <Loader2 className="animate-spin" size={14} />
//                       <span>Server is warming up. Submission may take a little longer.</span>
//                     </div>
//                   )}
                  
//                   <motion.button
//                     type="submit"
//                     disabled={loading}
//                     whileHover={{ scale: 1.02, backgroundColor: "#111" }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`w-full py-4 px-6 bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2 ${
//                       loading ? "opacity-70" : ""
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 size={18} className="animate-spin" />
//                         <span>Sending...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Send message</span>
//                         <motion.div
//                           animate={{ x: [0, 5, 0] }}
//                           transition={{ 
//                             duration: 1.5,
//                             repeat: Infinity,
//                             repeatType: "loop",
//                             ease: "easeInOut",
//                             repeatDelay: 1
//                           }}
//                         >
//                           <Send size={18} />
//                         </motion.div>
//                       </>
//                     )}
//                   </motion.button>
//                 </motion.form>
//               )}
//             </AnimatePresence>
            
//             {/* Decorative dots pattern */}
//             <div className="absolute -right-12 -bottom-12 w-24 h-24 grid grid-cols-3 gap-2 opacity-10">
//               {[...Array(9)].map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="w-2 h-2 rounded-full bg-black"
//                   initial={{ opacity: 0.3 }}
//                   animate={{ opacity: [0.3, 0.8, 0.3] }}
//                   transition={{ 
//                     duration: 3, 
//                     delay: i * 0.2,
//                     repeat: Infinity,
//                     repeatType: "reverse" 
//                   }}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ParticleBackground } from "../../components/ui/particle-background";
import { AnimatedText } from "../../components/ui/animated-text";

// API endpoint configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_TIMEOUT = 20000; // 20 seconds timeout

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
  const [lastCheck, setLastCheck] = useState(0);

  // A ref for intersection observer when we want to control particle activation:
  const sectionRef = useRef(null);
  const [particlesActive, setParticlesActive] = useState(false);

  // Observe when section is in viewport so we can enable/disable heavy animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // when >20% visible, let particles run
        setParticlesActive(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.5] }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const checkServerStatus = useCallback(async (retries = 2) => {
    // Avoid spamming checks if server is online and was checked recently
    if (serverStatus === 'online' && Date.now() - lastCheck < 60000) {
      return;
    }

    setServerStatus('unknown');
    setLastCheck(Date.now());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => checkServerStatus(retries - 1), 3000);
      } else {
        console.error('Server health check error:', err);
        setServerStatus('offline');
      }
    }
  }, [serverStatus, lastCheck]);

  // Run health check only once on mount (prevents extra re-run loops)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    checkServerStatus();
    // We intentionally run this only once on mount to reduce re-renders
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" });
    setSubmitted(false);
    setError(false);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    if (serverStatus === 'offline') {
      toast.custom(() => (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg">
          <Loader2 className="text-yellow-500 animate-spin" size={18} />
          <p>Server might be warming up. Your message will still be sent. Please wait...</p>
        </div>
      ));
    } else if (serverStatus === 'unknown') {
      toast.custom(() => (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
          <Loader2 className="text-blue-500 animate-spin" size={18} />
          <p>Server status unknown. We'll try to send your message anyway...</p>
        </div>
      ));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        handleSubmissionError('Request timed out. The server might be starting up. Please try again in a minute.');
      }, API_TIMEOUT);

      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          name: formData.name
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));
      setLoading(false);

      if (response.ok && data.message === "Email sent successfully") {
        setSubmitted(true);
        setServerStatus('online');
        toast.custom(() => (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
            <CheckCircle className="text-green-500" size={18} />
            <p>Message sent successfully!</p>
          </div>
        ));
      } else {
        handleSubmissionError('Server returned an error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // handled above by timeout handler
      } else {
        handleSubmissionError('Failed to send message: ' + err.message);
      }
    }
  };

  const handleSubmissionError = (errorMsg) => {
    setLoading(false);
    setError(true);

    toast.custom(() => (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
        <XCircle className="text-red-500" size={18} />
        <p>{errorMsg}</p>
      </div>
    ));
  };

  const inputClasses = (field) => `
    w-full px-4 py-3 border rounded-lg transition-all
    ${focusedField === field ? 'border-black ring-1 ring-black' : 'border-gray-200'} 
    focus:ring-black focus:border-black
  `;

  // Education / contact layout remains exactly as you wrote — only the background elements are contained
  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Particle background: absolutely positioned so it never affects layout */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* If ParticleBackground is expensive, rendering it in an absolutely positioned container prevents layout changes when it animates */}
        {particlesActive && (
          <ParticleBackground quantity={30} staticity={30} ease={40} color="#000000" className="opacity-40" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="block mb-3 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              GET IN TOUCH
            </motion.span>

            <AnimatedText
              text="Let's work together"
              className="text-3xl md:text-5xl font-bold mb-6"
              once={true}
              delay={0.1}
            />

            <motion.p
              className="text-gray-600 mb-8 md:text-lg md:pr-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I'm currently open to freelance opportunities and collaborative tech projects.
              With hands-on experience in Java, Python, MySQL, and machine learning, I enjoy building data-driven applications and user-focused software solutions.
              If you have a project idea or need support with development, automation, or predictive modeling — feel free to connect with me!
            </motion.p>

            <div className="space-y-6">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="bg-white p-3 rounded-full shadow-sm pointer-events-none"
                  whileHover={{
                    scale: 1.03
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a
                    href="mailto:saikamalesh415@gmail.com"
                    className="text-gray-600 hover:text-black transition-colors relative group"
                  >
                    saikamalesh415@gmail.com
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"
                    />
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="bg-white p-3 rounded-full shadow-sm pointer-events-none"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-gray-600">Visakhapatnam, India</p>
                </div>
              </motion.div>
            </div>

            {/* decorative blob: absolute and removed from layout flow */}
            <motion.div
              className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl opacity-20 pointer-events-none"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{ willChange: "transform", transformOrigin: "center" }}
            />
          </motion.div>

          {/* Right column - Contact Form or Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-8 md:p-10 relative overflow-hidden min-h-[450px]"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{
                      duration: 0.8,
                      times: [0, 0.6, 1],
                      ease: "easeInOut"
                    }}
                    className="flex items-center justify-center mb-8"
                  >
                    <div className="relative">
                      <motion.div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.5, 1],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.2,
                          repeat: 2,
                          repeatDelay: 1
                        }}
                        className="absolute inset-0 rounded-full border-4 border-green-400 pointer-events-none"
                      />
                    </div>
                  </motion.div>

                  <motion.div className="text-center w-full max-w-sm px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
                    <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                    <p className="text-gray-600 mb-8 text-base">Thanks for reaching out. I'll get back to you soon.</p>

                    <motion.button
                      onClick={resetForm}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-black text-white rounded-lg font-medium"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>

                  {/* Success particles — absolutely positioned (do not affect layout) */}
                  <AnimatePresence>
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.5, 0]
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          delay: 0.2 + i * 0.1,
                          ease: "easeOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full pointer-events-none"
                        style={{
                          backgroundColor: i % 3 === 0 ? "#10B981" : i % 2 === 0 ? "#000000" : "#FBBF24",
                          zIndex: 20
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={sendEmail} className="space-y-6" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} onFocus={() => handleFocus('name')} onBlur={handleBlur} placeholder="Your name" required className={inputClasses('name')} />
                    </motion.div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => handleFocus('email')} onBlur={handleBlur} placeholder="your@email.com" required className={inputClasses('email')} />
                    </motion.div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} onFocus={() => handleFocus('message')} onBlur={handleBlur} placeholder="Tell me about your project..." required rows={5} className={`${inputClasses('message')} resize-none`} />
                    </motion.div>
                  </div>

                  {serverStatus === 'offline' && (
                    <div className="text-sm text-yellow-600 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={14} />
                      <span>Server is warming up. Submission may take a little longer.</span>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, backgroundColor: "#111" }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2 ${loading ? "opacity-70" : ""}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send message</span>
                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}>
                          <Send size={18} />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Decorative dots pattern — absolute so it does not modify layout */}
            <div className="absolute -right-12 -bottom-12 w-24 h-24 grid grid-cols-3 gap-2 opacity-10 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-black"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
