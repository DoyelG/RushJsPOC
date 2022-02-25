import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { airmapIntl } from 'libs/airmap-intl';
import { AdvisoriesHeaderMessages } from './AdvisoriesHeader.messages';
import { useManageMenusToggling } from '../../hooks/useManageMenusToggling.hook';
import { advisoryColors, zoomLevels } from '../../constants/rules-plugin.constants';
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component';
import { advisoriesMenuContainer, advisoriesMenuWrapper, cardHeader, advisoriesHeaderWrapper, alertIcon, advisoriesHeaderText, advisoriesHeaderCount, arrowButton, arrowIcon, zoomInMessageWrapper, zoomInMessage, collapse, menuContent } from './AdvisoriesHeader.styles.scss';
import { AdvisoriesList } from '../AdvisoriesList/AdvisoriesList.component';
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component';
export const AdvisoriesHeader = ({ advisoriesData, advisoriesCounter, zoomLevel, handleSelectAdvisory, selectedAdvisory, clearSelectedAdvisory }) => {
    const iconColor = advisoriesData.color || advisoryColors.green;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { ADVISORIES_ZOOM_REQUIRED } = zoomLevels;
    const isZoomed = zoomLevel >= ADVISORIES_ZOOM_REQUIRED;
    const menuButtonId = 'advisories-menu-button';
    useManageMenusToggling(() => {
        setIsMenuOpen(false);
    }, menuButtonId);
    return (_jsxs("div", { className: advisoriesMenuContainer, children: [_jsxs("div", { className: advisoriesMenuWrapper, children: [isZoomed && (_jsx("div", { className: `${cardHeader} toggleable-menu`, onClick: () => setIsMenuOpen(!isMenuOpen), id: menuButtonId, children: _jsxs("span", { className: advisoriesHeaderWrapper, children: [_jsx(AdvisoryAlertIcon, { color: iconColor, className: alertIcon }, void 0), _jsxs("span", { className: advisoriesHeaderText, children: [airmapIntl.translateMessage(AdvisoriesHeaderMessages.advisories_header), _jsxs("span", { className: advisoriesHeaderCount, children: ["(", advisoriesCounter, ")"] }, void 0)] }, void 0), _jsx(IconButton, { className: arrowButton, id: "advisories-menu-icon", onClick: () => { }, icon: isMenuOpen ? (_jsx(KeyboardArrowDownIcon, { className: arrowIcon }, void 0)) : (_jsx(KeyboardArrowUpIcon, { className: arrowIcon }, void 0)) }, void 0)] }, void 0) }, void 0)), !isZoomed && (_jsx("div", { className: cardHeader, children: _jsx("span", { className: advisoriesHeaderWrapper, style: { color: advisoryColors.navy }, children: _jsxs("div", { className: zoomInMessageWrapper, children: [_jsx(AdvisoryAlertIcon, { className: alertIcon }, void 0), _jsx("span", { className: `${advisoriesHeaderText} ${zoomInMessage}`, children: airmapIntl.translateMessage(AdvisoriesHeaderMessages.zoom_in_message) }, void 0)] }, void 0) }, void 0) }, void 0))] }, void 0), isZoomed && (_jsx(Collapse, { in: isMenuOpen, className: collapse, timeout: "auto", unmountOnExit: true, children: _jsx("div", { className: menuContent, children: _jsx(AdvisoriesList, { selectedAdvisory: selectedAdvisory, advisoriesData: advisoriesData, handleSelectAdvisory: handleSelectAdvisory, clearSelectedAdvisory: clearSelectedAdvisory }, void 0) }, void 0) }, void 0))] }, void 0));
};
AdvisoriesHeader.propTypes = {
    advisoriesData: PropTypes.shape({
        color: PropTypes.string.isRequired,
        advisories: PropTypes.array.isRequired
    }),
    advisoriesCounter: PropTypes.number.isRequired,
    zoomLevel: PropTypes.number.isRequired,
    handleSelectAdvisory: PropTypes.func.isRequired,
    selectedAdvisory: PropTypes.string.isRequired,
    clearSelectedAdvisory: PropTypes.func.isRequired
};
