import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { airmapIntl } from 'libs/airmap-intl';
import { RulesetsInfoPanelMessages } from './RulesetsInfoPanel.messages';
import { rulesInfoWrapper, rulesInfoHeaderWrapper, iconButton, rulesInfoListWrapper, rulesetName, rulesetDescription, noRulesetInfoText, rulesetInfoText, rulesetInfoContainer } from './RulesetsInfoPanel.styles.scss';
import { Loader } from 'modules/shared-components/Loader/Loader.component';
import { Close } from 'modules/icons/components/Close/Close.component';
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component';
import { converterService } from 'projects/SFO/modules/core/services/converter.service';
export const RulesetsInfoPanel = ({ handleHideRulesetInfo, isFetchingRulesetInformation, rulesetInformation }) => {
    return (_jsxs("div", { className: rulesInfoWrapper, children: [_jsx("div", { className: rulesInfoHeaderWrapper, children: _jsx(IconButton, { id: "close-ruleset-info", variant: "primary", onClick: handleHideRulesetInfo, className: iconButton, icon: _jsx(Close, {}, void 0) }, void 0) }, void 0), isFetchingRulesetInformation && _jsx(Loader, {}, void 0), !isFetchingRulesetInformation && (_jsxs("div", { className: rulesInfoListWrapper, children: [Boolean(rulesetInformation.length) &&
                        rulesetInformation.map(rulesetInfo => (_jsxs("div", { children: [rulesetInfo.name && (_jsxs("div", { className: rulesetInfoContainer, children: [_jsx("p", { className: rulesetName, children: rulesetInfo.name }, void 0), _jsx("p", { className: rulesetDescription, dangerouslySetInnerHTML: { __html: converterService.makeHtml(rulesetInfo.description) } }, void 0)] }, void 0)), rulesetInfo.rules.map((rule, index) => (_jsx("div", { id: `${rulesetInfo.id}-${index}-description`, className: rulesetInfoText, dangerouslySetInnerHTML: { __html: converterService.makeHtml(rule.description) } }, `${rulesetInfo.id}|${index}`)))] }, rulesetInfo.id))), rulesetInformation.length <= 0 && (_jsx("div", { className: noRulesetInfoText, children: airmapIntl.translateMessage(RulesetsInfoPanelMessages.missing_rules_message) }, void 0))] }, void 0))] }, void 0));
};
RulesetsInfoPanel.propTypes = {
    handleHideRulesetInfo: PropTypes.func.isRequired,
    isFetchingRulesetInformation: PropTypes.bool.isRequired,
    rulesetInformation: PropTypes.array.isRequired
};
