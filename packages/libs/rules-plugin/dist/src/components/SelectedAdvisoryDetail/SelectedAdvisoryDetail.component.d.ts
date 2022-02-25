export function SelectedAdvisoryDetail({ advisory: { properties: { url, body, description, ...properties }, type, name, color, schedule, requirements, isActive, isActiveUnknown, ...advisoryData }, showAdvisoryType, handleSelectAdvisory, isAdvisorySelected }: {
    advisory: {
        [x: string]: any;
        properties: {
            [x: string]: any;
            url: any;
            body: any;
            description: any;
        };
        type: any;
        name: any;
        color: any;
        schedule: any;
        requirements: any;
        isActive: any;
        isActiveUnknown: any;
    };
    showAdvisoryType: any;
    handleSelectAdvisory: any;
    isAdvisorySelected: any;
}): JSX.Element;
export namespace SelectedAdvisoryDetail {
    namespace defaultProps {
        const children: string;
        const showAdvisoryType: boolean;
    }
    namespace propTypes {
        export const advisory: any;
        const children_1: any;
        export { children_1 as children };
        const showAdvisoryType_1: any;
        export { showAdvisoryType_1 as showAdvisoryType };
        export const handleSelectAdvisory: any;
        export const isAdvisorySelected: any;
    }
}
