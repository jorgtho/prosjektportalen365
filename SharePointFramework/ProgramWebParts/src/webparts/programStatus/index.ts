import * as ReactDom from 'react-dom'
import { Version } from '@microsoft/sp-core-library'
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane'
import * as strings from 'ProgramWebPartsStrings'
import { ProgramStatus } from '../../components/ProgramStatus/ProgramStatus'
import { IPortfolioConfiguration } from 'pp365-portfoliowebparts/lib/interfaces'
import { BaseProgramWebPart } from '../baseProgramWebPart'
import { PROPERTYPANE_CONFIGURATION_PROPS } from 'pp365-portfoliowebparts/lib/webparts/portfolioOverview'
import { IBaseWebPartComponentProps } from 'pp365-projectwebparts/lib/components/BaseWebPartComponent/types'
import { IProgramStatusProps } from 'components/ProgramStatus/types'

interface IProgramStatusWebPartProps extends IBaseWebPartComponentProps {
  webPartTitle: string
  showCommandBar: boolean
  showFilters: boolean
  showViewSelector: boolean
  showGroupBy: boolean
  showSearchBox: boolean
  showExcelExportButton: boolean
  defaultViewId: string
}

export default class ProgramStatusWebPart extends BaseProgramWebPart<IProgramStatusWebPartProps> {
  private _configuration: IPortfolioConfiguration

  public async onInit(): Promise<void> {
    await super.onInit()
    this._configuration = await this.dataAdapter.getPortfolioConfig()
  }

  public render(): void {
    this.renderComponent<IProgramStatusProps>(ProgramStatus, {
      webPartTitle: this.properties.webPartTitle,
      context: this.context,
      dataAdapter: this.dataAdapter,
      configuration: this._configuration,
      defaultViewId: this.properties.defaultViewId,
      commandBarProperties: {
        showCommandBar: this.properties.showCommandBar,
        showExcelExportButton: this.properties.showExcelExportButton,
        showFilters: this.properties.showFilters,
        showViewSelector: this.properties.showViewSelector,
        showGroupBy: this.properties.showGroupBy,
        showSearchBox: this.properties.showSearchBox
      }
    })
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0')
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle(PROPERTYPANE_CONFIGURATION_PROPS.SHOW_SEARCH_BOX, {
                  label: strings.ShowSearchBoxLabel
                }),
                PropertyPaneTextField(PROPERTYPANE_CONFIGURATION_PROPS.DEFAULT_VIEW_ID, {
                  label: strings.ProgramStatus_ViewIdLabel
                })
              ]
            },
            {
              groupName: strings.CommandBarGroupName,
              groupFields: [
                PropertyPaneToggle(PROPERTYPANE_CONFIGURATION_PROPS.SHOW_COMMANDBAR, {
                  label: strings.ShowCommandBarLabel
                }),
                PropertyPaneToggle(PROPERTYPANE_CONFIGURATION_PROPS.SHOW_GROUPBY, {
                  label: strings.ShowGroupByLabel,
                  disabled: !this.properties.showCommandBar
                }),
                PropertyPaneToggle(PROPERTYPANE_CONFIGURATION_PROPS.SHOW_FILTERS, {
                  label: strings.ShowFiltersLabel,
                  disabled: !this.properties.showCommandBar
                }),
                PropertyPaneToggle(PROPERTYPANE_CONFIGURATION_PROPS.SHOW_EXCELEXPORT_BUTTON, {
                  label: strings.ShowExcelExportButtonLabel,
                  disabled: !this.properties.showCommandBar
                })
              ]
            }
          ]
        },
        {
          groups: [
            {
              groupName: strings.ConfigurationGroupName,
              groupFields: [
                PropertyPaneTextField(PROPERTYPANE_CONFIGURATION_PROPS.COLUMN_CONFIG_LISTNAME, {
                  label: strings.ColumnConfigListNameLabel,
                  disabled: true
                }),
                PropertyPaneTextField(PROPERTYPANE_CONFIGURATION_PROPS.COLUMNS_LISTNAME, {
                  label: strings.ColumnsListNameLabel,
                  disabled: true
                }),
                PropertyPaneTextField(PROPERTYPANE_CONFIGURATION_PROPS.VIEWS_LISTNAME, {
                  label: strings.ViewsListNameLabel,
                  disabled: true
                })
              ]
            }
          ]
        }
      ]
    }
  }
}