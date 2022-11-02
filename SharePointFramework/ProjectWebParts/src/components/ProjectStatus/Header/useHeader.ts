import moment from 'moment'
import { useContext } from 'react'
import { ProjectStatusContext } from '../context'

export function useHeader() {
  const context = useContext(ProjectStatusContext)
  const formattedDate = context.state.selectedReport
    ? moment(
        context.state.selectedReport.publishedDate ?? context.state.selectedReport.created
      ).format('DD.MM.yyyy')
    : null
  return {
    isDataLoaded: context.state.isDataLoaded,
    title: [context.props.title, formattedDate].join(' ')
  } as const
}
