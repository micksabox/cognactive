import { Link, useLoaderData, LoaderFunction } from 'react-router'
import { GithubIcon, MonitorPlay } from 'lucide-react'
import { Episode, initialFungcastEpisodes } from './episode-list'
import HeroVideoDialog from 'src/components/ui/hero-video-dialog'
import { Button } from 'src/components/ui/button'
import { GITHUB_REPO_BASE } from 'src/constants'

export const loader: LoaderFunction = async () => {
  const fungcastData = {
    title: 'Fungcaster',
    episodes: initialFungcastEpisodes,
  }

  return fungcastData
}

export default function FungCast() {
  const data = useLoaderData()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        <MonitorPlay className="mb-2 mr-4 inline-block h-auto w-12" />
        {data.title}
      </h1>
      <p className="my-4 text-xl">
        Watch, listen and learn about the <span className="font-bold">#CosmicDeathFungus</span> and related topics.
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.episodes.map((episode: Episode) => (
          <li key={episode.id} className="flex flex-col rounded-lg border p-4">
            <h2 className="mb-2 text-xl font-semibold">{episode.title}</h2>
            <p className="mb-2 line-clamp-2 h-10 text-sm">{episode.subtitle}</p>
            {episode.youtubeLink ? (
              <HeroVideoDialog
                thumbnailSrc={episode.imageUrl}
                className="w-full flex-1"
                videoSrc={episode.youtubeLink}
              />
            ) : null}
            {episode.imageUrl && !episode.youtubeLink ? (
              <a className="group" target="_blank" href={episode.link} rel="noreferrer">
                <img className="w-full group-hover:opacity-95" src={episode.imageUrl} alt={episode.title} />
              </a>
            ) : null}
            <div className="my-1 flex flex-wrap gap-2">
              {episode.categories.map((c) => (
                <span key={c} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
                  {c}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <br />
      <p>Did we miss your favorite Fungcast? Add it to the list!</p>
      <Button asChild className="mt-2">
        <Link to={`${GITHUB_REPO_BASE}/blob/main/app/routes/fungcaster/episode-list.ts`}>
          Add on Github <GithubIcon className="ml-2 w-4" />
        </Link>
      </Button>
    </div>
  )
}
