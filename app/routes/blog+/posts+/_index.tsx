import { LoaderFunction, redirect } from 'react-router'

export const loader: LoaderFunction = () => {
  return redirect('/blog')
}
