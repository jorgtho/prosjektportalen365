import _ from 'underscore'
import moment from 'moment'
import React, { useState } from 'react'
import { ITimelineItem, TimelineGroupType } from '../../../interfaces'
import { ITimelineProps } from './types'
import { useGroupRenderer } from './useGroupRenderer'
import { useItemRenderer } from './useItemRenderer'

export function useTimeline(props: ITimelineProps) {
  const [showDetails, setShowDetails] = useState<{
    item: ITimelineItem
    element: HTMLElement
  }>(null)

  const [showFilterPanel, setShowFilterPanel] = useState(false)

  /**
   * On item click
   *
   * @param event Event
   * @param item Item
   */
  const onItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ITimelineItem
  ) => {
    setShowDetails({ element: event.currentTarget, item })
  }

  const defaultTimeStart = moment().add(...props.defaultTimeframe[0])
  const defaultTimeEnd = moment().add(...props.defaultTimeframe[1])
  let sidebarWidth = 300

  if (props.isGroupByEnabled) {
    sidebarWidth = 120
    if (_.first(props.groups)?.type === TimelineGroupType.Project) sidebarWidth = 0
  }
  if (props.hideSidebar) {
    sidebarWidth = 0
  }

  const itemRenderer = useItemRenderer(onItemClick)
  const groupRenderer = useGroupRenderer()

  return {
    defaultTimeStart,
    defaultTimeEnd,
    sidebarWidth,
    showFilterPanel,
    setShowFilterPanel,
    showDetails,
    setShowDetails,
    onItemClick,
    itemRenderer,
    groupRenderer
  } as const
}
