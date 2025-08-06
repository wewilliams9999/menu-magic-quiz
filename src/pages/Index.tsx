
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Index = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/welcome");
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer bg-black"
      onClick={handleClick}
    >
      
      {/* Logo Background with improved sizing for cross-browser compatibility */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div 
          className="w-[40vmin] h-[40vmin] rounded-full overflow-hidden flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(139, 0, 0, 0.9))'
          }}
        >
          <img 
            src="/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png"
            alt="Logo"
            className="w-[120%] h-[120%] object-cover object-center"
          />
        </div>
      </div>
      
      {/* Immediate instruction to click with subtle pulse animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8 }}
        className="text-white text-lg sm:text-xl z-20 mt-8 animate-pulse"
      >
        Click anywhere to continue
      </motion.div>
    </div>
  );
};

export default Index;
