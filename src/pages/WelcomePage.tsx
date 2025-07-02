
import WelcomeScreen from "@/components/WelcomeScreen";

const WelcomePage = () => {
  const handleStart = () => {
    // Navigate to quiz or handle start action
    window.location.href = "/quiz";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <WelcomeScreen onStart={handleStart} />
    </div>
  );
};

export default WelcomePage;
