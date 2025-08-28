import React, { createContext, useContext, useState } from "react";

interface VideoPlayerContextType {
  activeVideoId: number | null;
  setActiveVideoId: (id: number) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType>({
  activeVideoId: null,
  setActiveVideoId: () => {},
});

export const useVideoPlayerContext = () => useContext(VideoPlayerContext);

export const VideoPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  return (
    <VideoPlayerContext.Provider value={{ activeVideoId, setActiveVideoId }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};
