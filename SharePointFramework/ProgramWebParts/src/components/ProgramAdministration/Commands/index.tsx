import { Spinner, ICommandBarItemProps, CommandBar } from '@fluentui/react'
import { isEmpty } from '@microsoft/sp-lodash-subset'
import * as strings from 'ProgramWebPartsStrings'
import React, { FC, useContext } from 'react'
import { ProgramAdministrationContext } from '../context'
import { removeChildProjects } from '../data'
import { CHILD_PROJECTS_REMOVED, TOGGLE_ADD_PROJECT_DIALOG } from '../reducer'

export const Commands: FC = () => {
  const context = useContext(ProgramAdministrationContext)
  const getLoadingBar = () => {
    const commandBarButtonAs = () => (
      <div
        style={{
          width: '120px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
        <Spinner />
      </div>
    )
    return context.state.loading.root ? commandBarButtonAs : null
  }

  const _items: ICommandBarItemProps[] = [
    {
      key: 'ProgramAddChilds',
      text: strings.ProgramAddChildsButtonText,
      iconProps: { iconName: 'Add' },
      buttonStyles: { root: { border: 'none' } },
      onClick: () => context.dispatch(TOGGLE_ADD_PROJECT_DIALOG()),
      disabled: !context.state.userHasManagePermission
    },
    {
      key: 'ProgramRemoveChilds',
      text: strings.ProgramRemoveChildsButtonText,
      iconProps: { iconName: 'Delete' },
      buttonStyles: { root: { border: 'none' } },
      disabled:
        isEmpty(context.state.selectedProjectsToDelete) || !context.state.userHasManagePermission,
      onClick: () => {
        removeChildProjects(context.props.dataAdapter, context.state.selectedProjectsToDelete).then(
          (childProjects) => {
            context.dispatch(CHILD_PROJECTS_REMOVED({ childProjects }))
          }
        )
      },
      commandBarButtonAs: getLoadingBar()
    }
  ]

  return <CommandBar items={_items} style={{ backgroundColor: 'white', marginBottom: '5px' }} />
}
