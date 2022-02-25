import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { airmapIntl } from 'libs/airmap-intl'
import { Loader } from 'modules/shared-components/Loader/Loader.component'
import { Close } from 'modules/icons/components/Close/Close.component'
import { SelectedAdvisoryDetail } from '../SelectedAdvisoryDetail/SelectedAdvisoryDetail.component'
import {
  listWrapper,
  headerList,
  headerListTitle,
  closeButton,
  section,
  loaderWrapper,
  headerSection,
  sectionTitle,
  appliedFilterChip,
  activeAdvisoriesWrapper,
  inactiveSection,
  inactiveAdvisoriesWrapper,
  inactiveAdvisoriesHidden,
  inactiveParagraph,
  showInactiveLink,
  appliedValue,
  advisoriesWrapperSmall
} from './SelectedAdvisoriesList.styles.scss'
import { SelectedAdvisoriesListMessages } from './SelectedAdvisoriesList.messages'

export const SelectedAdvisoriesList = ({
  selectedAdvisories,
  clearClickedAdvisories,
  isFetchingSelectedAdvisories,
  appliedAdvisoriesFilter,
  shouldShowInactiveAdvisories,
  showInactiveAdvisories,
  handleSelectAdvisory,
  selectedAdvisory,
  applyFilterToLayers,
  selectedAdvisorySettings: { cssPosition },
  selectedAdvisoryHasSmallSize
}) => {
  const [activeAdvisories, inactiveAdvisories] = useMemo(() => {
    const activeAdvisories = []
    const inactiveAdvisories = []

    selectedAdvisories.forEach(advisory => {
      const isActive = !advisory.schedule || advisory.schedule.some(timesheet => timesheet.active)
      const isActiveUnknown =
        !isActive && advisory.schedule && advisory.schedule.every(timesheet => typeof timesheet.active === 'undefined')

      const advisoryToPush = {
        ...advisory,
        isActive,
        isActiveUnknown
      }

      if (isActive || isActiveUnknown) {
        activeAdvisories.push(advisoryToPush)
      } else {
        inactiveAdvisories.push(advisoryToPush)
      }
    })

    return [activeAdvisories, inactiveAdvisories]
  }, [selectedAdvisories])

  const renderAdvisoryDetail = useCallback(
    advisory => (
      <SelectedAdvisoryDetail
        key={advisory.id}
        advisory={advisory}
        handleSelectAdvisory={handleSelectAdvisory}
        isAdvisorySelected={advisory.id === selectedAdvisory}
      />
    ),
    [handleSelectAdvisory, selectedAdvisory]
  )

  const toggleInactiveLayers = () => {
    showInactiveAdvisories()
    applyFilterToLayers({ showInactiveAdvisories: true })
  }

  return (
    <div className={listWrapper} style={cssPosition}>
      <div className={headerList}>
        <h3 className={headerListTitle}>
          {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.selectedAdvisories)}
        </h3>

        <div className={closeButton} onClick={clearClickedAdvisories} id="selected-advisories-modal-button">
          <Close />
        </div>
      </div>

      {isFetchingSelectedAdvisories ? (
        <div className={`${section} ${loaderWrapper}`}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={section}>
            <div className={headerSection}>
              <div className={appliedValue}>
                <label className={sectionTitle}>
                  {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.active)}
                </label>
                {appliedAdvisoriesFilter.formattedValue && (
                  <div className={appliedFilterChip}>
                    <span>{appliedAdvisoriesFilter.formattedValue}</span>
                  </div>
                )}
              </div>
              <label>{activeAdvisories.length}</label>
            </div>

            <div className={`${activeAdvisoriesWrapper} ${selectedAdvisoryHasSmallSize ? advisoriesWrapperSmall : ''}`}>
              {activeAdvisories.map(renderAdvisoryDetail)}
            </div>
          </div>

          <div className={`${section} ${inactiveSection}`}>
            {shouldShowInactiveAdvisories ? (
              <>
                <div className={headerSection}>
                  <label className={sectionTitle}>
                    {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactive)}
                  </label>
                  <label>{inactiveAdvisories.length}</label>
                </div>

                <div className={inactiveAdvisoriesWrapper}>{inactiveAdvisories.map(renderAdvisoryDetail)}</div>
              </>
            ) : (
              <div className={inactiveAdvisoriesHidden}>
                <p className={inactiveParagraph}>
                  {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph1, {
                    inactiveAdvisoriesLength: inactiveAdvisories.length
                  })}
                </p>

                <p className={inactiveParagraph}>
                  {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph2)}
                </p>

                <p className={inactiveParagraph}>
                  <span>
                    {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph3)}
                  </span>
                  <span className={showInactiveLink} onClick={toggleInactiveLayers}>
                    {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph4)}
                  </span>
                  <span>
                    {airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph5)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

SelectedAdvisoriesList.propTypes = {
  selectedAdvisories: PropTypes.array.isRequired,
  clearClickedAdvisories: PropTypes.func.isRequired,
  isFetchingSelectedAdvisories: PropTypes.bool.isRequired,
  appliedAdvisoriesFilter: PropTypes.shape({
    formattedValue: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired
  }).isRequired,
  shouldShowInactiveAdvisories: PropTypes.bool.isRequired,
  showInactiveAdvisories: PropTypes.func.isRequired,
  handleSelectAdvisory: PropTypes.func.isRequired,
  selectedAdvisory: PropTypes.string.isRequired,
  applyFilterToLayers: PropTypes.func.isRequired,
  selectedAdvisorySettings: PropTypes.shape({
    cssPosition: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string
    })
  }).isRequired,
  selectedAdvisoryHasSmallSize: PropTypes.bool.isRequired
}
