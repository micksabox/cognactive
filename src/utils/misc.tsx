import { useFormAction, useNavigation } from 'react-router'
import { useSpinDelay } from 'spin-delay'
import { HOSTNAME } from 'src/constants'

/**
 
 * Provide a condition and if that condition is falsey, this throws a 400
 * Response with the given message.
 *
 * inspired by invariant from 'tiny-invariant'
 *
 * @example
 * invariantResponse(typeof value === 'string', `value must be a string`)
 *
 * @param condition The condition to check
 * @param message The message to throw (or a callback to generate the message)
 * @param responseInit Additional response init options if a response is thrown
 *
 * @throws {Response} if condition is falsey
 *  Attribution: From epic web stack
 */
export function invariantResponse(
  condition: any,
  message: string | (() => string),
  responseInit?: ResponseInit,
): asserts condition {
  if (!condition) {
    throw new Response(typeof message === 'function' ? message() : message, {
      status: 400,
      ...responseInit,
    })
  }
}

/**
 
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 *
 * Defaults state to 'non-idle'
 *
 * NOTE: the default formAction will include query params, but the
 * navigation.formAction will not, so don't use the default formAction if you
 * want to know if a form is submitting without specific query params.
 * Attribution: From epic web stack
 */
export function useIsPending({
  formAction,
  formMethod = 'POST',
  state = 'non-idle',
}: {
  formAction?: string
  formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
  state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
  const contextualFormAction = useFormAction()
  const navigation = useNavigation()
  const isPendingState = state === 'non-idle' ? navigation.state !== 'idle' : navigation.state === state
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  )
}

/**
 * This combines useSpinDelay (from https://npm.im/spin-delay) and useIsPending
 * from our own utilities to give you a nice way to show a loading spinner for
 * a minimum amount of time, even if the request finishes right after the delay.
 *
 * This avoids a flash of loading state regardless of how fast or slow the
 * request is.
 */
export function useDelayedIsPending({
  formAction,
  formMethod,
  delay = 400,
  minDuration = 300,
}: Parameters<typeof useIsPending>[0] & Parameters<typeof useSpinDelay>[1] = {}) {
  const isPending = useIsPending({ formAction, formMethod })
  const delayedIsPending = useSpinDelay(isPending, {
    delay,
    minDuration,
  })
  return delayedIsPending
}

/**
 * Redirects to the image-generator route with optional query parameters.
 * @param title The title to be displayed on the generated image.
 * @param subtitle The subtitle to be displayed on the generated image.
 * @param body The body text to be displayed on the generated image.
 */
export function redirectToImageGenerator({
  title = '',
  subtitle = '',
  body = '',
}: {
  title?: string
  subtitle?: string
  body?: string
}) {
  const queryParams = new URLSearchParams()

  if (title) queryParams.append('title', title)
  if (subtitle) queryParams.append('subtitle', subtitle)
  if (body) queryParams.append('body', body)

  return `${HOSTNAME}/image-generator?${queryParams.toString()}`
}

export const OPEN_GRAPH_IMAGE_WIDTH = 1200
export const OPEN_GRAPH_IMAGE_HEIGHT = 600

/**
 * Generates meta tags for setting the OpenGraph image in a Remix MetaFunction.
 * @param imageUrl The URL of the image to be used for OpenGraph tags.
 * @returns An array of objects representing meta tags.
 */
export function openGraphImageMeta(imageUrl: string): Array<{ property: string; content: string }> {
  return [
    {
      property: 'og:image',
      content: imageUrl,
    },
    {
      property: 'og:image:url',
      content: imageUrl,
    },
    {
      property: 'og:image:width',
      content: OPEN_GRAPH_IMAGE_WIDTH.toString(),
    },
    {
      property: 'og:image:height',
      content: OPEN_GRAPH_IMAGE_HEIGHT.toString(),
    },
    {
      property: 'og:image',
      content: imageUrl,
    },
    {
      property: 'twitter:image',
      content: imageUrl,
    },
  ]
}
