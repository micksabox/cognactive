export interface Episode {
  id: number
  link: string
  title: string
  subtitle: string
  duration: string
  imageUrl: string
  categories: string[]
  youtubeLink?: string
}

export const initialFungcastEpisodes: Episode[] = [
  {
    id: 0,
    link: 'https://www.youtube.com/embed/O_q7vPmas14?si=O0Y9hHro1U8V4ove',
    title: 'UFOs On The Level',
    subtitle: 'Jon Majerowski - Seth Peribsen: Hitchhikers, Healings and the Phenomenon',
    duration: '2:35:10',
    categories: ['cdf'],
    imageUrl: 'https://img.youtube.com/vi/O_q7vPmas14/hqdefault.jpg',
    youtubeLink: 'https://www.youtube.com/embed/O_q7vPmas14?si=O0Y9hHro1U8V4ove',
  },
  {
    id: 1,
    link: 'https://rss.com/podcasts/nightbirdradio/1672177/',
    title: 'Nightbird Radio',
    subtitle: 'Cosmic Death Fungus with Seth Peribsen',
    duration: '2:13:00',
    categories: ['cdf'],
    imageUrl: 'https://img.rss.com/nightbirdradio/800/ep_cover_20240925_050947_462a578a9c6694fa1ee8c35db0b9e400.jpg',
  },
  {
    id: 2,
    link: 'https://youtu.be/tOImumMeUcw?si=zB3XmODbpe8An36t',
    title: 'Neon Galactic',
    subtitle: 'Seth Peribsen & The Cosmic Death Fungus',
    duration: '2:35:10',
    categories: ['cdf'],
    imageUrl: 'https://img.youtube.com/vi/tOImumMeUcw/hqdefault.jpg',
    youtubeLink: 'https://www.youtube.com/embed/tOImumMeUcw?si=ewfondJHd4mAFLMW',
  },

  {
    id: 3,
    link: 'https://www.youtube.com/embed/c6GOs6vJO3k?si=LKbDFMQ8JpjU-Xsx',
    title: 'Curiosity Stream',
    subtitle: 'Are Humans the New Target for Fungi? | Attack of the Zombie Fungus',
    duration: '2:35:10',
    categories: ['pathogens'],
    imageUrl: 'https://img.youtube.com/vi/c6GOs6vJO3k/hqdefault.jpg',
    youtubeLink: 'https://www.youtube.com/embed/c6GOs6vJO3k?si=LKbDFMQ8JpjU-Xsx',
  },
  {
    id: 4,
    link: 'https://www.youtube.com/embed/3kdUS04xXPA',
    title: 'UFOs on the Level',
    subtitle: 'Majerowski-Peribsen 2: Shadow Biome-Alien Fungi & Neanderthal DNA Shape Humanity',
    duration: '1:46:18',
    categories: ['cdf'],
    imageUrl: 'https://img.youtube.com/vi/3kdUS04xXPA/hqdefault.jpg',
    youtubeLink: 'https://www.youtube.com/embed/3kdUS04xXPA',
  },
]
