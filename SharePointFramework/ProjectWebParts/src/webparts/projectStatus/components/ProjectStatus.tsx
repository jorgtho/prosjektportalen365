import * as React from 'react';
import { Logger, LogLevel } from '@pnp/logging';
import { List } from '@pnp/sp';
import styles from './ProjectStatus.module.scss';
import * as strings from 'ProjectStatusWebPartStrings';
import '@pnp/polyfill-ie11';
import { IProjectStatusProps } from './IProjectStatusProps';
import { IProjectStatusState, IProjectStatusData } from './IProjectStatusState';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import SummarySection from './SummarySection';
import StatusSection from './StatusSection';
import ListSection from './ListSection';
import ProjectPropertiesSection from './ProjectPropertiesSection';
import ProjectStatusReport from '../models/ProjectStatusReport';
import SectionModel, { SectionType } from './SectionModel';
import { IStatusSectionBaseProps } from './@StatusSectionBase/IStatusSectionBaseProps';
import getObjectValue from 'prosjektportalen-spfx-shared/lib/helpers/getObjectValue';

export default class ProjectStatus extends React.Component<IProjectStatusProps, IProjectStatusState> {
  private reportList: List;
  private sectionsList: List;

  constructor(props: IProjectStatusProps) {
    super(props);
    this.state = {
      isLoading: true,
      associateStatusItem: document.location.hash === '#NewStatus',
    };
    this.reportList = props.hubSite.web.lists.getByTitle(props.reportListName) as any;
    this.sectionsList = props.hubSite.web.lists.getByTitle(props.sectionsListName) as any;
  }

  public async componentDidMount() {
    if (this.state.associateStatusItem) {
      await this.associateStatusItem();
    }
    const data = await this.fetchData();
    this.setState({ data, selectedReport: data.reports[0], isLoading: false });
  }


  /**
   * Renders the <ProjectStatus /> component
   */
  public render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.projectStatus}>
          <div className={styles.container}>
            <Spinner label={strings.LoadingText} />
          </div>
        </div>
      );
    }

    let reportOptions = this.getReportOptions();
    let title = this.getTitle();

    return (
      <div className={styles.projectStatus}>
        <div className={styles.container}>
          <div className={`${styles.header} ${styles.column12}`}>
            <div className={styles.title}>{title}</div>
          </div>
          <div className={`${styles.actions} ${styles.column8}`}>
            <DefaultButton
              text={strings.NewStatusReportModalHeaderText}
              href={this.getReportNewFormUrl()}
              iconProps={{ iconName: 'NewFolder' }} />
            <DefaultButton
              disabled={!this.state.selectedReport}
              text={strings.EditReportButtonText}
              href={this.getSelectedReportEditFormUrl()}
              iconProps={{ iconName: 'Edit' }} />
          </div>
          <div className={styles.column4}>
            <Dropdown
              onChanged={this.onReportChanged}
              defaultSelectedKey='0'
              options={reportOptions}
              disabled={reportOptions.length === 0} />
          </div>
          <div className={`${styles.sections} ${styles.column12}`}>
            {this.state.selectedReport && this.renderSections()}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Associate status item
   */
  private async associateStatusItem(): Promise<void> {
    const [item] = await this.reportList.items.select('Id').orderBy('Id').top(1).get<{ Id: number }[]>();
    await this.reportList.items.getById(item.Id).update({ GtSiteId: this.props.siteId });
    document.location.hash = '#';
  }

  /**
   * Get section base props
   * 
   * @param {SectionModel} model Section model
   */
  private getSectionBaseProps(model: SectionModel): IStatusSectionBaseProps {
    const { context } = this.props;
    const { selectedReport, data } = this.state;
    const baseProps: IStatusSectionBaseProps = {
      headerProps: {
        label: model.name,
        value: selectedReport.item[model.fieldName],
        comment: selectedReport.item[model.commentFieldName],
        iconName: model.iconName,
        iconSize: 50
      },
      report: selectedReport,
      model,
      context,
      data,
    };
    return baseProps;
  }

  /**
   * Render sections
   */
  private renderSections() {
    let sortedSections = this.state.data.sections.sort((a, b) => a.sortOrder < b.sortOrder ? -1 : 1);
    return sortedSections.map(model => {
      const baseProps = this.getSectionBaseProps(model);
      switch (model.type) {
        case SectionType.SummarySection: {
          return (
            <SummarySection
              {...baseProps}
              entity={this.props.entity}
              sections={sortedSections} />
          );
        }
        case SectionType.StatusSection: {
          return <StatusSection {...baseProps} />;
        }
        case SectionType.ProjectPropertiesSection: {
          return (
            <ProjectPropertiesSection
              {...baseProps}
              entityItem={this.state.data.entityItem}
              entityFields={this.state.data.entityFields} />
          );
        }
        case SectionType.RiskSection: {
          return <ListSection {...baseProps} />;
        }
        case SectionType.ListSection: {
          return <ListSection {...baseProps} />;
        }
        default: {
          return null;
        }
      }
    });
  }

  /**
   * Get title
   */
  private getTitle() {
    let title = this.props.title;
    if (this.state.selectedReport) {
      title = `${this.props.title} (${this.state.selectedReport.toString()})`;
    }
    return title;
  }

  /**
   * Get selected report edit form url
   */
  private getSelectedReportEditFormUrl(): string {
    const { selectedReport, data } = this.state;
    if (selectedReport) {
      return `${window.location.protocol}//${window.location.hostname}${data.reportListProps.DefaultEditFormUrl}?ID=${selectedReport.item.Id}&Source=${encodeURIComponent(window.location.href)}`;
    }
    return null;
  }

  /**
   * Get report new form url
   */
  private getReportNewFormUrl(): string {
    const { data } = this.state;
    return `${window.location.protocol}//${window.location.hostname}${data.reportListProps.DefaultNewFormUrl}?Source=${encodeURIComponent(`${window.location.href}#NewStatus`)}`;
  }

  /**
   * On report changed
   */
  @autobind
  private onReportChanged(option: IDropdownOption) {
    this.setState({ selectedReport: option.data });
  }

  /**
   * Get report options
   */
  private getReportOptions(): IDropdownOption[] {
    let reportOptions: IDropdownOption[] = getObjectValue<ProjectStatusReport[]>(this.state, 'data.reports', []).map((report, idx) => ({
      key: `${idx}`,
      text: report.toString(),
      data: report,
    }));
    return reportOptions;
  }

  /**
   * Fetch data
   */
  private async fetchData(): Promise<IProjectStatusData> {
    Logger.log({ message: '(ProjectStatus) fetchData: Fetching fields and reports', data: {}, level: LogLevel.Info });
    const [entityItem, entityFields] = await Promise.all([
      this.props.spEntityPortalService.getEntityItemFieldValues(this.props.siteId),
      this.props.spEntityPortalService.getEntityFields(),
    ]);
    let reportListProps = await this.reportList
      .select('DefaultEditFormUrl', 'DefaultNewFormUrl')
      .expand('DefaultEditFormUrl', 'DefaultNewFormUrl')
      .get();
    let [reports, sections] = await Promise.all([
      this.reportList.items.filter(`GtSiteId eq '${this.props.siteId}'`).get(),
      this.sectionsList.items.get(),
    ]);
    reports = reports.map(r => new ProjectStatusReport(r));
    sections = sections.map(s => new SectionModel(s));
    return { entityFields, entityItem, reportListProps, reports, sections };
  }
}
