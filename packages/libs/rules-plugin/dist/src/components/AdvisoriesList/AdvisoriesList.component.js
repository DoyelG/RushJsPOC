import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { AdvisoriesNestedList } from '../AdvisoriesNestedList/AdvisoriesNestedList.component';
import { airmapIntl } from 'libs/airmap-intl';
import { advisoriesListWrapper, list, emptyAdvisoriesText } from './AdvisoriesList.styles.scss';
import { AdvisoriesListMessages } from './AdvisoriesList.messages';
import { parseAdvisoriesForList } from './AdvisoriesList.helpers';
export const AdvisoriesList = ({ advisoriesData, handleSelectAdvisory, selectedAdvisory, clearSelectedAdvisory }) => {
    const advisories = advisoriesData.advisories;
    const hasAdvisories = advisories && Boolean(advisories.length);
    const parsedAdvisories = hasAdvisories ? parseAdvisoriesForList(advisories) : [];
    return (_jsxs("div", { className: advisoriesListWrapper, id: "derivedHeightContainer", children: [hasAdvisories && (_jsx("ul", { className: list, children: parsedAdvisories.map(category => (_jsx(AdvisoriesNestedList, { category: category, clearAdvisory: clearSelectedAdvisory, color: category.color, handleSelectAdvisory: handleSelectAdvisory, selectedAdvisory: selectedAdvisory }, `${category.type}|${category.color}`))) }, void 0)), advisoriesData.advisories && Boolean(advisoriesData.advisories.length <= 0) && (_jsx("div", { className: emptyAdvisoriesText, children: airmapIntl.translateMessage(AdvisoriesListMessages.no_advisories_message) }, void 0))] }, void 0));
};
AdvisoriesList.propTypes = {
    advisoriesData: PropTypes.shape({
        color: PropTypes.string,
        advisories: PropTypes.array
    }),
    clearSelectedAdvisory: PropTypes.func.isRequired,
    handleSelectAdvisory: PropTypes.any,
    selectedAdvisory: PropTypes.any,
    classes: PropTypes.object
};
