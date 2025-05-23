// import React, { useRef, useState, useEffect } from "react";
// import ReactPlayer from "react-player";
// import screenfull from "screenfull";
// import {
//   Box, IconButton, Typography, Slider, Menu, MenuItem, Tooltip
// } from "@mui/material";
// import {
//   PlayArrow, Pause, VolumeUp, VolumeOff,
//   Fullscreen, PictureInPicture, SlowMotionVideo, Videocam
// } from "@mui/icons-material";

// export interface VideoPlayerProps {
//   videoUrl: string;
//   poster: string;
//   videoId: number;
// }

// const formatTime = (s: number) => {
//   const m = Math.floor(s / 60);
//   const sec = Math.floor(s % 60);
//   return `${m}:${sec.toString().padStart(2, "0")}`;
// };

// const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster, videoId }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const playerRef = useRef<ReactPlayer>(null);

//   const [playing, setPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.8);
//   const [played, setPlayed] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [controlsVisible, setControlsVisible] = useState(true);
//   const [showPoster, setShowPoster] = useState(true);
//   const [showIndicator, setShowIndicator] = useState<"play" | "pause" | null>(null);

//   const [initialPlayed, setInitialPlayed] = useState<number | null>(null);
//   const [hasSeeked, setHasSeeked] = useState(false);

//   const lastInteraction = useRef(Date.now());
//   const progressThrottle = useRef(0);

//   useEffect(() => {
//     const saved = localStorage.getItem(`progress_${videoId}`);
//     if (saved) setInitialPlayed(parseFloat(saved));
//   }, [videoId]);

//   useEffect(() => {
//     const t = setInterval(() => {
//       if (playing && Date.now() - lastInteraction.current > 5000) {
//         setControlsVisible(false);
//       }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [playing]);

//   const handleUserInteraction = () => {
//     lastInteraction.current = Date.now();
//     setControlsVisible(true);
//   };

//   const togglePlayPause = () => {
//     const next = !playing;
//     setPlaying(next);
//     setShowIndicator(next ? "play" : "pause");
//     handleUserInteraction();
//     setTimeout(() => setShowIndicator(null), 800);
//   };

//   const handleSeek = (_: any, val: number | number[]) => {
//     const v = Array.isArray(val) ? val[0] : val;
//     playerRef.current?.seekTo(v, "fraction");
//     setPlayed(v);
//   };

//   const toggleFullScreen = () => {
//     if (screenfull.isEnabled && containerRef.current) {
//       screenfull.toggle(containerRef.current);
//     }
//   };

//   const togglePiP = () => {
//     const video = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
//     if (video && document.pictureInPictureEnabled) {
//       if (document.pictureInPictureElement) document.exitPictureInPicture();
//       else video.requestPictureInPicture();
//     }
//   };

//   const handleOpenSpeed = (e: React.MouseEvent<HTMLElement>) => {
//     e.stopPropagation();
//     setAnchorEl(e.currentTarget);
//   };

//   const changePlaybackRate = (rate: number) => {
//     setPlaybackRate(rate);
//     setAnchorEl(null);
//   };

//   const handleReady = () => {
//     if (initialPlayed && !hasSeeked && playerRef.current) {
//       playerRef.current.seekTo(initialPlayed, "fraction");
//       setHasSeeked(true);
//       if (initialPlayed > 0.9) {
//         setShowPoster(false);
//         setPlaying(false);
//       }
//     }
//   };

//   const currentPlayed = hasSeeked ? played : initialPlayed ?? 0;
//   const timeLeft = duration * (1 - currentPlayed);

//   const handleProgress = ({ played }: { played: number }) => {
//     setPlayed(played);
//     const now = Date.now();
//     if (now - progressThrottle.current > 1000) {
//       localStorage.setItem(`progress_${videoId}`, String(played));
//       progressThrottle.current = now;
//     }
//   };

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         position: "relative",
//         width: "100%",
//         aspectRatio: "16 / 9",
//         bgcolor: "#000",
//         borderRadius: 2,
//         overflow: "hidden",
//         cursor: controlsVisible ? "default" : "none"
//       }}
//       onMouseMove={handleUserInteraction}
//       onClick={(e) => {
//         const el = e.target as HTMLElement;
//         if (!el.closest(".controls")) togglePlayPause();
//       }}
//     >
//       {showPoster && (
//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage: `url(${poster})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             zIndex: 12
//           }}
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               zIndex: 14,
//               backgroundColor: "rgba(0,0,0,0.6)",
//               color: "#fff",
//               px: 1,
//               py: 0.5,
//               borderRadius: 1,
//               display: "flex",
//               alignItems: "center",
//               fontSize: 13,
//               gap: 0.5
//             }}
//           >
//             <Videocam fontSize="small" />
//             {formatTime(timeLeft)}
//           </Box>

//           <Box sx={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             height: 4,
//             width: `${currentPlayed * 100}%`,
//             bgcolor: "#f7266e",
//             zIndex: 14
//           }} />

//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowPoster(false);
//               setPlaying(true);
//               handleUserInteraction();
//             }}
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               bgcolor: "rgba(0,0,0,0.6)",
//               color: "#fff",
//               zIndex: 13,
//               width: 60,
//               height: 60,
//               "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
//             }}
//           >
//             <PlayArrow sx={{ fontSize: 40 }} />
//           </IconButton>
//         </Box>
//       )}

//       <ReactPlayer
//         ref={playerRef}
//         url={videoUrl}
//         playing={playing}
//         volume={volume}
//         playbackRate={playbackRate}
//         onProgress={handleProgress}
//         onDuration={setDuration}
//         onReady={handleReady}
//         width="100%"
//         height="100%"
//         controls={false}
//         style={{ pointerEvents: "none", objectFit: "cover" }}
//         config={{
//           file: {
//             attributes: {
//               controlsList: "nodownload",
//               disablePictureInPicture: false
//             }
//           }
//         }}
//       />

//       {showIndicator && (
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: 20,
//             pointerEvents: "none",
//             animation: "fadeOutZoom 0.8s ease forwards",
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: "50%",
//             width: 100,
//             height: 100,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}
//         >
//           {showIndicator === "play"
//             ? <PlayArrow sx={{ fontSize: 60, color: "#fff" }} />
//             : <Pause sx={{ fontSize: 60, color: "#fff" }} />}
//         </Box>
//       )}

//       <Box
//         className="controls"
//         sx={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           opacity: controlsVisible ? 1 : 0,
//           transition: "opacity 0.3s ease",
//           display: "flex",
//           flexDirection: "column",
//           zIndex: 10,
//           pointerEvents: "auto",
//           background: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
//           pb: 0.5
//         }}
//       >
//         <Box sx={{ px: 1.5, mb: 0.5 }}>
//           <Slider
//             value={played}
//             onChange={handleSeek}
//             step={0.001}
//             min={0}
//             max={1}
//             sx={{
//               color: "#f7266e",
//               height: 4,
//               "& .MuiSlider-thumb": { width: 10, height: 10 },
//               "& .MuiSlider-track": { border: "none" }
//             }}
//           />
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "space-between", px: 1.5, pb: 1, mt: -0.5 }}>
//           <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//             <Tooltip title="Play/Pause" arrow>
//               <IconButton onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
//                 sx={{
//                   bgcolor: "rgba(0,0,0,0.2)",
//                   borderRadius: "50%",
//                   color: "#fff",
//                   p: 1,
//                   outline: "none",
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.2)",
//                   },
//                   "&:focus": {
//                     outline: "none",
//                     boxShadow: "none",
//                   }
//                 }}>
//                 {playing ? <Pause /> : <PlayArrow />}
//               </IconButton>
//             </Tooltip>
//             <Typography variant="caption" sx={{ color: "#fff" }}>
//               {new Date(played * duration * 1000).toISOString().substr(14, 5)} /{" "}
//               {new Date(duration * 1000).toISOString().substr(14, 5)}
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//             <Slider
//               value={volume * 100}
//               onChange={(e, val) => {
//                 e.stopPropagation();
//                 setVolume(Array.isArray(val) ? val[0] / 100 : val / 100);
//               }}
//               sx={{
//                 width: 100,
//                 color: "#f7266e",
//                 "& .MuiSlider-thumb": { width: 10, height: 10 }
//               }}
//             />
//             <Tooltip title={volume > 0 ? "turn off volume" : "turn on volume"} arrow>
//               <IconButton onClick={(e) => {
//                 e.stopPropagation();
//                 setVolume(volume > 0 ? 0 : 0.8);
//               }} sx={{
//                 bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
//                 "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
//               }}>
//                 {volume > 0 ? <VolumeUp /> : <VolumeOff />}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Speed" arrow>
//               <IconButton onClick={handleOpenSpeed} sx={{
//                 bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
//                 "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
//               }}>
//                 <SlowMotionVideo />
//               </IconButton>
//             </Tooltip>

//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={() => setAnchorEl(null)}
//               container={containerRef.current}
//               disablePortal
//               PaperProps={{
//                 className: "controls",
//                 sx: {
//                   bgcolor: "#1e1e1e",
//                   color: "#fff",
//                   borderRadius: 1,
//                   boxShadow: "0 0 10px rgba(0,0,0,0.5)"
//                 }
//               }}
//               anchorOrigin={{ vertical: "top", horizontal: "center" }}
//               transformOrigin={{ vertical: "bottom", horizontal: "center" }}
//             >
//               {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
//                 <MenuItem
//                   key={rate}
//                   selected={playbackRate === rate}
//                   onClick={() => changePlaybackRate(rate)}
//                 >
//                   {rate === 1 ? "1x (Normal)" : `${rate}x`}
//                 </MenuItem>
//               ))}
//             </Menu>

//             <Tooltip title="Picture in Picture" arrow>
//               <IconButton onClick={(e) => { e.stopPropagation(); togglePiP(); }}
//                 sx={{
//                   bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
//                   "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
//                 }}>
//                 <PictureInPicture />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Fullscreen" arrow>
//               <IconButton onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
//                 sx={{
//                   bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
//                   "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
//                 }}>
//                 <Fullscreen />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </Box>

//       <style>{`
//         @keyframes fadeOutZoom {
//           0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
//           100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default VideoPlayer;


import React, { useRef, useState, useEffect,useImperativeHandle, forwardRef } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import {
  Box, IconButton, Typography, Slider, Menu, MenuItem, Tooltip, CircularProgress
} from "@mui/material";
import {
  PlayArrow, Pause, VolumeUp, VolumeOff,
  Fullscreen, PictureInPicture, SlowMotionVideo, Videocam
} from "@mui/icons-material";

import { useVideoPlayerContext } from "./VideoPlayerContext";

export interface VideoPlayerProps {
  videoUrl: string;
  poster: string;
  videoId: number;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster, videoId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const { activeVideoId, setActiveVideoId } = useVideoPlayerContext();

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [showIndicator, setShowIndicator] = useState<"play" | "pause" | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  const [initialPlayed, setInitialPlayed] = useState<number | null>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const lastInteraction = useRef(Date.now());
  const progressThrottle = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${videoId}`);
    if (saved) setInitialPlayed(parseFloat(saved));
  }, [videoId]);

  useEffect(() => {
    const t = setInterval(() => {
      if (playing && Date.now() - lastInteraction.current > 5000) {
        setControlsVisible(false);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => {
    if (activeVideoId !== null && activeVideoId !== videoId && playing) {
      setPlaying(false);
    }
  }, [activeVideoId, videoId, playing]);

  const handleUserInteraction = () => {
    lastInteraction.current = Date.now();
    setControlsVisible(true);
  };

  const togglePlayPause = () => {
    const next = !playing;
    setPlaying(next);
    setShowIndicator(next ? "play" : "pause");
    setActiveVideoId(videoId); 
    handleUserInteraction();
    setTimeout(() => setShowIndicator(null), 800);
  };

  // const handleSeek = (_: any, val: number | number[]) => {
  //   const v = Array.isArray(val) ? val[0] : val;
  //   playerRef.current?.seekTo(v, "fraction");
  //   setPlayed(v);
  // };
  const handleSeek = (_: any, val: number | number[]) => {
    const v = Array.isArray(val) ? val[0] : val;
    playerRef.current?.seekTo(v, "fraction");
    setPlayed(v);
    setHasSeeked(true);          
  };
  const toggleFullScreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  const togglePiP = () => {
    const video = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (video && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else video.requestPictureInPicture();
    }
  };

  const handleOpenSpeed = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    setAnchorEl(null);
  };

  // const handleReady = () => {
  //   if (initialPlayed && !hasSeeked && playerRef.current) {
  //     playerRef.current.seekTo(initialPlayed, "fraction");
  //     setHasSeeked(true);
  //   }
  // };
  const handleReady = () => {
    const player = playerRef.current;
    if (!player) return;

    const internal = player.getInternalPlayer() as HTMLVideoElement;
    if (internal?.duration && !duration) {
      setDuration(internal.duration);
    }

    if (initialPlayed !== null && !hasSeeked) {
      player.seekTo(initialPlayed, "fraction");
      setHasSeeked(true);
    }
  };

  const handleProgress = ({ played }: { played: number }) => {
    setPlayed(played);
    const now = Date.now();
    if (now - progressThrottle.current > 1000) {
      localStorage.setItem(`progress_${videoId}`, String(played));
      progressThrottle.current = now;
    }
  };
  const handleSliderHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const time = duration * percent;

  setHoverTime(time >= 0 && time <= duration ? time : null);
  setHoverX(e.clientX - rect.left);
};

const clearHoverTime = () => {
  setHoverTime(null);
  setHoverX(null);
};
  const currentPlayed = hasSeeked ? played : initialPlayed ?? 0;
  const timeLeft = duration * (1 - currentPlayed);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        bgcolor: "#000",
        borderRadius: 2,
        overflow: "hidden",
        cursor: controlsVisible ? "default" : "none"
      }}
      onMouseMove={handleUserInteraction}
      onClick={(e) => {
        const el = e.target as HTMLElement;
        if (!el.closest(".controls")) togglePlayPause();
      }}
      
    >
      {showPoster && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 12
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 14,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              gap: 0.5
            }}
          >
            <Videocam fontSize="small" />
            {formatTime(timeLeft)}
          </Box>

          <Box sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 4,
            width: `${currentPlayed * 100}%`,
            bgcolor: "#f7266e",
            zIndex: 14
          }} />

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setShowPoster(false);
              setPlaying(true);
              setActiveVideoId(videoId); 
              handleUserInteraction();
            }}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              zIndex: 13,
              width: 60,
              height: 60,
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
            }}
          >
            <PlayArrow sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      )}

      {isBuffering && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 30
          }}
        >
          <CircularProgress size={48} color="inherit" />
        </Box>
      )}

      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        volume={volume}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={(d) => {
          if (d > 0) setDuration(d);
        }}
        onReady={handleReady}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        width="100%"
        height="100%"
        controls={false}
        style={{ pointerEvents: "none" }}
         config={{
            file: {
              attributes: {
                preload: "none", 
                playsInline: true,
                controlsList: "nodownload",
                disablePictureInPicture: false,
              },
            },
          }}
      />

      {showIndicator && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            pointerEvents: "none",
            animation: "fadeOutZoom 0.8s ease forwards",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {showIndicator === "play"
            ? <PlayArrow sx={{ fontSize: 60, color: "#fff" }} />
            : <Pause sx={{ fontSize: 60, color: "#fff" }} />}
        </Box>
      )}
      <Box
        className="controls"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          pointerEvents: "auto",
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
          pb: 0.5
        }}
      >
        <Box
          sx={{ position: "relative", px: 1.5, mb: 0.5 }}
          onMouseMove={handleSliderHover}
          onMouseLeave={clearHoverTime}
        >
          <Slider
            value={played}
            onChange={handleSeek}
            step={0.001}
            min={0}
            max={1}
            sx={{
              color: "#f7266e",
              height: 4,
              "& .MuiSlider-thumb": { width: 10, height: 10 },
              "& .MuiSlider-track": { border: "none" }
            }}
          />
          {hoverTime !== null && hoverX !== null && (
            <Box
              sx={{
                position: "absolute",
                top: -28,
                left: hoverX,
                backgroundColor: "#000",
                color: "#fff",
                px: 1,
                py: 0.2,
                fontSize: 12,
                borderRadius: 1,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                transform: "translateX(-50%)"
              }}
            >
              {formatTime(hoverTime)}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", px: 1.5, pb: 1, mt: -0.5 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Play/Pause" arrow>
              <IconButton onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                sx={{
                  bgcolor: "rgba(0,0,0,0.2)",
                  borderRadius: "50%",
                  color: "#fff",
                  p: 1,
                  outline: "none",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  }
                }}>
                {playing ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ color: "#fff" }}>
              {new Date(played * duration * 1000).toISOString().substr(14, 5)} /{" "}
              {new Date(duration * 1000).toISOString().substr(14, 5)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Slider
              value={volume * 100}
              onChange={(e, val) => {
                e.stopPropagation();
                setVolume(Array.isArray(val) ? val[0] / 100 : val / 100);
              }}
              sx={{
                width: 100,
                color: "#f7266e",
                "& .MuiSlider-thumb": { width: 10, height: 10 }
              }}
            />
            <Tooltip title={volume > 0 ? "turn off volume" : "turn on volume"} arrow>
              <IconButton onClick={(e) => {
                e.stopPropagation();
                setVolume(volume > 0 ? 0 : 0.8);
              }} sx={{
                bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}>
                {volume > 0 ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Speed" arrow>
              <IconButton onClick={handleOpenSpeed} sx={{
                bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}>
                <SlowMotionVideo />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              container={containerRef.current}
              disablePortal
              PaperProps={{
                className: "controls",
                sx: {
                  bgcolor: "#1e1e1e",
                  color: "#fff",
                  borderRadius: 1,
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)"
                }
              }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <MenuItem
                  key={rate}
                  selected={playbackRate === rate}
                  onClick={() => changePlaybackRate(rate)}
                >
                  {rate === 1 ? "1x (Normal)" : `${rate}x`}
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title="Picture in Picture" arrow>
              <IconButton onClick={(e) => { e.stopPropagation(); togglePiP(); }}
                sx={{
                  bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}>
                <PictureInPicture />
              </IconButton>
            </Tooltip>

            <Tooltip title="Fullscreen" arrow>
              <IconButton onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                sx={{
                  bgcolor: "rgba(0,0,0,0.5)", borderRadius: "50%", color: "#fff", p: 1,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeOutZoom {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
        }
      `}</style>
    </Box>
  );
};

export default VideoPlayer;
