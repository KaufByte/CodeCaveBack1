
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import VideoPlayer from "./videoPlayer"; 

interface Props {
  videoUrl: string;
  poster: string;
  videoId: number;
}

const LazyVideoPlayer: React.FC<Props> = ({ videoUrl, poster, videoId }) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } 
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={containerRef} sx={{ width: "100%", aspectRatio: "16/9" }}>
      {visible ? (
        <VideoPlayer videoUrl={videoUrl} poster={poster} videoId={videoId} />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            bgcolor: "#000",
          }}
        />
      )}
    </Box>
  );
};

export default LazyVideoPlayer;

