import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { GhostFibers } from "../components/GhostFibers";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* GhostFibers background */}
      <div className="absolute inset-0 -z-10" style={{ width: '100%', height: '100%' }}>
        <GhostFibers
          lineColor="#1a1a1a"
          glowColor="#ef4444"
          speed={0.25}
          scale={2}
          rotation={0}
          rotationSpeed={0.2}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.8}
          brightness={2}
          blueBoost={0.8}
          vignette={0.9}
          grain={0.05}
          dpr={1}
        />
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 mb-4 animate-pulse">
          404
        </h1>
        <p className="text-gray-300 text-xl mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. But don't worry, our GhostFibers have your back!
        </p>
        <Link 
          to={ROUTES.HOME} 
          className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
