import { ProjectTemplate } from 'models'
import { ProjectSetupSettings } from 'projectSetup/ProjectSetupSettings'
import { useState } from 'react'
import { first } from 'underscore'
import { ITemplateSelectDialogProps, ITemplateSelectDialogState } from './types'

export function useTemplateSelectDialog(props: ITemplateSelectDialogProps) {
  const getDefaultTemplate = (): ProjectTemplate => {
    let [defaultTemplate] = props.data.templates.filter((tmpl) => tmpl.isDefault)
    if (!defaultTemplate) defaultTemplate = first(props.data.templates)
    return defaultTemplate
  }
  const [state, $setState] = useState<ITemplateSelectDialogState>({
    selectedTemplate: getDefaultTemplate(),
    selectedExtensions: props.data.extensions.filter(
      (ext) => ext.isDefault || getDefaultTemplate().extensionIds?.some((id) => id === ext.id)
    ),
    selectedListContentConfig: props.data.listContentConfig.filter(
      (lcc) =>
        lcc.isDefault || getDefaultTemplate().listContentConfigIds?.some((id) => id === lcc.id)
    ),
    settings: new ProjectSetupSettings().useDefault()
  })

  /**
   * Updating state the same way as `this.setState` in class components.
   *
   * @param newState New state
   */
  function setState(newState: ITemplateSelectDialogState) {
    $setState((state_) => ({ ...state_, ...newState }))
  }

  /**
   * On submit the selected user configuration
   */
  const onSubmit = () => {
    props.onSubmit(state)
  }

  return { state, setState, onSubmit } as const
}
