import React from 'react'
import PropTypes from 'prop-types'
import { AdvisoriesNestedList } from '../AdvisoriesNestedList/AdvisoriesNestedList.component'
import { airmapIntl } from 'libs/airmap-intl'
import { advisoriesListWrapper, list, emptyAdvisoriesText } from './AdvisoriesList.styles.scss'
import { AdvisoriesListMessages } from './AdvisoriesList.messages'
import { parseAdvisoriesForList } from './AdvisoriesList.helpers'

export const AdvisoriesList = ({ advisoriesData, handleSelectAdvisory, selectedAdvisory, clearSelectedAdvisory }) => {
  const advisories = advisoriesData.advisories
  const hasAdvisories = advisories && Boolean(advisories.length)
  const parsedAdvisories = hasAdvisories ? parseAdvisoriesForList(advisories) : []

  return (
    <div className={advisoriesListWrapper} id="derivedHeightContainer">
      {hasAdvisories && (
        <ul className={list}>
          {parsedAdvisories.map(category => (
            <AdvisoriesNestedList
              key={`${category.type}|${category.color}`}
              category={category}
              clearAdvisory={clearSelectedAdvisory}
              color={category.color}
              handleSelectAdvisory={handleSelectAdvisory}
              selectedAdvisory={selectedAdvisory}
            />
          ))}
        </ul>
      )}
      {advisoriesData.advisories && Boolean(advisoriesData.advisories.length <= 0) && (
        <div className={emptyAdvisoriesText}>
          {airmapIntl.translateMessage(AdvisoriesListMessages.no_advisories_message)}
        </div>
      )}
    </div>
  )
}

AdvisoriesList.propTypes = {
  advisoriesData: PropTypes.shape({
    color: PropTypes.string,
    advisories: PropTypes.array
  }),
  clearSelectedAdvisory: PropTypes.func.isRequired,
  handleSelectAdvisory: PropTypes.any,
  selectedAdvisory: PropTypes.any,
  classes: PropTypes.object
}
