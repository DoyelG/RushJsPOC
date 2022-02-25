import React from 'react'
import PropTypes from 'prop-types'
import InfoIcon from '@material-ui/icons/Info'
import {
  rulesetItem,
  rulesetItemActive,
  rulesetType,
  rulesetName,
  rulesetDescription,
  rulesetText,
  rulesetInfoButton
} from './RulesetsList.styles.scss'
import { groupRulesets } from '../../helpers/rules-plugin.helpers'
import { rulesetSelectionTypes } from '../../constants/rules-plugin.constants'
import { RulesetsListMessages } from './RulesetsList.messages'
import { airmapIntl } from 'libs/airmap-intl'
import { converterService } from 'projects/SFO/modules/core/services/converter.service'

const { REQUIRED, PICK_ONE } = rulesetSelectionTypes

export const RulesetsList = ({ jurisdiction, handleSelectRuleset, selectedRulesets, handleViewRulesInfo }) => {
  const rulesets = jurisdiction.rulesets
  const jurisdictionUUID = jurisdiction.uuid
  const groupedRulesets = groupRulesets(rulesets)

  return Object.keys(groupedRulesets).map(rulesetsKey => {
    const rulesetsGroup = groupedRulesets[rulesetsKey]
    return (
      Boolean(rulesetsGroup.length) && (
        <div key={rulesetsKey}>
          <h2 className={rulesetType}>{airmapIntl.translateMessage(RulesetsListMessages[rulesetsKey])}</h2>
          {rulesetsGroup.map(ruleset => {
            const rulesetType = ruleset.selection_type
            const isRulesetSelected =
              selectedRulesets[rulesetType] &&
              selectedRulesets[rulesetType][ruleset.id] &&
              selectedRulesets[rulesetType][ruleset.id].visibility === 'visible'

            const isHighlightedRulesets =
              selectedRulesets.highlighted &&
              selectedRulesets.highlighted[ruleset.id] &&
              selectedRulesets.highlighted[ruleset.id].visibility === 'visible'

            const isRequired = rulesetType === REQUIRED
            const isPickOne = rulesetType === PICK_ONE

            const isRulesetVisible = isRulesetSelected || isRequired || isHighlightedRulesets

            const htmlDescription = converterService.makeHtml(ruleset.short_description)

            return (
              <div
                key={ruleset.id}
                className={`${rulesetItem} ${isRulesetVisible ? rulesetItemActive : ''}`}
                onClick={() => {
                  if (!isRequired && !(isPickOne && isRulesetSelected) && !isHighlightedRulesets) {
                    handleSelectRuleset(ruleset, jurisdictionUUID)
                  }
                }}
              >
                <div className={rulesetText}>
                  <p className={rulesetName}>{ruleset.name}</p>
                  <p className={rulesetDescription}>{converterService.makeText(htmlDescription)}</p>
                </div>
                <div onClick={event => handleViewRulesInfo(ruleset.id, event)} className={rulesetInfoButton}>
                  <InfoIcon />
                </div>
              </div>
            )
          })}
        </div>
      )
    )
  })
}

RulesetsList.propTypes = {
  jurisdiction: PropTypes.object.isRequired,
  selectedRulesets: PropTypes.object.isRequired,
  handleSelectRuleset: PropTypes.func.isRequired,
  handleViewRulesInfo: PropTypes.func.isRequired
}
