import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane'
import { IPortfolioAggregationProps, PortfolioAggregation } from 'components/PortfolioAggregation'
import { DataAdapter } from 'data'
import { IAggregatedListConfiguration } from 'interfaces'
import _ from 'lodash'
import { IMessageBarProps, MessageBar } from '@fluentui/react/lib/MessageBar'
import * as strings from 'PortfolioWebPartsStrings'
import React from 'react'
import { first } from 'underscore'
import { BasePortfolioWebPart } from 'webparts/@basePortfolioWebPart'

export default class PortfolioAggregationWebPart extends BasePortfolioWebPart<
  IPortfolioAggregationProps
> {
  private _configuration: IAggregatedListConfiguration

  public render(): void {
    if (!this.properties.dataSource) {
      this.renderComponent<IMessageBarProps>(MessageBar, {
        children: <span>{strings.PortfolioAggregationNotConfiguredMessage}</span>
      })
    } else {
      this.renderComponent<IPortfolioAggregationProps>(PortfolioAggregation, {
        ...this.properties,
        dataAdapter: new DataAdapter(this.context),
        configuration: this._configuration,
        onUpdateProperty: this._onUpdateProperty.bind(this)
      })
    }
  }

  /**
   * On update property
   *
   * @param key Key
   * @param value Value
   */
  private _onUpdateProperty(key: string, value: any) {
    this.properties[key] = value
    this.context.propertyPane.refresh()
  }

  public async onInit(): Promise<void> {
    await super.onInit()
    this._configuration = await this.dataAdapter.getAggregatedListConfig(
      this.properties.dataSourceCategory
    )
  }

  /**
   * Get options for PropertyPaneDropdown
   */
  protected _getViewOptions(): IPropertyPaneDropdownOption[] {
    if (this._configuration) {
      return [...this._configuration.views.map((view) => ({ key: view.id, text: view.title }))]
    }
    return []
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.DataSourceGroupName,
              groupFields: [
                PropertyPaneTextField('dataSourceCategory', {
                  label: strings.DataSourceCategoryLabel,
                  description: strings.DataSourceCategoryDescription
                }),
                PropertyPaneDropdown('defaultViewId', {
                  label: strings.DefaultDataSourceViewLabel,
                  options: this._getViewOptions(),
                  selectedKey:
                    _.find(this._configuration.views, (v) => v.isDefault)?.id ||
                    first(this._configuration.views).id
                })
              ]
            },
            {
              groupName: strings.CommandBarGroupName,
              groupFields: [
                PropertyPaneToggle('showCommandBar', {
                  label: strings.ShowCommandBarLabel
                }),
                PropertyPaneToggle('showFilters', {
                  label: strings.ShowFiltersLabel,
                  disabled: !this.properties.showCommandBar
                }),
                PropertyPaneToggle('showExcelExportButton', {
                  label: strings.ShowExcelExportButtonLabel,
                  disabled: !this.properties.showCommandBar
                }),
                PropertyPaneToggle('showViewSelector', {
                  label: strings.ShowViewSelectorLabel,
                  disabled: !this.properties.showCommandBar
                })
              ]
            },
            {
              groupName: strings.SearchBoxGroupName,
              groupFields: [
                PropertyPaneToggle('showSearchBox', {
                  label: strings.ShowSearchBoxLabel
                }),
                PropertyPaneTextField('searchBoxPlaceholderText', {
                  label: strings.SearchBoxPlaceholderTextLabel,
                  disabled: !this.properties.showSearchBox
                })
              ]
            }
          ]
        }
      ]
    }
  }
}
