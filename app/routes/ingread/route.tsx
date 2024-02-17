import { ScanLine, Trash2, VideoIcon, VideoOff } from 'lucide-react'
import { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from 'src/components/ui/button'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { invariantResponse } from 'src/utils/misc'
import { openai } from 'src/lib/openai.server'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'
import { load, Schema, Type } from 'js-yaml'
import { z } from 'zod'

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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const entrypoint = url.searchParams.get('entry')

  return json({ entrypoint })
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()

  const imageBase64 = body.get('image')

  invariantResponse(typeof imageBase64 === 'string', 'Image is required', { status: 400 })

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
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

  return json({ assistant: responseContent, ingredients: parsedIngredients })
}

const CameraCapture: React.FC = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)

  const captureFetcher = useFetcher<typeof action>()

  const loaderData = useLoaderData<typeof loader>()

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
    <div ref={rootDivRef}>
      {!isCaptureEnable && (
        <div
          style={{ height: rootWidth }}
          className="mx-auto flex max-h-[512px] w-full max-w-[512px] items-center justify-center bg-gray-200"
        >
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
      <div className="p-4 pt-0">
        {isScanning && (
          <>
            <div className="w-full animate-pulse bg-slate-400 p-3"></div>
            <div className="mt-2 w-full animate-pulse bg-slate-400 p-3"></div>
          </>
        )}
        {!isScanning && !captureFetcher.data && (
          <p>Quickly check for {loaderData.entrypoint || 'NAC Protocol'} with the snap of a photo.</p>
        )}
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
                        {/yeast|citric acid/i.test(ing) && '😱'}
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

export default CameraCapture
