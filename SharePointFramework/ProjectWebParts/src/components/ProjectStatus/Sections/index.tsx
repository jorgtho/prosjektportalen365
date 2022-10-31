import { UserMessage } from 'pp365-shared/lib/components/UserMessage'
import strings from 'ProjectWebPartsStrings'
import React, { FC, useContext } from 'react'
import { ProjectStatusContext } from '../context'
import { SectionContext } from './context'
import { SectionMap } from './SectionMap'
import styles from './Sections.module.scss'
import { useCreateContextValue } from './useCreateContextValue'
import { useSections } from './useSections'

export const Sections: FC = () => {
  const context = useContext(ProjectStatusContext)
  const createContextValue = useCreateContextValue({ iconSize: 50 })
  const { sections } = useSections()

  if (!context.state.selectedReport) return <UserMessage text={strings.NoStatusReportsMessage} />
  return (
    <div className={styles.root}>
      {sections.map((sec, idx) => {
        return (
          <SectionContext.Provider key={idx} value={createContextValue(sec)}>
            {SectionMap[sec.type] ?? null}
          </SectionContext.Provider>
        )
      })}
    </div>
  )
}
