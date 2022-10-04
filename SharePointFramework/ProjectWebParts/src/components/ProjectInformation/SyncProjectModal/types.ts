import { WebPartContext } from '@microsoft/sp-webpart-base'
import { IHubSite } from 'sp-hubsite-service'
import { IProjectInformationData } from '../types'

export interface SyncModalProps {
  isOpen: boolean
  onDismiss: () => void
  onSyncProperties: (
    event?: React.MouseEvent<any>,
    force?: boolean
  ) => void
  data?: IProjectInformationData
  title?: string
  hubSite?: IHubSite
  context: WebPartContext
}

