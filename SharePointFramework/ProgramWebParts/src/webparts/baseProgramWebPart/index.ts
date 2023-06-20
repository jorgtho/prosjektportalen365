import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import { LogLevel } from '@pnp/logging'
import '@pnp/polyfill-ie11'
import { sp } from '@pnp/sp'
import { IHubSite } from 'pp365-shared/lib/interfaces'
import React, { ComponentClass, FC } from 'react'
import ReactDom from 'react-dom'
import { SPDataAdapter } from '../../data'
import { IBaseProgramWebPartProps } from './types'

export abstract class BaseProgramWebPart<
  T extends IBaseProgramWebPartProps
> extends BaseClientSideWebPart<T> {
  public dataAdapter: SPDataAdapter
  public hubSite: IHubSite
  public childProjects: Array<Record<string, string>>
  public siteIds: string[]

  public abstract render(): void

  public renderComponent<T = any>(component: ComponentClass<T> | FC<T>, props?: T): void {
    const combinedProps = {
      ...this.properties,
      ...props,
      ...{
        pageContext: this.context.pageContext,
        dataAdapter: this.dataAdapter,
        displayMode: this.displayMode,
        title: this.properties.title
      }
    }
    const element: React.ReactElement<T> = React.createElement(component, combinedProps)
    ReactDom.render(element, this.domElement)
  }

  private async _setup() {
    await this.dataAdapter.configure(this.context, {
      siteId: this.context.pageContext.site.id.toString(),
      webUrl: this.context.pageContext.web.absoluteUrl,
      logLevel: sessionStorage.DEBUG || DEBUG ? LogLevel.Info : LogLevel.Warning
    })
  }

  public async onInit(): Promise<void> {
    sp.setup({ spfxContext: this.context })
    this.dataAdapter = new SPDataAdapter()
    this.dataAdapter.initChildProjects()
    this.context.statusRenderer.clearLoadingIndicator(this.domElement)
    await this._setup()
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] }
  }
}

export * from './types'
