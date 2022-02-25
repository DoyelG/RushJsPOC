export function RulesetsMenu({ jurisdictions, selectedRulesets, setSelectedRulesets, isMapPartiallyOverUnavailableJurisdiction, fetchRulesetInformation, rulesetInformation, isFetchingRulesetInformation, showRulesetsMenu, injectedSelectedRulesets, isolated, handleMapUpdates, injectedHighlightRulesets, rulesetsMenuPortalModeEnabled, rulesetsMenuPortalInlineStyles, useSmallStyles }: {
    jurisdictions: any;
    selectedRulesets: any;
    setSelectedRulesets: any;
    isMapPartiallyOverUnavailableJurisdiction: any;
    fetchRulesetInformation: any;
    rulesetInformation: any;
    isFetchingRulesetInformation: any;
    showRulesetsMenu: any;
    injectedSelectedRulesets: any;
    isolated: any;
    handleMapUpdates: any;
    injectedHighlightRulesets: any;
    rulesetsMenuPortalModeEnabled: any;
    rulesetsMenuPortalInlineStyles: any;
    useSmallStyles: any;
}): JSX.Element | null;
export namespace RulesetsMenu {
    namespace defaultProps {
        const isolated: boolean;
        const injectedSelectedRulesets: null;
        const rulesetsMenuPortalModeEnabled: any;
        const rulesetsMenuPortalInlineStyles: any;
        const useSmallStyles: boolean;
    }
    namespace propTypes {
        export const fetchRulesetInformation: any;
        export const handleMapUpdates: any;
        const injectedSelectedRulesets_1: any;
        export { injectedSelectedRulesets_1 as injectedSelectedRulesets };
        export const isFetchingRulesetInformation: any;
        export const isMapPartiallyOverUnavailableJurisdiction: any;
        const isolated_1: any;
        export { isolated_1 as isolated };
        export const jurisdictions: any;
        export const rulesetInformation: any;
        export const selectedRulesets: any;
        export const setSelectedRulesets: any;
        export const showRulesetsMenu: any;
        export const injectedHighlightRulesets: any;
        const rulesetsMenuPortalModeEnabled_1: any;
        export { rulesetsMenuPortalModeEnabled_1 as rulesetsMenuPortalModeEnabled };
        const rulesetsMenuPortalInlineStyles_1: any;
        export { rulesetsMenuPortalInlineStyles_1 as rulesetsMenuPortalInlineStyles };
        const useSmallStyles_1: any;
        export { useSmallStyles_1 as useSmallStyles };
    }
}
