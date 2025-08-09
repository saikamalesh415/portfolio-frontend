// Project data centralized for use across components
import GT from '../assets/GT.png';
import Synergy from '../assets/Synergy.png';
import Niri from '../assets/NiriGlobal.png';
import MMT from '../assets/make-my-trip.png';

// Centralized project data that can be used across different components
export const projects = [
  { 
    id: 1,
    title: 'Niri Global', 
    description: 'Provider of software services',
    image: Niri,
    cloudinaryUrl: 'https://res.cloudinary.com/dvfrcaw1c/image/upload/v1727845325/svfndwyjpmiieaeoriyd.png', 
    link: 'https://niriglobal.com',
    category: 'web',
    tags: ['React', 'Node.js'],
    featured: true
  },
  { 
    id: 2,
    title: 'GT Financial Services', 
    description: 'Cutting-edge fintech solutions for modern banking',
    image: GT,
    cloudinaryUrl: 'https://res.cloudinary.com/dvfrcaw1c/image/upload/v1727845324/tpzin0k1cibvcuhcxp0x.png', 
    link: 'https://gtfinancialservices.in',
    category: 'web',
    tags: ['HTML', 'Tailwind CSS', 'JavaScript'],
    featured: true
  },
  { 
    id: 3,
    title: 'Synergy Institute', 
    description: 'Advanced research facility for sustainable energy',
    image: Synergy,
    cloudinaryUrl: 'https://res.cloudinary.com/dvfrcaw1c/image/upload/v1727845324/y9nzbik6clvd8ejbkhec.png',
    link: 'https://synergyinstitutes.com',
    category: 'web',
    tags: ['React', 'Bootstrap'],
    featured: false
  },
  { 
    id: 5,
    title: 'Make My Trip', 
    description: 'It is a clone project for the assignment submission',
    image: MMT,
    cloudinaryUrl: 'https://res.cloudinary.com/dvfrcaw1c/image/upload/v1727845324/w26otp1ntl5ncqu6q9lz.png',
    link: 'https://make-my-trip-clone-lyart.vercel.app',
    category: 'web',
    tags: ['React', 'CSS'],
    featured: false
  }
];

// Helper functions to filter projects
export const getFeaturedProjects = () => projects.filter(project => project.featured);
export const getAllProjects = () => projects;
export const getProjectsByCategory = (category) => projects.filter(project => project.category === category);