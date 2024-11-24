import React from 'react'
import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'

interface ContentHeaderProps {
  title: string
  linkTo: string
  linkText: string
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ title, linkTo, linkText }) => {
  return (
    <>
      <p>
        <Link className="text-gray-400" to={linkTo}>
          <ChevronLeft className="inline-block w-4" /> {linkText}
        </Link>
      </p>
      <h1 className="text-2xl">{title}</h1>
    </>
  )
}

export default ContentHeader
