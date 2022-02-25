export function RulesetsList({ jurisdiction, handleSelectRuleset, selectedRulesets, handleViewRulesInfo }: {
    jurisdiction: any;
    handleSelectRuleset: any;
    selectedRulesets: any;
    handleViewRulesInfo: any;
}): (false | JSX.Element)[];
export namespace RulesetsList {
    namespace propTypes {
        const jurisdiction: any;
        const selectedRulesets: any;
        const handleSelectRuleset: any;
        const handleViewRulesInfo: any;
    }
}
