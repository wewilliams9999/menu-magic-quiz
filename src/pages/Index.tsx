
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MenuBackgroundCollage from "@/components/MenuBackgroundCollage";

const Index = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/welcome");
  };
  
  // Easy toggle - set this to false to disable the menu background
  const showMenuBackground = true;
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Menu Background Collage - easily toggleable */}
      <MenuBackgroundCollage enabled={showMenuBackground} />
      
      {/* Logo Background with improved sizing for cross-browser compatibility */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div 
          className="w-[80vmin] h-[80vmin] bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
            filter: 'contrast(1.2) brightness(1.1)'
          }}
        />
      </div>
      
      {/* Subtle indication to click */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-white text-xl z-20"
      >
        Click anywhere to continue
      </motion.div>
    </div>
  );
};

export default Index;
