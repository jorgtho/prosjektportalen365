import { format } from '@fluentui/react/lib/Utilities'
import sortArray from 'array-sort'
import _ from 'lodash'
import moment from 'moment'
import strings from 'PortfolioWebPartsStrings'
import { CSSProperties, useEffect } from 'react'
import { ITimelineGroup, ITimelineItem, TimelineGroupType } from '../../interfaces'
import { ProjectListModel, TimelineContentListModel } from '../../models'
import { IProjectTimelineProps, IProjectTimelineState } from './types'

/**
 * Creating groups based on projects title
 *
 * @param projects Projects
 *
 * @returns Timeline groups
 */
const createProjectGroups = (projects: ProjectListModel[]): ITimelineGroup[] => {
  const mappedProjects = _.uniq(projects.map((project) => project.title)).map((title) => {
    const project = projects.find((project) => project.title === title)
    return {
      title: project.title,
      siteId: project.siteId
    }
  })

  const projectGroups = mappedProjects.map<ITimelineGroup>((project, id) => {
    return {
      id,
      title: project.title,
      type: TimelineGroupType.Project,
      siteId: project.siteId
    }
  })

  return sortArray(projectGroups, ['type', 'title'])
}

/**
 * Transform items for timeline
 *
 * @param timelineItems Timeline items
 * @param groups Groups
 * @returns Timeline items
 */
const transformItems = (
  timelineItems: TimelineContentListModel[],
  groups: ITimelineGroup[]
): ITimelineItem[] => {
  let _item: TimelineContentListModel, _siteId: string
  try {
    const items = timelineItems.map<ITimelineItem>((item, id) => {
      _item = item

      const group = _.find(groups, (grp) => item.siteId.indexOf(grp.siteId) !== -1)
      _siteId = group.siteId || 'N/A'

      if (group === null) return

      const style: CSSProperties = {
        color: 'white',
        border: 'none',
        cursor: 'auto',
        outline: 'none',
        background:
          item.getConfig('elementType') !== strings.BarLabel
            ? 'transparent'
            : item.getConfig('hexColor', '#f35d69'),
        backgroundColor:
          item.getConfig('elementType') !== strings.BarLabel
            ? 'transparent'
            : item.getConfig('hexColor', '#f35d69')
      }
      const data: any = {
        phase: item.phase,
        description: item.description,
        type: item.type,
        budgetTotal: item.budgetTotal,
        costsTotal: item.costsTotal,
        sortOrder: item.getConfig('sortOrder'),
        hexColor: item.getConfig('hexColor'),
        category: item.getConfig('timelineCategory'),
        elementType: item.getConfig('elementType'),
        filter: item.getConfig('timelineFilter'),
        tag: item.tag
      }
      return {
        id,
        group: group.id,
        title:
          item.type === strings.ProjectLabel
            ? format(strings.ProjectTimelineItemInfo, item.title)
            : item.itemTitle,
        start_time:
          item.getConfig('elementType') !== strings.BarLabel
            ? moment(new Date(item.endDate))
            : moment(new Date(item.startDate)),
        end_time: moment(new Date(item.endDate)),
        itemProps: { style },
        project: item.title,
        projectUrl: item.url,
        data
      } as ITimelineItem
    })

    return items.filter((i) => i)
  } catch (error) {
    throw new Error(
      format(
        strings.ProjectTimelineErrorTransformItemText,
        _siteId,
        _item.itemTitle ? `${_item.itemTitle} (${_item.title})` : _item.title,
        _item.type,
        error
      )
    )
  }
}

/**
 * Fetch data for ProjectTimeline
 *
 * @param props Component properties for `ProjectTimeline`
 *
 * @returns `ProjectTimeline` state
 */
const fetchData = async (props: IProjectTimelineProps): Promise<Partial<IProjectTimelineState>> => {
  try {
    const timelineConfiguration = await props.dataAdapter.fetchTimelineConfiguration()
    const [
      projects,
      projectData,
      timelineContentItems,
      timelineAggregatedContent = []
    ] = await Promise.all([
      props.dataAdapter.fetchEnrichedProjects(),
      props.dataAdapter.fetchTimelineProjectData(timelineConfiguration),
      props.dataAdapter.fetchTimelineContentItems(timelineConfiguration),
      props.dataAdapter.fetchTimelineAggregatedContent(
        props.configItemTitle,
        props.dataSourceName,
        timelineConfiguration
      )
    ])

    const filteredProjects = projects.filter((project) => {
      return project.startDate !== null && project.endDate !== null
    })

    const filteredTimelineItems = [...timelineContentItems, ...timelineAggregatedContent].filter(
      (item) => filteredProjects.some((project) => {
        return project.title.indexOf(item.title) !== -1
      })
    )

    let timelineItems = filteredProjects.map<TimelineContentListModel>((project) => {
      const config = projectData.configElement
      const statusReport = projectData?.reports?.find((statusReport) => {
        return statusReport.siteId === project.siteId
      })
      return new TimelineContentListModel(
        project.siteId,
        project.title,
        project.title,
        strings.ProjectLabel,
        project.startDate,
        project.endDate,
        '',
        '',
        statusReport?.budgetTotal,
        statusReport?.costsTotal,
        project.url,
        project.phase
      ).setConfig(config)
    })

    timelineItems = [...timelineItems, ...filteredTimelineItems]
    const groups = createProjectGroups(filteredProjects)
    const items = transformItems(timelineItems, groups)

    return {
      data: {
        items,
        groups
      },
      timelineConfig: timelineConfiguration
    } as Partial<IProjectTimelineState>
  } catch (error) {
    return { error }
  }
}

/**
 * Fetch hook for ProjectTimeline
 *
 * @param props Component properties for `ProjectTimeline`
 * @param fetchCallback Fetch callback
 */
export const useProjectTimelineDataFetch = (
  props: IProjectTimelineProps,
  fetchCallback: (data: Partial<IProjectTimelineState>) => void
) => {
  useEffect(() => {
    fetchData(props).then(fetchCallback)
  }, [])
}
