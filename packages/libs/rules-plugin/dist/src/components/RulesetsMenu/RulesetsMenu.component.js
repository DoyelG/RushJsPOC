import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Collapse } from '@material-ui/core';
import { airmapIntl } from 'libs/airmap-intl';
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component';
import { RulesetsMenuMessages } from './RulesetsMenu.messages';
import { rulesetSelectionTypes, rulesetsStorageKey } from '../../constants/rules-plugin.constants';
import { Layer } from 'modules/icons/components/Layer/Layer.component';
import { rulesetsMenuWrapper, rulesIcon, rulesetsMenuHeader, jurisdictionsCardContent, jurisdictionWrapper, jurisdictionRulesets, jurisdictionTitle, collapse, collapseWrapper, isolatedIcon, isolatedMenu, jurisdictionWrapperSmall } from './RulesetsMenu.styles.scss';
import { RulesetsList } from '../RulesetsList/RulesetsList.component';
import { getDefaultSelectedRulesets } from '../../helpers/rules-plugin.helpers';
import { useManageMenusToggling } from '../../hooks/useManageMenusToggling.hook';
import { WarningInfoBox } from 'projects/web-app/components/WarningInfoBox/WarningInfoBox.component';
import { RulesetsInfoPanel } from '../RulesetsInfoPanel/RulesetsInfoPanel.component';
import { getCachedSelectedRulesets } from '../../helpers/rules-plugin.helpers';
import { Portal } from 'modules/shared-components/Portal/Portal.component';
import { useForceCloseRulesetsMenu } from '../../hooks/useForceCloseRulesetsMenu.hook';
const { PICK_ONE } = rulesetSelectionTypes;
export const RulesetsMenu = ({ jurisdictions, selectedRulesets, setSelectedRulesets, isMapPartiallyOverUnavailableJurisdiction, fetchRulesetInformation, rulesetInformation, isFetchingRulesetInformation, showRulesetsMenu, injectedSelectedRulesets, isolated, handleMapUpdates, injectedHighlightRulesets, rulesetsMenuPortalModeEnabled, rulesetsMenuPortalInlineStyles, useSmallStyles }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isViewingRulesetRulesInfo, setIsViewingRulesetRulesInfo] = useState(false);
    const menuButtonId = 'rulesets-menu-button';
    const [internalJurisdictionUUIDs, setInternalJurisdictionUUIDs] = useState([]);
    useManageMenusToggling(() => {
        setIsMenuOpen(false);
    }, menuButtonId);
    useForceCloseRulesetsMenu(() => {
        setIsMenuOpen(false);
    });
    useEffect(() => {
        const jurisdictionUUIDs = Object.keys(jurisdictions).map(key => jurisdictions[key].uuid);
        const areSameJurisdictions = jurisdictionUUIDs.every(uuid => internalJurisdictionUUIDs.includes(uuid));
        const highlightedRulesets = injectedHighlightRulesets.reduce((rulesetsBySource, ruleset) => {
            return {
                ...rulesetsBySource,
                [ruleset.id]: {
                    visibility: ruleset.visibility || 'visible',
                    jurisdictionUUID: ruleset.jurisdiction.uuid
                }
            };
        }, {});
        const hasBeenHighlightedRulesetsChanged = Object.keys(highlightedRulesets).join() !== Object.keys(selectedRulesets.highlighted).join();
        if (injectedSelectedRulesets) {
            setSelectedRulesets(injectedSelectedRulesets);
        }
        else if ((Object.keys(jurisdictions).length > 0 && !areSameJurisdictions) || hasBeenHighlightedRulesetsChanged) {
            const cachedSelectedRulesets = getCachedSelectedRulesets();
            const defaultSelectedRulesets = getDefaultSelectedRulesets(jurisdictions, selectedRulesets);
            setInternalJurisdictionUUIDs(jurisdictionUUIDs);
            const visibleSelectedRulesets = {
                pick1: {
                    ...defaultSelectedRulesets.pick1,
                    ...cachedSelectedRulesets.pick1
                },
                optional: {
                    ...defaultSelectedRulesets.optional,
                    ...cachedSelectedRulesets.optional
                },
                highlighted: highlightedRulesets
            };
            setSelectedRulesets(visibleSelectedRulesets);
        }
    }, [
        internalJurisdictionUUIDs,
        jurisdictions,
        setSelectedRulesets,
        selectedRulesets,
        injectedSelectedRulesets,
        injectedHighlightRulesets
    ]);
    const handleViewRulesInfo = (rulesetId, event) => {
        setIsViewingRulesetRulesInfo(true);
        fetchRulesetInformation(rulesetId);
        event.stopPropagation();
    };
    const handleSelectRuleset = ({ selection_type: rulesetType, id }, rulesetJurisdictionUUID) => {
        const { visibility } = selectedRulesets[rulesetType][id] || {};
        const rulesVisibility = visibility === 'visible' ? 'none' : 'visible';
        const isPickOne = rulesetType === PICK_ONE;
        if (isPickOne) {
            const jurisdictionPickOneRulesets = Object.keys(selectedRulesets[rulesetType]).filter(id => {
                return selectedRulesets[rulesetType][id].jurisdictionUUID === rulesetJurisdictionUUID;
            });
            jurisdictionPickOneRulesets.forEach(id => (selectedRulesets[rulesetType][id].visibility = 'none'));
        }
        if (selectedRulesets[rulesetType][id]) {
            selectedRulesets[rulesetType][id].visibility = rulesVisibility;
        }
        else {
            selectedRulesets[rulesetType][id] = {
                visibility: rulesVisibility,
                jurisdictionUUID: rulesetJurisdictionUUID
            };
        }
        sessionStorage.setItem(rulesetsStorageKey, JSON.stringify(selectedRulesets));
        setSelectedRulesets({ ...selectedRulesets });
        handleMapUpdates();
    };
    const collapsibleMenu = () => (_jsx(Collapse, { in: isMenuOpen, className: `${collapse} ${isolated ? isolatedMenu : ''}`, transition: "auto", unmountOnExit: true, style: rulesetsMenuPortalModeEnabled ? rulesetsMenuPortalInlineStyles : {}, children: _jsxs("div", { className: collapseWrapper, children: [_jsx("div", { className: rulesetsMenuHeader, children: airmapIntl.translateMessage(RulesetsMenuMessages.rules_header) }, void 0), _jsxs("div", { className: jurisdictionsCardContent, children: [isMapPartiallyOverUnavailableJurisdiction && _jsx(WarningInfoBox, {}, void 0), _jsx("div", { className: `${jurisdictionWrapper} ${useSmallStyles ? jurisdictionWrapperSmall : ''}`, children: isViewingRulesetRulesInfo ? (_jsx(RulesetsInfoPanel, { handleHideRulesetInfo: () => setIsViewingRulesetRulesInfo(false), isFetchingRulesetInformation: isFetchingRulesetInformation, rulesetInformation: rulesetInformation }, void 0)) : (Object.keys(jurisdictions).map(jurisdictionKey => {
                                const jurisdiction = jurisdictions[jurisdictionKey];
                                return (_jsxs("div", { className: jurisdictionRulesets, children: [_jsx("h3", { className: jurisdictionTitle, children: jurisdiction.name }, void 0), _jsx(RulesetsList, { handleViewRulesInfo: handleViewRulesInfo, handleSelectRuleset: handleSelectRuleset, jurisdiction: jurisdiction, selectedRulesets: selectedRulesets }, void 0)] }, jurisdictionKey));
                            })) }, void 0)] }, void 0)] }, void 0) }, void 0));
    return showRulesetsMenu && Object.keys(jurisdictions).length > 0 ? (_jsxs("div", { className: rulesetsMenuWrapper, children: [_jsx("div", { className: "toggleable-menu", id: menuButtonId, onClick: () => setIsMenuOpen(!isMenuOpen), children: _jsx(IconButton, { className: `${rulesIcon} ${isolated ? isolatedIcon : ''}`, onClick: () => { }, id: "rulesets-menu-icon", icon: _jsx(SvgIcon, { viewBox: '0 0 20 24', children: _jsx(Layer, { width: 21, height: 24, fillColor: '#848f98' }, void 0) }, void 0) }, void 0) }, void 0), rulesetsMenuPortalModeEnabled ? (_jsx(Portal, { id: "rulesets-plugin-collapsible-menu", children: collapsibleMenu() }, void 0)) : (collapsibleMenu())] }, void 0)) : null;
};
RulesetsMenu.defaultProps = {
    isolated: false,
    injectedSelectedRulesets: null,
    rulesetsMenuPortalModeEnabled: PropTypes.bool,
    rulesetsMenuPortalInlineStyles: PropTypes.object,
    useSmallStyles: false
};
RulesetsMenu.propTypes = {
    fetchRulesetInformation: PropTypes.func.isRequired,
    handleMapUpdates: PropTypes.func.isRequired,
    injectedSelectedRulesets: PropTypes.object,
    isFetchingRulesetInformation: PropTypes.bool.isRequired,
    isMapPartiallyOverUnavailableJurisdiction: PropTypes.bool.isRequired,
    isolated: PropTypes.bool,
    jurisdictions: PropTypes.object.isRequired,
    rulesetInformation: PropTypes.array.isRequired,
    selectedRulesets: PropTypes.object.isRequired,
    setSelectedRulesets: PropTypes.func.isRequired,
    showRulesetsMenu: PropTypes.bool.isRequired,
    injectedHighlightRulesets: PropTypes.array.isRequired,
    rulesetsMenuPortalModeEnabled: PropTypes.bool,
    rulesetsMenuPortalInlineStyles: PropTypes.object,
    useSmallStyles: PropTypes.bool
};
