
interface MapBackgroundProps {
  children?: React.ReactNode;
}

const MapBackground = ({ children }: MapBackgroundProps) => {
  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="absolute h-full w-full overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M18,0 Q22,5 25,10 Q30,20 35,25 Q38,28 40,35 Q42,40 45,42 Q47,45 50,50 Q53,55 58,58 Q63,62 65,70 Q67,78 70,85 Q72,92 75,100" 
              fill="none" 
              stroke="#0EA5E9" 
              strokeWidth="3" 
              className="dark:stroke-[#33C3F0] opacity-70" 
            />
          </svg>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: `
                linear-gradient(to right, #9ca3af 1px, transparent 1px),
                linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        <div className="absolute w-[12%] h-[12%] rounded-full bg-white dark:bg-gray-700 opacity-20 left-[46%] top-[47%] blur-sm"></div>
      </div>
      
      {children}
    </div>
  );
};

export default MapBackground;
