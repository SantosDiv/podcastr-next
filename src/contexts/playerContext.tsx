import { createContext, useState, ReactNode, useContext } from 'react';


type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
};

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  play: (episode: Episode) => void,
  playList: (list: Episode[], index:number) => void,
  setPlayingState: (state: boolean) => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffling: () => void,
  playNext: () => void,
  playPrevious: () => void,
  hasNext: boolean,
  hasPrevious: boolean,
}

type PlayerContextProviderProps = {
  children: ReactNode,
};

export const PlayerContext = createContext({} as PlayerContextData);


export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }


  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }


  const toggleLoop = () => {
    setIsLooping(!isLooping);
  }

  const toggleShuffling = () => {
    setIsLooping(!isShuffling);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const hasNext = (currentEpisodeIndex - 1) >= 0;
  const hasPrevious = currentEpisodeIndex < episodeList.length - 1;

  const playNext = () => {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }


  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      playList,
      playNext,
      playPrevious,
      isPlaying,
      togglePlay,
      setPlayingState,
      hasNext,
      hasPrevious,
      isLooping,
      isShuffling,
      toggleLoop,
      toggleShuffling,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
