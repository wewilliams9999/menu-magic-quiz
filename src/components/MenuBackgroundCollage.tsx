
import { motion } from "framer-motion";

interface MenuBackgroundCollageProps {
  enabled?: boolean;
}

const MenuBackgroundCollage = ({ enabled = true }: MenuBackgroundCollageProps) => {
  // Placeholder menu images from Nashville-style restaurants
  const menuImages = [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", // Menu board
    "https://images.unsplash.com/photo-1559847844-d72047d81e92?w=400&h=300&fit=crop", // Restaurant menu
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop", // Menu pages
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&h=300&fit=crop", // Food menu
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", // Chalkboard menu
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", // Pizza menu
  ];

  if (!enabled) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {menuImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ delay: index * 0.2, duration: 1 }}
          className="absolute"
          style={{
            left: `${(index % 3) * 35 + 10}%`,
            top: `${Math.floor(index / 3) * 40 + 15}%`,
            transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (5 + index * 2)}deg)`,
          }}
        >
          <div
            className="w-48 h-36 bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${image})`,
              filter: 'sepia(0.3) contrast(0.8) brightness(0.9)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MenuBackgroundCollage;
