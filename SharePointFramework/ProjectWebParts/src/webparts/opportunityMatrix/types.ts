import { IOpportunityMatrixProps } from 'components/OpportunityMatrix'
import { IBaseWebPartComponentProps } from '../../components/BaseWebPartComponent/types'

export interface IOpportunityMatrixWebPartProps
  extends IBaseWebPartComponentProps,
    IOpportunityMatrixProps {
  listName?: string
  viewXml?: string
  probabilityFieldName?: string
  consequenceFieldName?: string
  probabilityPostActionFieldName?: string
  consequencePostActionFieldName?: string
}
