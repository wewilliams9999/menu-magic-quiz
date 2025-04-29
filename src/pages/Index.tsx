
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/welcome");
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Logo Background with full visibility */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
          backgroundSize: 'cover',
          filter: 'contrast(1.2) brightness(1.1)'
        }}
      />
      
      {/* Subtle indication to click */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-white text-xl z-10"
      >
        Click anywhere to continue
      </motion.div>
    </div>
  );
};

export default Index;
