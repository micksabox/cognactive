import { ScanLine, Trash2, VideoIcon, VideoOff } from 'lucide-react'
import { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from 'src/components/ui/button'
import type { Route } from './+types/route'
import { useFetcher, useRouteError, LinksFunction } from 'react-router'
import { invariantResponse } from 'src/utils/misc'
import { openai } from 'src/lib/openai.server'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'
import { load, Schema, Type } from 'js-yaml'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'

// OpenAI Vision API expects a 512x512 image at least
// and is the cheapest option
const VIDEO_SIZE = 512

const videoConstraints = {
  width: VIDEO_SIZE,
  height: VIDEO_SIZE,
  facingMode: {
    // Front-facing camera
    exact: 'environment',
  },
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      href: '/videos/watermarked_video0c3be294294da4ad89c2509dce30c8bb2.mp4',
      as: 'video',
      type: 'video/mp4',
    },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const entrypoint = url.searchParams.get('entry')

  return { entrypoint }
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.formData()

  const imageBase64 = body.get('image')

  invariantResponse(typeof imageBase64 === 'string', 'Image is required', { status: 400 })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'List all the ingredients in this image. Respond in YAML array format with depth 1',
          },
          {
            type: 'image_url',
            image_url: {
              detail: 'auto',
              url: imageBase64,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  })

  let responseContent = response.choices[0].message.content

  let parsedIngredients: string[] = []

  if (responseContent) {
    try {
      // Remove any ``` triple backticks and yaml start messages
      responseContent = responseContent.replace(/```+/gm, '').replace('yaml', '')

      // Define a custom schema that includes a list of strings
      const customSchema = new Schema({
        explicit: [
          new Type('tag:yaml.org,2002:seq', {
            kind: 'sequence',
            construct: (data) => data.filter((item: any) => typeof item === 'string'),
          }),
        ],
      })

      const doc = load(responseContent, { json: true, schema: customSchema })

      if (Array.isArray(doc)) {
        const ingredientsSchema = z.array(z.string())
        const validationResult = ingredientsSchema.safeParse(doc)
        if (validationResult.success) {
          parsedIngredients = validationResult.data
        } else {
          console.error('Invalid ingredients format:', validationResult.error)
        }
      }
    } catch (e: any) {
      console.error('Unable to parse YAML')
    }
  }

  return { assistant: responseContent, ingredients: parsedIngredients }
}

const CameraCapture: React.FC = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)

  const captureFetcher = useFetcher<typeof action>()

  const yeastIngredients = captureFetcher.data?.ingredients
    ? captureFetcher.data.ingredients.filter((ingredient: string) => /yeast/i.test(ingredient))
    : []

  const isScanning = captureFetcher.state !== 'idle'

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: VIDEO_SIZE,
      height: VIDEO_SIZE,
    })
    if (imageSrc) {
      setUrl(imageSrc)
      captureFetcher.submit(
        {
          image: imageSrc,
        },
        {
          method: 'post',
        },
      )
    } else {
      toast.error('Could not scan photo')
    }
  }, [webcamRef, captureFetcher])
  const rootDivRef = useRef<HTMLDivElement>(null)
  const [rootWidth, setRootWidth] = useState<number | undefined>()

  useEffect(() => {
    const updateWidth = () => {
      if (rootDivRef.current) {
        setRootWidth(Math.min(rootDivRef.current.offsetWidth, VIDEO_SIZE))
      }
    }

    window.addEventListener('resize', updateWidth)
    updateWidth() // Set initial width

    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div ref={rootDivRef} className="mx-auto md:max-w-xl">
      {!isCaptureEnable && (
        <div
          style={{ height: rootWidth }}
          className="mx-auto flex max-h-[512px] w-full max-w-[512px] items-center justify-center bg-gray-200"
        >
          <video
            src="/videos/watermarked_video0c3be294294da4ad89c2509dce30c8bb2.mp4"
            playsInline
            autoPlay
            loop
            className="w-full"
          />
          <VideoIcon className="h-48 w-48 text-gray-300" />
        </div>
      )}
      {isCaptureEnable || (
        <div className="flex justify-start p-4">
          <Button
            variant={'cyan'}
            onClick={() => {
              setCaptureEnable(true)
              setUrl(null)
            }}
            className="w-full"
          >
            <VideoIcon className="mr-2" /> Start Ingredient Scanner
          </Button>
        </div>
      )}
      {isCaptureEnable && (
        <>
          <div className="relative">
            <Webcam
              audio={false}
              width={VIDEO_SIZE}
              height={VIDEO_SIZE}
              screenshotQuality={1}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
            />
            {url && (
              <div
                className={clsx(
                  'absolute bottom-0 left-0 right-0 top-0 border-2 transition-all',
                  url ? 'scale-90 opacity-100' : 'scale-100 opacity-0',
                )}
              >
                <img src={url} alt="Screenshot" />
                <Button
                  disabled={isScanning}
                  variant={'destructive'}
                  className="absolute bottom-2 left-2 text-white shadow-md"
                  onClick={() => {
                    setUrl(null)
                  }}
                >
                  <Trash2 />
                </Button>
                {isScanning && <div className="square-loader absolute bottom-2 right-2 h-6 w-6"></div>}
                <captureFetcher.Form method="post">
                  <input type="hidden" name="image" value={url} />
                </captureFetcher.Form>
              </div>
            )}
          </div>
          <div className="flex justify-start space-x-2 p-4">
            <Button
              className={isScanning ? 'animate-pulse' : ''}
              disabled={isScanning}
              variant={'outline'}
              onClick={() => setCaptureEnable(false)}
            >
              <VideoOff />
            </Button>
            <Button disabled={isScanning} variant={'cyan'} className="flex-grow" onClick={capture}>
              <ScanLine className="mr-2" /> Capture &amp; Scan
            </Button>
          </div>
        </>
      )}
      {!isScanning && isCaptureEnable && captureFetcher.data && yeastIngredients.length > 0 && (
        <Alert variant={'destructive'}>
          <AlertTitle>Yeast Ingredients Found</AlertTitle>
          <AlertDescription>{yeastIngredients.length} ingredients with yeast found.</AlertDescription>
        </Alert>
      )}
      <div className="p-4 pt-0">
        {isScanning && (
          <>
            <div className="w-full animate-pulse bg-slate-400 p-3"></div>
            <div className="mt-2 w-full animate-pulse bg-slate-400 p-3"></div>
          </>
        )}
        {!isScanning && !captureFetcher.data && <p>Quickly check ingredient lists for yeast.</p>}
        {!isScanning && isCaptureEnable && captureFetcher.data?.ingredients && (
          <div className="prose">
            <h3>
              {captureFetcher.data.ingredients.length} Ingredients <small>🚧</small>
            </h3>
            {captureFetcher.data.ingredients.length === 0 && <p>{captureFetcher.data.assistant}</p>}
            <table>
              <tbody>
                {captureFetcher.data.ingredients.map((ing) => (
                  <tr key={ing}>
                    <td>
                      <small>
                        {/yeast/i.test(ing) && '😱'}
                        {ing}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  console.error(error)
  return (
    <div className="error-container">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  )
}

export default CameraCapture
