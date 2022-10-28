import { stringIsNullOrEmpty } from '@pnp/common'
import { List, sp, Web } from '@pnp/sp'
import { IListProperties } from './IListProperties'
import { UserSelectableObject } from './UserSelectableObject'

export interface IContentConfigSPItem {
  ContentTypeId: string
  Id: number
  Title: string
  GtDescription: string
  GtLccDestinationList: string
  GtLccFields: string
  GtLccDefault: boolean
  GtLccSourceList: string
  GtLccHidden: boolean
  GtLccLocked: boolean
}

export enum ContentConfigType {
  List,
  Planner
}

/**
 * @model ContentConfig
 */
export class ContentConfig extends UserSelectableObject {
  public sourceListProps: IListProperties = {}
  public destListProps: IListProperties = {}
  private _sourceList: string
  private _destinationList: string

  constructor(private _spItem: IContentConfigSPItem, public web: Web) {
    super(
      _spItem.Id,
      _spItem.Title,
      _spItem.GtDescription,
      _spItem.GtLccDefault,
      _spItem.GtLccLocked,
      _spItem.GtLccHidden
    )
    this._sourceList = _spItem.GtLccSourceList
    this._destinationList = _spItem.GtLccDestinationList
  }

  public get type(): ContentConfigType {
    if (this._spItem.ContentTypeId.indexOf('0x0100B8B4EE61A547B247B49CFC21B67D5B7D01') !== -1)
      return ContentConfigType.Planner
    return ContentConfigType.List
  }
  public get fields() {
    return !stringIsNullOrEmpty(this._spItem.GtLccFields) ? this._spItem.GtLccFields.split(',') : []
  }

  public get sourceList(): List {
    return this.web.lists.getByTitle(this._sourceList)
  }

  public get destList(): List {
    return sp.web.lists.getByTitle(this._destinationList)
  }

  public async load() {
    this.sourceListProps = await this.sourceList
      .select('Title', 'ListItemEntityTypeFullName', 'ItemCount', 'BaseTemplate')
      .expand('RootFolder')
      .get<IListProperties>()
    if (this.type === ContentConfigType.List) {
      this.destListProps = await this.destList
        .select('Title', 'ListItemEntityTypeFullName', 'ItemCount', 'BaseTemplate')
        .expand('RootFolder')
        .get<IListProperties>()
    }
  }
}