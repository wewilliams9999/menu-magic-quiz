
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/welcome");
  };
  
  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Main Logo */}
      <div className="flex flex-col items-center justify-center text-center z-10">
        <div 
          className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-center bg-contain bg-no-repeat mb-8"
          style={{
            backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
          }}
        />
        
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-blue-400 text-2xl md:text-3xl font-bold italic">
            Tune in to Nashville's
          </p>
          <p className="text-blue-400 text-2xl md:text-3xl font-bold italic">
            Tastiest Spots
          </p>
        </motion.div>
      </div>
      
      {/* Click to continue text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-white text-xl z-10 absolute bottom-20"
      >
        Click anywhere to continue
      </motion.div>
    </div>
  );
};

export default Index;
