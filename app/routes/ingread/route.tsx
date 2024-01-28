import { CameraIcon } from 'lucide-react'
import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from 'src/components/ui/button'
import { useFetcher } from '@remix-run/react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { invariantResponse } from 'src/utils/misc'
import { openai } from 'src/lib/openai.server'

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: 'user',
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
            text: 'What ingredients are in this image? Respond with just the ingredients as a YAML array',
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

  const rawResponse = response.choices[0]
  console.log(response.usage)
  console.log(response.choices)

  return json({ assistant: rawResponse.message.content })
}

const CameraCapture: React.FC = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)

  const captureFetcher = useFetcher<typeof action>()

  console.log(captureFetcher.state)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: videoConstraints.width * 2,
      height: videoConstraints.height * 2,
    })
    if (imageSrc) {
      setUrl(imageSrc)
    }
  }, [webcamRef])

  return (
    <div>
      {isCaptureEnable || (
        <Button onClick={() => setCaptureEnable(true)}>
          <CameraIcon className="mr-2" /> Start
        </Button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <Button onClick={() => setCaptureEnable(false)}>end </Button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={720}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
            />
          </div>
          <Button onClick={capture}>capture</Button>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null)
              }}
            >
              delete
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
          <captureFetcher.Form method="post">
            <input type="hidden" name="image" value={url} />
            <Button type="submit">Check Ingredients</Button>
          </captureFetcher.Form>
          Capture Processing: {captureFetcher.state}
          Capture Response: {captureFetcher.data?.assistant}
        </>
      )}
    </div>
  )
}

export default CameraCapture
