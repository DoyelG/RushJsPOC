import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { capitalizeEachWordAndRemoveSpacing } from 'modules/core/helpers/utilities.helpers';
import { advisoryColors, advisoriesColorTypes } from '../../constants/rules-plugin.constants';
import { airmapIntl } from 'libs/airmap-intl';
import styles, { listItemWrapper, advisoryListHeader, advisoryCount, rightToggle } from './AdvisoriesNestedList.styles.scss';
import { AdvisoryDetail } from '../AdvisoryDetail/AdvisoryDetail.component';
import { WebAppCoreMessages } from 'projects/web-app/modules/core/core.messages';
export const AdvisoriesNestedList = ({ clearAdvisory, handleSelectAdvisory, selectedAdvisory, color, category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const categoryLabel = airmapIntl.translateMessage(WebAppCoreMessages[`advisoryLabel_${category.type}`]);
    const isYellowColorType = color === advisoriesColorTypes.YELLOW;
    const handleToggleNestedList = () => {
        if (isOpen) {
            clearAdvisory();
        }
        setIsOpen(!isOpen);
    };
    const renderListItem = advisory => {
        const isActive = !advisory.schedule || advisory.schedule.some(timesheet => timesheet.active);
        const isActiveUnknown = !isActive && advisory.schedule && advisory.schedule.every(timesheet => typeof timesheet.active === 'undefined');
        const parsedAdvisory = {
            ...advisory,
            isActive,
            isActiveUnknown
        };
        return (_jsx(AdvisoryDetail, { advisory: parsedAdvisory, showAdvisoryType: false, handleSelectAdvisory: handleSelectAdvisory, isAdvisorySelected: advisory.id === selectedAdvisory }, advisory.id));
    };
    const filteredAdvisories = category.advisories.reduce((advisories, currentAdvisory) => {
        const repeatedAdvisory = advisories.find(({ name }) => name === currentAdvisory.name);
        if (repeatedAdvisory) {
            repeatedAdvisory.counter += 1;
        }
        else {
            currentAdvisory.counter = 1;
            advisories = [...advisories, currentAdvisory];
        }
        return advisories;
    }, []);
    return (_jsxs("li", { className: listItemWrapper, children: [_jsxs("div", { className: ` ${advisoryListHeader} ${color && styles[`${color}-background`] ? styles[`${color}-background`] : 'none'} `, id: category.type, onClick: handleToggleNestedList, style: { color: isYellowColorType ? advisoryColors.navy : advisoryColors.white }, children: [_jsxs("div", { children: [categoryLabel !== '' ? categoryLabel : capitalizeEachWordAndRemoveSpacing(category.type), _jsxs("span", { className: advisoryCount, children: ["(", filteredAdvisories.length, ")"] }, void 0)] }, void 0), _jsx("div", { className: rightToggle, style: { color: isYellowColorType ? advisoryColors.navy : advisoryColors.white }, onClick: handleToggleNestedList, children: isOpen ? _jsx(ArrowDownIcon, {}, void 0) : _jsx(ArrowRightIcon, {}, void 0) }, void 0)] }, category.type), _jsx(Collapse, { in: isOpen, timeout: "auto", unmountOnExit: true, children: filteredAdvisories.map(advisory => renderListItem(advisory)) }, void 0)] }, void 0));
};
AdvisoriesNestedList.propTypes = {
    clearAdvisory: PropTypes.func.isRequired,
    handleSelectAdvisory: PropTypes.any,
    selectedAdvisory: PropTypes.any,
    color: PropTypes.string,
    category: PropTypes.object.isRequired
};
