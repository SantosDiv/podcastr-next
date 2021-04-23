import { useState } from 'react';
import stylesEPlayer from './stylesEspecialPlayer.module.scss';
import styles from './styles.module.scss';

export function Player() {
  const [toggle, setToggle] = useState(false);

  const sizePlayerContainer = !toggle
    ? stylesEPlayer.compressedPlayerContainer
    : stylesEPlayer.stretchedPlayerContainer;

  const sizeEmptyPlayer = !toggle
    ? stylesEPlayer.compressedEmpytPlayer
    : stylesEPlayer.stretchedEmptyPlayer;

  const compressedProgress = !toggle && stylesEPlayer.compressedProgress;
  const compressendSlider = !toggle && stylesEPlayer.compressendSlider;
  const compressedButtons = !toggle && stylesEPlayer.compressedButtons;
  const animationArrowLeft = toggle && stylesEPlayer.animationArrowLeft;

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

      <div className={`${styles.empytPlayer} ${sizeEmptyPlayer}`}>
        <strong className={styles.strong}>Selecione um podcast para ouvir!</strong>
      </div>

      <footer className={styles.footerPlayer}>
        <div className={`${styles.progress} ${compressedProgress}`}>
          <span>00:00</span>
          <div className={`${styles.slider} ${compressendSlider}`}>
            <div className={styles.empytSlider} />
          </div>
          <span>00:00</span>
        </div>

        <div className={`${styles.buttons} ${compressedButtons}`}>
          <button>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button className={styles.playButton}>
            <img src="/play.svg" alt="Tocar" />
          </button>
          <button>
            <img src="/play-next.svg" alt="Tocar posterior" />
          </button>
          <button>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
