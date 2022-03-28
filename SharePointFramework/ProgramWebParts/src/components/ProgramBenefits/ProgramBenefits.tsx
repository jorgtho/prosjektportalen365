import React, { FunctionComponent } from 'react'
import { IProgramBenefitsProps, selectProperties } from './types'
import { getColumns } from 'pp365-portfoliowebparts/lib/components/BenefitsOverview/columns'
import { PortfolioAggregation } from 'pp365-portfoliowebparts/lib/components/PortfolioAggregation'
import {
  Benefit,
  BenefitMeasurement,
  BenefitMeasurementIndicator
} from 'pp365-portfoliowebparts/lib/models'
import {
  CONTENT_TYPE_ID_BENEFITS,
  CONTENT_TYPE_ID_MEASUREMENTS,
  CONTENT_TYPE_ID_INDICATORS
} from 'pp365-portfoliowebparts/lib/components/BenefitsOverview/config'

export const ProgramBenefits: FunctionComponent<IProgramBenefitsProps> = (props) => {
  const columns = getColumns({ hiddenColumns: [] })

  return (
    <PortfolioAggregation
      title={props.webPartTitle}
      pageContext={props.context.pageContext}
      dataAdapter={props.dataAdapter}
      showCommandBar={props.properties.showCommandBar}
      showExcelExportButton={props.properties.showExcelExportButton}
      showSearchBox={props.properties.showSearchBox}
      dataSource={props.properties.dataSource}
      columns={columns}
      selectProperties={selectProperties}
      postTransform={_postTransform}
      lockedColumns={true}
      isParent={true}
      onUpdateProperty={props.onUpdateProperty}
    />
  )
}

function _postTransform(results: any[]): any[] {
  const benefits = results
    .filter((res) => res.ContentTypeID.indexOf(CONTENT_TYPE_ID_BENEFITS) === 0)
    .map((res) => new Benefit(res))
  const measurements = results
    .filter((res) => res.ContentTypeID.indexOf(CONTENT_TYPE_ID_MEASUREMENTS) === 0)
    .map((res) => new BenefitMeasurement(res))
    .sort((a, b) => b.Date.getTime() - a.Date.getTime())
  const indicactors = results
    .filter((res) => res.ContentTypeID.indexOf(CONTENT_TYPE_ID_INDICATORS) === 0)
    .map((res) => {
      const indicator = new BenefitMeasurementIndicator(res)
        .setMeasurements(measurements)
        .setBenefit(benefits)
      return indicator
    })
    .filter((i) => i.Benefit)
  return indicactors
}
