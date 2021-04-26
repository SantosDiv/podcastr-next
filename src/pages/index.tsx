// Formas de fazer uma requisição API no next
/* Forma 1: SPA
  useEfect(() => {
    fetch("http://localhost/3333/episodes")
      .then((response) => response.json())
      .then(data => console.log(data));
  }, []);
  Problemas: fazer uma requisição com o componentDidMount, faz com que os indexadores
  não encontrem os dados.
*/
/* Forma 2: SSR - server-side render
  export async function getServerSideProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
      props: {
        episodes: data,
      }
    }
  }
    Problemas: Toda vida que o usuário acessar nossa home, vai requisitar os dados no servidor
    essa é a diferença entre Server-side render para o Static-side generation
*/

/* Forma 2: SSG - Static-side generation
  Vai gerar uma página estática, e não vai repetir a requisição ao servidor a partir de
    um tempo que nós determinamos.

  export async function getStaticProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
      props: {
        episodes: data,
      },
      revalidate: 60 * 60 * 8, ==> Vai gerar uma página estatica durante oito horas.
    }
  }
  => Para gerar uma build vá no terminal e digite `npm run build`
*/

/*Notas de nomes => Infinite Scroll*/

import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/covertDurationToTimeString';
import { usePlayer } from '../contexts/playerContext';
import styles from './home.module.scss';

type Episodes = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number
  durationAsString: string,
  url: string,
}

type HomeProps = {
  latestEpisodes: Episodes[],
  allEpisodes: Episodes[],
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playList, isOpenPlayContainer } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={ styles.homePage }>

      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={ styles.latestEpisodes }>
        <h2>Últimos lançamentos</h2>
        <ul>
          { latestEpisodes.map((episode, index) => {
            return (
              <li key={ episode.id }>
                { !isOpenPlayContainer &&
                  <Image
                    width={192}
                    height={192}
                    src={ episode.thumbnail }
                    alt={ episode.title }
                    objectFit="cover"
                  />
                }

                <div className={ styles.episodeDetails }>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          }) }
        </ul>
      </section>
      <section className={ styles.allEpisodes }>
        <h2>Todos os Epidódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 70 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 90 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              );
            }) }
          </tbody>
        </table>
      </section>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', { //To usando o `axios` aqui!
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
