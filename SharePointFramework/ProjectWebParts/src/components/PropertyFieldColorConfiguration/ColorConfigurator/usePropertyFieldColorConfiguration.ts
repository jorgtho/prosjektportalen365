import { useEffect, useMemo, useReducer } from 'react'
import _ from 'underscore'
import { IPropertyFieldColorConfigurationProps } from '../types'
import createReducer, { INIT, REVERT_CONFIG } from './reducer'

export function usePropertyFieldColorConfiguration(props: IPropertyFieldColorConfigurationProps) {
  const reducer = useMemo(() => createReducer(props), [props])
  const [state, dispatch] = useReducer(reducer, { config: [] })

  useEffect(() => {
    dispatch(INIT())
  }, [])

  let onSave: () => void = null
  let onRevertDefault: () => void = null

  if (!_.isEqual(props.value, state.config)) onSave = () => props.onChange(null, state.config)
  if (!_.isEqual(props.defaultValue, state.config)) {
    onRevertDefault = () => {
      dispatch(REVERT_CONFIG())
      props.onChange(null, undefined)
    }
  }

  return { state, dispatch, onSave, onRevertDefault } as const
}
