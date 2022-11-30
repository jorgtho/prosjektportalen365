import { IDocumentCardProps } from '@fluentui/react'
import * as strings from 'PortfolioWebPartsStrings'
import { useContext, useState } from 'react'
import { ProjectCardContext } from './context'
import styles from './ProjectCard.module.scss'

/**
 * Component logic hook for `ProjectCard`
 */
export function useProjectCard() {
  const context = useContext(ProjectCardContext)
  const [isImageLoaded, setIsImageLoaded] = useState(!context.project.logo)
  const documentCardProps: IDocumentCardProps = {
    title: '',
    onClickHref: context.project.url,
    className: styles.root,
    style: {}
  }
  if (context.project.hasUserAccess === false) {
    documentCardProps.onClickHref = '#'
    documentCardProps.title = strings.NoAccessMessage
    documentCardProps.style = { opacity: '20%', cursor: 'default' }
  }
  return {
    isDataLoaded: context.isDataLoaded && isImageLoaded,
    setIsImageLoaded,
    documentCardProps
  } as const
}
