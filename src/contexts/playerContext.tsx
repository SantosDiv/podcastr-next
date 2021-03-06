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
  isOpenPlayContainer: boolean,
  play: (episode: Episode) => void,
  playList: (list: Episode[], index:number) => void,
  setPlayingState: (state: boolean) => void,
  clearPlayerState: () => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffling: () => void,
  toggleSidePlay: () => void,
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
  const [isOpenPlayContainer, setIsOpenPlayContainer] = useState(false);

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

  const toggleSidePlay = () => {
    setIsOpenPlayContainer(!isOpenPlayContainer)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  }

  const toggleShuffling = () => {
    setIsShuffling(!isShuffling);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const hasNext = isShuffling || (currentEpisodeIndex - 1) >= 0;
  const hasPrevious = currentEpisodeIndex < episodeList.length - 1;

  const playNext = () => {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * (episodeList.length - 1));
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
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
      isOpenPlayContainer,
      toggleLoop,
      toggleShuffling,
      toggleSidePlay,
      clearPlayerState,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
