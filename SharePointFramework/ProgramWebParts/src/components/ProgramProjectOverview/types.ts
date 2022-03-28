import { DataAdapter } from 'data'
import { IPortfolioConfiguration } from 'pp365-portfoliowebparts/lib/interfaces'
import { ICommandBarProperties } from 'models'

export interface IProjectProgramOverviewProps {
  webPartTitle: string
  context: any
  commandBarProperties: ICommandBarProperties
  configuration: IPortfolioConfiguration
  dataAdapter: DataAdapter
  isParentProject: boolean
}
