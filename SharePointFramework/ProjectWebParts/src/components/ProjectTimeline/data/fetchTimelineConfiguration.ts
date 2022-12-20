import SPDataAdapter from 'data/SPDataAdapter'
import {
  SPTimelineConfigurationItem,
  TimelineConfigurationModel
} from 'pp365-portfoliowebparts/lib/models'
import strings from 'ProjectWebPartsStrings'

/**
 * Fetch timeline configuration
 */
export async function fetchTimelineConfiguration() {
  return (
    await SPDataAdapter.portal.web.lists
      .getByTitle(strings.TimelineConfigurationListName)
      .items.select(...new SPTimelineConfigurationItem().fields)
      .orderBy('GtSortOrder')
      .getAll()
  )
    .map((item) => new TimelineConfigurationModel(item))
    .filter(Boolean)
}
