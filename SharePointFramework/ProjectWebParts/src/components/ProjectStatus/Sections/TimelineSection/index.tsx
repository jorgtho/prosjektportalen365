import * as React from 'react'
import { ITimelineSectionProps, ITimelineSectionState } from './types'
import { BaseSection } from '../BaseSection'
import { StatusElement } from '../../StatusElement'
import { ProjectTimeline } from 'components/ProjectTimeline'
import styles from './TimelineSection.module.scss'

export class TimelineSection extends BaseSection<ITimelineSectionProps, ITimelineSectionState> {
  constructor(props: ITimelineSectionProps) {
    super(props)
    this.state = {
      loading: true
    }
  }

  /**
   * Renders the <TimelineSection /> component
   */
  public render(): React.ReactElement<ITimelineSectionProps> {
    return (
      <BaseSection {...this.props}>
        <StatusElement {...this.props.headerProps}
          iconColor='#2da748'
          value=''
        />
        <div className='ms-Grid-row'>
          <div className={`${styles.list} ms-Grid-col ms-sm12`}>
            <ProjectTimeline {...this.props}
              showTimelineList
              isSelectionModeNone
              showCmdTimelineList={false}
              showFilterButton={false}
              showInfoMessage={false}
              showTimeline={false}
              showTitle={false}
            />
          </div>
        </div>
      </BaseSection>
    )
  }
}
