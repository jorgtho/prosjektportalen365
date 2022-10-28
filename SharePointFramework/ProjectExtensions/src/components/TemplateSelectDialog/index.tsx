import { DefaultButton, DialogFooter, Pivot, PivotItem, PrimaryButton } from '@fluentui/react'
import * as strings from 'ProjectExtensionsStrings'
import React, { FC } from 'react'
import { isEmpty } from 'underscore'
import { BaseDialog } from '../@BaseDialog'
import { TemplateSelectDialogContext } from './context'
import { ExtensionsSection } from './ExtensionsSection'
import { ContentConfigSection } from './ContentConfigSection'
import styles from './TemplateSelectDialog.module.scss'
import { TemplateSelector } from './TemplateSelector'
import { ITemplateSelectDialogProps } from './types'
import { useTemplateSelectDialog } from './useTemplateSelectDialog'

export const TemplateSelectDialog: FC<ITemplateSelectDialogProps> = (props) => {
  const { state, dispatch, onSubmit } = useTemplateSelectDialog(props)

  return (
    <TemplateSelectDialogContext.Provider value={{ props, state, dispatch }}>
      <BaseDialog
        version={props.version}
        dialogContentProps={{
          title: strings.TemplateSelectDialogTitle,
          subText: strings.TemplateSelectDialogInfoText,
          className: styles.content
        }}
        modalProps={{ containerClassName: styles.root, isBlocking: true, isDarkOverlay: true }}
        onDismiss={props.onDismiss}
        containerClassName={styles.root}>
        <Pivot style={{ minHeight: 450 }}>
          <PivotItem headerText={strings.TemplateSelectorTitle} itemIcon='ViewListGroup'>
            <TemplateSelector />
          </PivotItem>
          <PivotItem
            headerText={strings.ExtensionsSectionHeaderText}
            itemIcon='ArrangeBringForward'
            headerButtonProps={
              (isEmpty(props.data.extensions) || !state.selectedTemplate) && {
                disabled: true,
                style: { opacity: 0.3, cursor: 'default' }
              }
            }>
            <ExtensionsSection style={{ height: 400 }} />
          </PivotItem>
          <PivotItem
            headerText={strings.ContentConfigSectionHeaderText}
            itemIcon='ViewList'
            headerButtonProps={
              (isEmpty(props.data.contentConfig) || !state.selectedTemplate) && {
                disabled: true,
                style: { opacity: 0.3, cursor: 'default' }
              }
            }>
            <ContentConfigSection style={{ height: 400 }} />
          </PivotItem>
        </Pivot>
        <DialogFooter>
          <PrimaryButton
            disabled={!state.selectedTemplate}
            text={strings.TemplateSelectDialogSubmitButtonText}
            onClick={onSubmit}
          />
          <DefaultButton text={strings.CloseModalText} onClick={props.onDismiss} />
        </DialogFooter>
      </BaseDialog>
    </TemplateSelectDialogContext.Provider>
  )
}

export * from './types'
