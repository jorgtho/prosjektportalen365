import { MenuNode, sp } from '@pnp/sp'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Spinner,
  SpinnerSize
} from '@fluentui/react'
import strings from 'ProjectWebPartsStrings'
import React, { FunctionComponent, useContext, useState } from 'react'
import { ProjectInformationContext } from '../context'
import { ProjectSetupCustomAction } from './ProjectSetupCustomAction'

export const CreateParentModal: FunctionComponent = () => {
  const context = useContext(ProjectInformationContext)
  const [isLoading, setLoading] = useState(false)

  async function applyCustomAction() {
    setLoading(true)
    await sp.web.userCustomActions.add(ProjectSetupCustomAction)
    location.reload()
  }

  return (
    <>
      <Dialog
        hidden={false}
        onDismiss={() => context.setState({ displayCreateParentModal: false })}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: strings.CreateParentModalTitle,
          subText: strings.CreateParentModalSubText
        }}>
        {!isLoading && (
          <DialogFooter>
            <DefaultButton
              text={strings.CancelText}
              onClick={() => context.setState({ displayCreateParentModal: false })}
            />
            <PrimaryButton
              text={strings.RedoText}
              onClick={() => {
                saveNavigationNodes()
                applyCustomAction()
              }}
            />
          </DialogFooter>
        )}
        {isLoading && <Spinner size={SpinnerSize.medium} />}
      </Dialog>
    </>
  )
}

/**
 * Fetches current navigation nodes and stores it in local storage.
 * The nodes are used to create new nodes in the navigation menu
 * after the template is applied.
 */
async function saveNavigationNodes() {
  try {
    const nodes = await getNavigationNodes()
    localStorage.setItem('pp_navigationNodes', JSON.stringify(nodes))
  } catch (error) {
    throw error
  }
}

async function getNavigationNodes(): Promise<MenuNode[]> {
  try {
    const menuState = await sp.navigation.getMenuState()
    return menuState.Nodes
  } catch (error) {
    throw error
  }
}
