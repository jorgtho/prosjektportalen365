import { Web } from '@pnp/sp'
import { ProjectInformation } from 'components/ProjectInformation'
import { ProjectStatusContext } from 'components/ProjectStatus/context'
import React, { FC, useContext } from 'react'
import { StatusElement } from '../../StatusElement'
import { BaseSection } from '../BaseSection'
import { SectionContext } from '../context'
import { useCreateContextValue } from '../useCreateContextValue'
import { ISummarySectionProps } from './types'
import styles from './SummarySection.module.scss'
import { conditionalClassName } from 'pp365-shared/lib/util'
import { pick } from 'underscore'

export const SummarySection: FC<ISummarySectionProps> = (props) => {
  const context = useContext(ProjectStatusContext)
  const createContextValue = useCreateContextValue({})

  /**
   * Render sections where `ctxValue.headerProps.value` is set, or the `fieldName` is
   * **GtOverallStatus**.
   */
  function renderSections() {
    return context.state.data.sections.map((sec, idx) => {
      const ctxValue = createContextValue(sec)
      const shouldRender = ctxValue.headerProps.value || sec.fieldName === 'GtOverallStatus'
      return shouldRender ? (
        <SectionContext.Provider key={idx} value={ctxValue}>
          <div key={idx} className='ms-Grid-col ms-sm6'>
            <StatusElement {...pick(props, 'iconSize', 'truncateComment')} />
          </div>
        </SectionContext.Provider>
      ) : null
    })
  }

  return (
    <BaseSection {...props}>
      <div className={styles.root}>
        {props.showProjectInformation && (
          <div className={styles.projectInformation}>
            <ProjectInformation
              hubSite={{
                web: new Web(context.props.hubSite.url),
                url: context.props.hubSite.url
              }}
              siteId={context.props.siteId}
              webUrl={context.props.webUrl}
              page='ProjectStatus'
              hideAllActions={true}
            />
          </div>
        )}
        <div
          className={conditionalClassName([
            styles.sections,
            !props.showProjectInformation && styles.fullWidth
          ])}>
          <div className='ms-Grid' dir='ltr'>
            <div className='ms-Grid-row'>{renderSections()}</div>
          </div>
        </div>
      </div>
    </BaseSection>
  )
}
