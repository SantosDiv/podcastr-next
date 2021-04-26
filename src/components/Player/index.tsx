import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '../../contexts/playerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import stylesEPlayer from './stylesEspecialPlayer.module.scss';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/covertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffling,
    isShuffling,
    toggleSidePlay,
    isOpenPlayContainer,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener =() => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  const sizePlayerContainer = !isOpenPlayContainer
    ? stylesEPlayer.compressedPlayerContainer
    : stylesEPlayer.stretchedPlayerContainer;

  const sizeEmptyPlayer = !isOpenPlayContainer
    ? stylesEPlayer.compressedEmpytPlayer
    : stylesEPlayer.stretchedEmptyPlayer;

  const styleCurrentPlayer = !isOpenPlayContainer
   ? stylesEPlayer.comporessedCurrentPlayer
   : stylesEPlayer.stretchedCurrentPlayer;

  const compressedProgress = !isOpenPlayContainer ? stylesEPlayer.compressedProgress : undefined; // Recomendação do react
  const compressendSlider = !isOpenPlayContainer ? stylesEPlayer.compressendSlider : undefined;
  const compressedButtons = !isOpenPlayContainer ? stylesEPlayer.compressedButtons : undefined;
  const animationArrowLeft = isOpenPlayContainer ? stylesEPlayer.animationArrowLeft : undefined;

  return (
    <div className={`${styles.playerContainer} ${sizePlayerContainer}`}>
      <button
        type="button"
        className={styles.openPlayer}
        onClick={() => toggleSidePlay()}
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
        <div className={styleCurrentPlayer}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <p> {episode.title} </p>
          <p>{episode.members}</p>
        </div>
      ) : (
        <div className={`${styles.empytPlayer} ${sizeEmptyPlayer}`}>
          <strong className={styles.strong}>Selecione um podcast para ouvir!</strong>
        </div>
      ) }

      <footer className={styles.footerPlayer}>
        <div className={`${styles.progress} ${compressedProgress}`}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={`${styles.slider} ${compressendSlider}`}>
            { episode ? (
              <Slider
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.empytSlider} />
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => {setPlayingState(true)}}
            onPause={() => {setPlayingState(false)}}
            onLoadedMetadata={() => setupProgressListener()}
            onEnded={handleEpisodeEnded}
          />
        ) }

        <div className={`${styles.buttons} ${compressedButtons}`}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffling}
            className={isShuffling ? styles.isActive : undefined}
          >
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
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : undefined}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
