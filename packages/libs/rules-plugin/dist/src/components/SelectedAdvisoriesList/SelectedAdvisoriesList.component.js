import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { airmapIntl } from 'libs/airmap-intl';
import { Loader } from 'modules/shared-components/Loader/Loader.component';
import { Close } from 'modules/icons/components/Close/Close.component';
import { SelectedAdvisoryDetail } from '../SelectedAdvisoryDetail/SelectedAdvisoryDetail.component';
import { listWrapper, headerList, headerListTitle, closeButton, section, loaderWrapper, headerSection, sectionTitle, appliedFilterChip, activeAdvisoriesWrapper, inactiveSection, inactiveAdvisoriesWrapper, inactiveAdvisoriesHidden, inactiveParagraph, showInactiveLink, appliedValue, advisoriesWrapperSmall } from './SelectedAdvisoriesList.styles.scss';
import { SelectedAdvisoriesListMessages } from './SelectedAdvisoriesList.messages';
export const SelectedAdvisoriesList = ({ selectedAdvisories, clearClickedAdvisories, isFetchingSelectedAdvisories, appliedAdvisoriesFilter, shouldShowInactiveAdvisories, showInactiveAdvisories, handleSelectAdvisory, selectedAdvisory, applyFilterToLayers, selectedAdvisorySettings: { cssPosition }, selectedAdvisoryHasSmallSize }) => {
    const [activeAdvisories, inactiveAdvisories] = useMemo(() => {
        const activeAdvisories = [];
        const inactiveAdvisories = [];
        selectedAdvisories.forEach(advisory => {
            const isActive = !advisory.schedule || advisory.schedule.some(timesheet => timesheet.active);
            const isActiveUnknown = !isActive && advisory.schedule && advisory.schedule.every(timesheet => typeof timesheet.active === 'undefined');
            const advisoryToPush = {
                ...advisory,
                isActive,
                isActiveUnknown
            };
            if (isActive || isActiveUnknown) {
                activeAdvisories.push(advisoryToPush);
            }
            else {
                inactiveAdvisories.push(advisoryToPush);
            }
        });
        return [activeAdvisories, inactiveAdvisories];
    }, [selectedAdvisories]);
    const renderAdvisoryDetail = useCallback(advisory => (_jsx(SelectedAdvisoryDetail, { advisory: advisory, handleSelectAdvisory: handleSelectAdvisory, isAdvisorySelected: advisory.id === selectedAdvisory }, advisory.id)), [handleSelectAdvisory, selectedAdvisory]);
    const toggleInactiveLayers = () => {
        showInactiveAdvisories();
        applyFilterToLayers({ showInactiveAdvisories: true });
    };
    return (_jsxs("div", { className: listWrapper, style: cssPosition, children: [_jsxs("div", { className: headerList, children: [_jsx("h3", { className: headerListTitle, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.selectedAdvisories) }, void 0), _jsx("div", { className: closeButton, onClick: clearClickedAdvisories, id: "selected-advisories-modal-button", children: _jsx(Close, {}, void 0) }, void 0)] }, void 0), isFetchingSelectedAdvisories ? (_jsx("div", { className: `${section} ${loaderWrapper}`, children: _jsx(Loader, {}, void 0) }, void 0)) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: section, children: [_jsxs("div", { className: headerSection, children: [_jsxs("div", { className: appliedValue, children: [_jsx("label", { className: sectionTitle, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.active) }, void 0), appliedAdvisoriesFilter.formattedValue && (_jsx("div", { className: appliedFilterChip, children: _jsx("span", { children: appliedAdvisoriesFilter.formattedValue }, void 0) }, void 0))] }, void 0), _jsx("label", { children: activeAdvisories.length }, void 0)] }, void 0), _jsx("div", { className: `${activeAdvisoriesWrapper} ${selectedAdvisoryHasSmallSize ? advisoriesWrapperSmall : ''}`, children: activeAdvisories.map(renderAdvisoryDetail) }, void 0)] }, void 0), _jsx("div", { className: `${section} ${inactiveSection}`, children: shouldShowInactiveAdvisories ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: headerSection, children: [_jsx("label", { className: sectionTitle, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactive) }, void 0), _jsx("label", { children: inactiveAdvisories.length }, void 0)] }, void 0), _jsx("div", { className: inactiveAdvisoriesWrapper, children: inactiveAdvisories.map(renderAdvisoryDetail) }, void 0)] }, void 0)) : (_jsxs("div", { className: inactiveAdvisoriesHidden, children: [_jsx("p", { className: inactiveParagraph, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph1, {
                                        inactiveAdvisoriesLength: inactiveAdvisories.length
                                    }) }, void 0), _jsx("p", { className: inactiveParagraph, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph2) }, void 0), _jsxs("p", { className: inactiveParagraph, children: [_jsx("span", { children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph3) }, void 0), _jsx("span", { className: showInactiveLink, onClick: toggleInactiveLayers, children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph4) }, void 0), _jsx("span", { children: airmapIntl.translateMessage(SelectedAdvisoriesListMessages.inactiveAdvisoriesParagraph5) }, void 0)] }, void 0)] }, void 0)) }, void 0)] }, void 0))] }, void 0));
};
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
};
