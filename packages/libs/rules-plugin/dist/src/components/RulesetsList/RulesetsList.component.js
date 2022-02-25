import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import { rulesetItem, rulesetItemActive, rulesetType, rulesetName, rulesetDescription, rulesetText, rulesetInfoButton } from './RulesetsList.styles.scss';
import { groupRulesets } from '../../helpers/rules-plugin.helpers';
import { rulesetSelectionTypes } from '../../constants/rules-plugin.constants';
import { RulesetsListMessages } from './RulesetsList.messages';
import { airmapIntl } from 'libs/airmap-intl';
import { converterService } from 'projects/SFO/modules/core/services/converter.service';
const { REQUIRED, PICK_ONE } = rulesetSelectionTypes;
export const RulesetsList = ({ jurisdiction, handleSelectRuleset, selectedRulesets, handleViewRulesInfo }) => {
    const rulesets = jurisdiction.rulesets;
    const jurisdictionUUID = jurisdiction.uuid;
    const groupedRulesets = groupRulesets(rulesets);
    return Object.keys(groupedRulesets).map(rulesetsKey => {
        const rulesetsGroup = groupedRulesets[rulesetsKey];
        return (Boolean(rulesetsGroup.length) && (_jsxs("div", { children: [_jsx("h2", { className: rulesetType, children: airmapIntl.translateMessage(RulesetsListMessages[rulesetsKey]) }, void 0), rulesetsGroup.map(ruleset => {
                    const rulesetType = ruleset.selection_type;
                    const isRulesetSelected = selectedRulesets[rulesetType] &&
                        selectedRulesets[rulesetType][ruleset.id] &&
                        selectedRulesets[rulesetType][ruleset.id].visibility === 'visible';
                    const isHighlightedRulesets = selectedRulesets.highlighted &&
                        selectedRulesets.highlighted[ruleset.id] &&
                        selectedRulesets.highlighted[ruleset.id].visibility === 'visible';
                    const isRequired = rulesetType === REQUIRED;
                    const isPickOne = rulesetType === PICK_ONE;
                    const isRulesetVisible = isRulesetSelected || isRequired || isHighlightedRulesets;
                    const htmlDescription = converterService.makeHtml(ruleset.short_description);
                    return (_jsxs("div", { className: `${rulesetItem} ${isRulesetVisible ? rulesetItemActive : ''}`, onClick: () => {
                            if (!isRequired && !(isPickOne && isRulesetSelected) && !isHighlightedRulesets) {
                                handleSelectRuleset(ruleset, jurisdictionUUID);
                            }
                        }, children: [_jsxs("div", { className: rulesetText, children: [_jsx("p", { className: rulesetName, children: ruleset.name }, void 0), _jsx("p", { className: rulesetDescription, children: converterService.makeText(htmlDescription) }, void 0)] }, void 0), _jsx("div", { onClick: event => handleViewRulesInfo(ruleset.id, event), className: rulesetInfoButton, children: _jsx(InfoIcon, {}, void 0) }, void 0)] }, ruleset.id));
                })] }, rulesetsKey)));
    });
};
RulesetsList.propTypes = {
    jurisdiction: PropTypes.object.isRequired,
    selectedRulesets: PropTypes.object.isRequired,
    handleSelectRuleset: PropTypes.func.isRequired,
    handleViewRulesInfo: PropTypes.func.isRequired
};
