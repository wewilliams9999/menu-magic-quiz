
import WelcomeScreen from "@/components/WelcomeScreen";

const WelcomePage = () => {
  const handleStart = () => {
    // Navigate to quiz or handle start action
    window.location.href = "/quiz";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 relative">
      {/* Background logo */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-0 opacity-10"
        aria-hidden="true"
      >
        <div 
          className="w-[60vmin] h-[60vmin] bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
          }}
        />
      </div>
      
      <div className="relative z-10">
        <WelcomeScreen onStart={handleStart} />
      </div>
    </div>
  );
};

export default WelcomePage;
