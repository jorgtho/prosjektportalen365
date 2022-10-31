import { Web } from '@pnp/sp'
import { ProjectInformation } from 'components/ProjectInformation'
import { ProjectStatusContext } from 'components/ProjectStatus/context'
import React, { FC, useContext } from 'react'
import { StatusElement } from '../../StatusElement'
import { BaseSection } from '../BaseSection'
import { SectionContext } from '../context'
import { useCreateContextValue } from '../useCreateContextValue'
import styles from './SummarySection.module.scss'

export const SummarySection: FC = () => {
  const context = useContext(ProjectStatusContext)
  const createContextValue = useCreateContextValue({})

  /**
   * Render sections
   */
  function renderSections() {
    return context.state.data.sections.map((sec, idx) => {
      const ctxValue = createContextValue(sec)
      if (ctxValue.headerProps.value || sec.fieldName === 'GtOverallStatus') {
        return (
          <SectionContext.Provider key={idx} value={ctxValue}>
            <div key={idx} className='ms-Grid-col ms-sm6'>
              <StatusElement />
            </div>
          </SectionContext.Provider>
        )
      }
    })
  }

  return (
    <BaseSection>
      <div className={styles.root}>
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
        <div className={styles.sections}>
          <div className='ms-Grid' dir='ltr'>
            <div className='ms-Grid-row'>{renderSections()}</div>
          </div>
        </div>
      </div>
    </BaseSection>
  )
}
