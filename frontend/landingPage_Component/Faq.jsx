import { useState, useEffect } from 'react';
import {  Sparkles} from 'lucide-react';
import axios from 'axios';


// Individual FAQ Item with futuristic styling
const FAQItem = ({ icon, question, answer, isOpen, toggleOpen, index }) => {
  const [animationClass, setAnimationClass] = useState("");
  // Futuristic neo-brutalist FAQ content



  useEffect(() => {
    // Add staggered entrance animation
    const timer = setTimeout(() => {
      setAnimationClass("translate-x-0 opacity-100");
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transform transition-all duration-700 -translate-x-full opacity-0 ${animationClass}`}
    >
      <div className={`mb-6 overflow-hidden bg-black border-2 ${isOpen ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-gray-800'} rounded-xl transition-all duration-300`}>
        <button
          className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
          onClick={toggleOpen}
        >
          <div className="flex items-center">
            <div className={`mr-4 transition-colors duration-300 ${isOpen ? 'text-purple-400' : 'text-gray-500'}`}>
              {icon}
            </div>
            <span className={`font-mono font-extrabold text-lg ${isOpen ? 'text-purple-400' : 'text-gray-300'}`}>{question}</span>
          </div>
          <div className={`flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <Sparkles className={`${isOpen ? 'text-purple-400' : 'text-gray-500'}`} size={20} />
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-5 bg-gray-900 border-t border-gray-800">
            <p className="font-mono text-gray-300 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};



// Main cyberpunk-inspired FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [faqData , setfaqData] = useState([]);

// get faq
useEffect(() => {
  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/faq/all");
      console.log("Fetched FAQs:", response.data);

      // If the data format is { faq: [...] }
      setfaqData(response.data.faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error.response?.data || error.message);
      alert("Failed to load FAQs. Please try again.");
    }
  };

  fetchFaqs();
}, []);

  const toggleFAQ = (index) => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" bg-black text-white p-8">
      <div className={`max-w-4xl mx-auto transition-all duration-300 ${glitchEffect ? 'translate-x-1' : ''}`}>

        <div className="divide-y-0 divide-gray-800 relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-blue-900 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              icon={faq.icon}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

export default FAQ;