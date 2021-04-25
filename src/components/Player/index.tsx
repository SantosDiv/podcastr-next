import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '../../contexts/playerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import stylesEPlayer from './stylesEspecialPlayer.module.scss';
import styles from './styles.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [toggle, setToggle] = useState(false);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];

  const sizePlayerContainer = !toggle
    ? stylesEPlayer.compressedPlayerContainer
    : stylesEPlayer.stretchedPlayerContainer;

  const sizeEmptyPlayer = !toggle
    ? stylesEPlayer.compressedEmpytPlayer
    : stylesEPlayer.stretchedEmptyPlayer;

  const compressedProgress = !toggle ? stylesEPlayer.compressedProgress : undefined; // Recomendação do react
  const compressendSlider = !toggle ? stylesEPlayer.compressendSlider : undefined;
  const compressedButtons = !toggle ? stylesEPlayer.compressedButtons : undefined;
  const animationArrowLeft = toggle ? stylesEPlayer.animationArrowLeft : undefined;

  return (
    <div className={`${styles.playerContainer} ${sizePlayerContainer}`}>
      <button
        type="button"
        className={styles.openPlayer}
        onClick={() => setToggle(!toggle)}
      >
        <img
          src="/arrow-left.svg"
          alt="Expandir Player"
          className={ animationArrowLeft }
        />
      </button>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong className={styles.strong}>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={stylesEPlayer.stretchedCurrentPlayer}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong> {episode.title} </strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={`${styles.empytPlayer} ${sizeEmptyPlayer}`}>
          <strong className={styles.strong}>Selecione um podcast para ouvir!</strong>
        </div>
      ) }

      <footer className={styles.footerPlayer}>
        <div className={`${styles.progress} ${compressedProgress}`}>
          <span>00:00</span>
          <div className={`${styles.slider} ${compressendSlider}`}>
            { episode ? (
              <Slider
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.empytSlider} />
            ) }
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => {setPlayingState(true)}}
            onPause={() => {setPlayingState(false)}}
          />
        ) }

        <div className={`${styles.buttons} ${compressedButtons}`}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
          { isPlaying
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar posterior" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
