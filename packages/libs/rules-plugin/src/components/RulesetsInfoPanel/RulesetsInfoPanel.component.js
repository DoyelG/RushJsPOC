import React from 'react'
import PropTypes from 'prop-types'

import { airmapIntl } from 'libs/airmap-intl'
import { RulesetsInfoPanelMessages } from './RulesetsInfoPanel.messages'
import {
  rulesInfoWrapper,
  rulesInfoHeaderWrapper,
  iconButton,
  rulesInfoListWrapper,
  rulesetName,
  rulesetDescription,
  noRulesetInfoText,
  rulesetInfoText,
  rulesetInfoContainer
} from './RulesetsInfoPanel.styles.scss'
import { Loader } from 'modules/shared-components/Loader/Loader.component'
import { Close } from 'modules/icons/components/Close/Close.component'
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component'
import { converterService } from 'projects/SFO/modules/core/services/converter.service'

export const RulesetsInfoPanel = ({ handleHideRulesetInfo, isFetchingRulesetInformation, rulesetInformation }) => {
  return (
    <div className={rulesInfoWrapper}>
      <div className={rulesInfoHeaderWrapper}>
        <IconButton
          id="close-ruleset-info"
          variant="primary"
          onClick={handleHideRulesetInfo}
          className={iconButton}
          icon={<Close />}
        />
      </div>
      {isFetchingRulesetInformation && <Loader />}
      {!isFetchingRulesetInformation && (
        <div className={rulesInfoListWrapper}>
          {Boolean(rulesetInformation.length) &&
            rulesetInformation.map(rulesetInfo => (
              <div key={rulesetInfo.id}>
                {rulesetInfo.name && (
                  <div className={rulesetInfoContainer}>
                    <p className={rulesetName}>{rulesetInfo.name}</p>
                    <p
                      className={rulesetDescription}
                      dangerouslySetInnerHTML={{ __html: converterService.makeHtml(rulesetInfo.description) }}
                    ></p>
                  </div>
                )}
                {rulesetInfo.rules.map((rule, index) => (
                  <div
                    id={`${rulesetInfo.id}-${index}-description`}
                    key={`${rulesetInfo.id}|${index}`}
                    className={rulesetInfoText}
                    dangerouslySetInnerHTML={{ __html: converterService.makeHtml(rule.description) }}
                  ></div>
                ))}
              </div>
            ))}
          {rulesetInformation.length <= 0 && (
            <div className={noRulesetInfoText}>
              {airmapIntl.translateMessage(RulesetsInfoPanelMessages.missing_rules_message)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

RulesetsInfoPanel.propTypes = {
  handleHideRulesetInfo: PropTypes.func.isRequired,
  isFetchingRulesetInformation: PropTypes.bool.isRequired,
  rulesetInformation: PropTypes.array.isRequired
}
