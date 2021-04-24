import { Header } from '../components/Header';
import { Player } from '../components/Player';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { PlayerContext } from '../contexts/playerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }


  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }


  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }
  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
      <div className={styles.wrapper}>
        <main className={styles.mainContainer}>
          <Header />
          <Component { ...pageProps }/>
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp