import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Gameheader from "../../header/Gameheader";
import Sidebar from "../../sidebar/Sidebar";
import GameTags from "./GameTags";
import { FaExpand, FaCompress, FaCheckCircle, FaExclamationTriangle, FaSync } from "react-icons/fa";
import axios from "axios";
import loading_logo from "../../../assets/logo.png"

const Gamepage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameUrl, setGameUrl] = useState(null);
  const [gameName, setGameName] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameTags, setGameTags] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sessionId, setSessionId] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validating, setValidating] = useState(false);
  const [autoValidationRun, setAutoValidationRun] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // State for controlling sidebar popup and active tab
  const [showPopup, setShowPopup] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('আমার অ্যাকাউন্ট');
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch game tags
  useEffect(() => {
    const fetchGameTags = async () => {
      try {
        // Get expand parameter from URL or use default
        const urlParams = new URLSearchParams(window.location.search);
        const expandParam = urlParams.get('expand') || 'false';
        const response = await fetch(`${API_BASE_URL}/api/games/game-tags?expand=${expandParam}`);
        if (response.ok) {
          const data = await response.json();
          setGameTags(data.tags || []);
        } else {
          console.error("Failed to fetch game tags");
        }
      } catch (error) {
        console.error("Error fetching game tags:", error);
      }
    };

    fetchGameTags();
  }, [API_BASE_URL]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Load game data from location state or localStorage
  useEffect(() => {
    if (location.state?.gameUrl) {
      const { gameUrl, gameName, isDemo, sessionId } = location.state;
      setGameUrl(gameUrl);
      setGameName(gameName || "Game");
      setIsDemo(isDemo || false);
      setSessionId(sessionId || null);
      
      localStorage.setItem(
        "currentGame",
        JSON.stringify({
          gameUrl,
          gameName: gameName || "Game",
          isDemo: isDemo || false,
          sessionId: sessionId || null,
          timestamp: Date.now(),
        })
      );
      setLoading(false);
      return;
    }
    
    const savedGame = localStorage.getItem("currentGame");
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        if (gameData.timestamp && gameData.timestamp > oneHourAgo) {
          setGameUrl(gameData.gameUrl);
          setGameName(gameData.gameName || "Game");
          setIsDemo(gameData.isDemo || false);
          setSessionId(gameData.sessionId || null);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem("currentGame");
          setError("Game session expired");
          setLoading(false);
          setTimeout(() => navigate("/"), 3000);
          return;
        }
      } catch {
        localStorage.removeItem("currentGame");
        setError("Invalid game data");
        setLoading(false);
        setTimeout(() => navigate("/"), 3000);
        return;
      }
    }
    setError("Game URL not found");
    setLoading(false);
    setTimeout(() => navigate("/"), 3000);
  }, [location, navigate]);

  // Handle page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isReloading", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const isReloading = sessionStorage.getItem("isReloading");
    if (isReloading === "true") {
      sessionStorage.removeItem("isReloading");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Simulate progress bar animation
  useEffect(() => {
    if (!iframeLoaded && gameUrl) {
      let interval;
      let currentProgress = 0;
      
      interval = setInterval(() => {
        if (currentProgress < 90) {
          // Slow down as we approach 90%
          const increment = currentProgress < 30 ? 4 : currentProgress < 60 ? 3 : 2;
          currentProgress = Math.min(currentProgress + increment, 90);
          setProgress(currentProgress);
        }
      }, 100);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [iframeLoaded, gameUrl]);

  // Complete progress when iframe loads
  useEffect(() => {
    if (iframeLoaded) {
      setProgress(100);
      setTimeout(() => {
        setShowLoader(false);
      }, 400);
    }
  }, [iframeLoaded]);

  // Hide loader after 5 seconds (fallback)
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => setIframeLoaded(true);
  
  const handleBackToGames = () => {
    localStorage.removeItem("currentGame");
    navigate("/");
  };
  
  const handleRefreshGame = () => {
    if (!gameUrl) return;
    setIframeLoaded(false);
    setProgress(0);
    setShowLoader(true);
    const iframe = document.querySelector(".game-iframe");
    if (iframe) iframe.src = iframe.src;
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    const gameContainer = document.querySelector(".game-container");
    
    if (!document.fullscreenElement) {
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error("Error attempting to enable fullscreen:", err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error("Error attempting to exit fullscreen:", err));
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle tag click
  const handleTagClick = (tag) => {
    navigate(`/games?tag=${tag.name}`);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-56px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-56px)]">
          <div className="bg-white border border-gray-200 p-8 rounded-xl text-center max-w-md shadow-lg">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Game Not Available</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBackToGames}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen font-anek bg-white">
      {/* Header with white background - hidden on mobile when in fullscreen mode */}
      {(!isMobile || !isFullscreen) && (
        <div className="hidden md:block">
          <Header 
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            activeLeftTab={activeLeftTab}
            setActiveLeftTab={setActiveLeftTab}
          />
        </div>
      )}
      
      <div className="flex">
        {/* Fixed Sidebar with white background - hidden on mobile */}
        {!isMobile && (
          <div className="hidden md:block">
            <Sidebar 
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              activeLeftTab={activeLeftTab}
              setActiveLeftTab={setActiveLeftTab}
            />
          </div>
        )}

        {/* Scrollable Content */}
        <div className={`${isMobile ? 'w-full' : 'ml-0 md:ml-[330px] w-full'}`}>
          {/* Main content container */}
          <div className={`${isMobile ? 'mx-0' : 'mx-auto md:px-4 max-w-screen-xl'} md:py-[20px]`}>
            {/* Game box */}
            <div className="game-container border border-gray-200 bg-white shadow-lg overflow-hidden relative">
              {/* Top strip / meta info - hidden on mobile */}
              {!isMobile && (
                <div className="hidden md:flex items-center justify-between px-4 lg:px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm md:text-xl font-semibold text-gray-800 drop-shadow-sm">{gameName}</div>
                      <div className="text-[11px] md:text-sm text-teal-600 font-medium">
                        {isDemo ? "DEMO MODE" : "REAL MONEY MODE"}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {/* Refresh button */}
                    <button
                      onClick={handleRefreshGame}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg border border-gray-200 transition-all duration-200"
                      aria-label="Refresh game"
                    >
                      <FaSync className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Iframe container */}
              <div 
                className="relative" 
                style={{ 
                  height: isMobile 
                    ? `calc(${windowHeight}px)` 
                    : "calc(100vh - 220px)" 
                }}
              >
                {gameUrl && (
                  <>
                    <iframe
                      src={gameUrl}
                      className="game-iframe"
                      frameBorder="0"
                      allowFullScreen
                      title={gameName}
                      onLoad={handleIframeLoad}
                      style={{
                        width: "100%",
                        height: "100%",
                        opacity: iframeLoaded ? 1 : 0,
                        position: "absolute",
                        inset: 0,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                      allow="autoplay; encrypted-media; fullscreen"
                    />

                    {!iframeLoaded && showLoader && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center">
                        {/* Animated Gradient Progress Bar Container */}
                        <div className="w-80 md:w-96 max-w-[85%]">
                          {/* Progress Bar Label */}
                          <div className="flex justify-center items-center mb-3  m-auto">
                            <img src={loading_logo} className="w-[150px]" alt="" />
                          </div>
                          
                          {/* Gradient Progress Bar */}
                          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
                              style={{ 
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #14b8a6, #8b5cf6, #ec489a)',
                                backgroundSize: '200% 100%',
                                animation: progress < 100 ? 'gradientShift 1.5s ease infinite' : 'none'
                              }}
                            >
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                          </div>
                          
                          {/* Dynamic Loading Message */}
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 font-medium animate-pulse">
                              {progress === 100 ? "Game is ready!" : 
                               progress < 20 ? "🎮 Initializing game engine..." : 
                               progress < 40 ? "📦 Loading game assets..." : 
                               progress < 60 ? "⚙️ Configuring settings..." : 
                               progress < 80 ? "🎨 Preparing graphics..." : 
                               "✨ Almost there..."}
                            </p>
                            {progress < 100 && (
                              <div className="mt-2 flex justify-center gap-1">
                                <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Game controls */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      {/* Refresh button for mobile */}
                      {isMobile && (
                        <button
                          onClick={handleRefreshGame}
                          className="bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-lg border border-gray-200 shadow-md transition-all duration-200"
                          aria-label="Refresh game"
                        >
                          <FaSync className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                      
                      {/* Fullscreen button */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-lg border border-gray-200 shadow-md transition-all duration-200 hover:scale-105"
                        aria-label="Toggle fullscreen"
                      >
                        {isFullscreen ? (
                          <FaCompress className="h-4 w-4 text-gray-600" />
                        ) : (
                          <FaExpand className="h-4 w-4 text-gray-600" />
                        )}
                      </button>

                      {/* Validation status indicator for mobile */}
                      {sessionId && validationStatus && isMobile && (
                        <div className={`p-2 rounded-lg border shadow-md ${
                          validationStatus.success 
                            ? "bg-green-50 border-green-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          {validationStatus.success ? (
                            <FaCheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <FaExclamationTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Game tags - hidden on mobile when in fullscreen */}
            {(!isMobile || !isFullscreen) && gameTags.length > 0 && (
              <div className="mt-4 px-4">
                <GameTags tags={gameTags} onTagClick={handleTagClick} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </section>
  );
};

export default Gamepage;