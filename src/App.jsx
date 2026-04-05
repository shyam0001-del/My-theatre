import { useState, useRef } from "react";
import curtainVideo from "./assets/curtain.mp4";
import "./index.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const [audios, setAudios] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [theatreName, setTheatreName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);

  const [showAudience, setShowAudience] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // 🔥 NEW

  const videoRef = useRef();
  const audioRef = useRef();

  const videoInputRef = useRef();
  const audioInputRef = useRef();

  // 🎥 Upload videos
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));

    setVideos((prev) => {
      let updated = [...prev, ...urls];
      if (updated.length > 5) {
        updated = updated.slice(updated.length - 5);
      }
      return updated;
    });

    setCurrentVideo(urls[urls.length - 1]);
  };

  // 🎵 Upload audios
  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));

    setAudios((prev) => {
      let updated = [...prev, ...urls];
      if (updated.length > 5) {
        updated = updated.slice(updated.length - 5);
      }
      return updated;
    });

    setCurrentAudio(urls[urls.length - 1]);
  };

  // 🔥 SYNC
  const handlePlay = () => {
    if (!audioRef.current || !videoRef.current) return;

    if (videoRef.current.currentTime === 0) {
      audioRef.current.currentTime = 0;
    }

    audioRef.current.play();
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setShowAudience(false);
  };

  // 🎛 Controls
  const playVideo = () => {
    videoRef.current?.play();
    setShowAudience(true);
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
    setShowAudience(false);
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setShowAudience(true);
  };

  // 🔊 MUTE TOGGLE
  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMute = !isMuted;

    videoRef.current.muted = newMute;

    if (audioRef.current) {
      audioRef.current.muted = newMute;
    }

    setIsMuted(newMute);
  };

  return (
    <div className="container">

      {isOpen && (
        <>
          {currentAudio && <audio ref={audioRef} src={currentAudio} />}

          <div className="theatre-board">
            <div className="theatre-title">{theatreName}</div>
            <div className="exit-sign" onClick={() => setIsOpen(false)}>
              OPEN
            </div>
          </div>

          <div className="player-wrapper">

            <div className="screen">
              {currentVideo ? (
                <video
                  ref={videoRef}
                  src={currentVideo}
                  muted={isMuted || !!currentAudio}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ) : (
                <div className="screen-placeholder">
                  Select video
                </div>
              )}
            </div>

            {currentVideo && (
              <div className="controls">
                <button onClick={restartVideo}>⏮</button>
                <button onClick={playVideo}>▶</button>
                <button onClick={pauseVideo}>⏸</button>

                {/* 🔊 NEW BUTTON */}
                <button onClick={toggleMute}>
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>
            )}
          </div>

          {showAudience && (
            <div className="audience-global">
              {[...Array(4)].map((_, row) => (
                <div key={row} className="audience-row">
                  {[...Array(60)].map((_, i) => (
                    <div key={i} className="person"></div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* 🎵 AUDIO PANEL */}
          <div className="audio-panel">
            <input
              type="file"
              accept="audio/*"
              ref={audioInputRef}
              onChange={handleAudioUpload}
              hidden
            />

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="audio-box">
                {audios[i] ? (
                  <div
                    className="audio-item"
                    onClick={() => setCurrentAudio(audios[i])}
                  >
                    🎵
                  </div>
                ) : (
                  <div
                    className="add-box"
                    onClick={() => audioInputRef.current.click()}
                  >
                    +
                  </div>
                )}
              </div>
            ))}

            <div className="upload-btn" onClick={() => audioInputRef.current.click()}>
              Add Audios
            </div>
          </div>

          {/* 🎥 VIDEO PANEL */}
          <div className="video-panel">
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoUpload}
              hidden
            />

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="video-box">
                {videos[i] ? (
                  <video
                    src={videos[i]}
                    onClick={() => setCurrentVideo(videos[i])}
                  />
                ) : (
                  <div
                    className="add-box"
                    onClick={() => videoInputRef.current.click()}
                  >
                    +
                  </div>
                )}
              </div>
            ))}

            <div className="upload-btn" onClick={() => videoInputRef.current.click()}>
              Add Videos
            </div>
          </div>
        </>
      )}

      {/* 🎭 OPEN SCREEN */}
      <div className={`curtain-container ${isOpen ? "open-mode" : ""}`}>
        <video
          className={`curtain-video ${isOpen ? "open" : "close"}`}
          src={curtainVideo}
          autoPlay
          loop
          muted
        />

        {!isOpen && (
          <div className="curtain-text">

            <h1 className="main-title">🎬 My Theatre</h1>

            <p className="subtitle">
              Your personal cinema experience
            </p>

            {!nameEntered ? (
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter theatre name..."
                  value={theatreName}
                  onChange={(e) => setTheatreName(e.target.value)}
                />

                <button
                  disabled={!theatreName.trim()}
                  onClick={() => setNameEntered(true)}
                >
                  Continue
                </button>
              </div>
            ) : (
              <button className="open-btn" onClick={() => setIsOpen(true)}>
                Enter Theatre
              </button>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;