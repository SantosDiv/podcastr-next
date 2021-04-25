import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/playerContext';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main className={styles.mainContainer}>
          <Header />
          <Component { ...pageProps }/>
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
