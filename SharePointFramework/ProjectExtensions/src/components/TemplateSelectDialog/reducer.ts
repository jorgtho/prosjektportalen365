import { createAction, createReducer, current } from '@reduxjs/toolkit'
import { ContentConfig, ProjectExtension, ProjectTemplate } from 'models'
import { ProjectSetupSettings } from 'projectSetup/ProjectSetupSettings'
import { first, uniq } from 'underscore'
import { IProjectSetupData } from '../../projectSetup/types'
import { ITemplateSelectDialogState } from './types'

export const INIT = createAction('INIT')
export const ON_LIST_CONTENT_CONFIG_CHANGED = createAction<ContentConfig[]>(
  'ON_LIST_CONTENT_CONFIG_CHANGED'
)
export const ON_EXTENSIONS_CHANGED = createAction<ProjectExtension[]>('ON_EXTENTIONS_CHANGED')
export const ON_TEMPLATE_CHANGED = createAction<ProjectTemplate>('ON_TEMPLATE_CHANGED')

export const initialState: ITemplateSelectDialogState = {
  selectedTemplate: null,
  selectedContentConfig: [],
  selectedExtensions: [],
  settings: new ProjectSetupSettings().useDefault()
}

/**
 * Create reducer for `TemplateSelectDialog`
 */
export default (data: IProjectSetupData) =>
  createReducer(initialState, {
    [INIT.type]: (state: ITemplateSelectDialogState) => {
      let [template] = data.templates.filter((t) => t.isDefault)
      if (!template) template = first(data.templates)
      state.selectedTemplate = template
      state.selectedContentConfig = template.getContentConfig(data.contentConfig)
      state.selectedExtensions = template.getExtensions(data.extensions)
      // eslint-disable-next-line no-console
      console.log(current(state))
    },

    [ON_LIST_CONTENT_CONFIG_CHANGED.type]: (
      state: ITemplateSelectDialogState,
      { payload }: ReturnType<typeof ON_LIST_CONTENT_CONFIG_CHANGED>
    ) => {
      const mandatoryContentConfig = data.contentConfig.filter((contentConfig) =>
        contentConfig.isMandatoryForTemplate(state.selectedTemplate)
      )
      state.selectedContentConfig = uniq(
        [...mandatoryContentConfig, ...payload],
        (contentConfig) => contentConfig.id
      )
    },

    [ON_EXTENSIONS_CHANGED.type]: (
      state: ITemplateSelectDialogState,
      { payload }: ReturnType<typeof ON_EXTENSIONS_CHANGED>
    ) => {
      const mandatoryExtensions = data.extensions.filter((ext) =>
        ext.isMandatoryForTemplate(state.selectedTemplate)
      )
      state.selectedExtensions = uniq(
        [...mandatoryExtensions, ...payload],
        (contentConfig) => contentConfig.id
      )
    },

    [ON_TEMPLATE_CHANGED.type]: (
      state: ITemplateSelectDialogState,
      { payload: template }: ReturnType<typeof ON_TEMPLATE_CHANGED>
    ) => {
      state.selectedTemplate = template
      state.selectedContentConfig = template?.getContentConfig(data.contentConfig) || []
      state.selectedExtensions = template?.getExtensions(data.extensions) || []
    }
  })
