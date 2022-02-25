import { colors } from './AdvisoriesList.constants'

export const parseAdvisoriesForList = advisories => {
  return advisories.reduce((newGroups, { color: defaultColor, categories }) => {
    let updatedCategories = []
    const groupTypes = newGroups.map(category => category.type)
    const repeatedGroup = categories.find(group => groupTypes.includes(group.type))

    if (repeatedGroup) {
      const updatedGroups = newGroups.map(group => {
        const color =
          colors.indexOf(repeatedGroup.color) > colors.indexOf(group.color) ? repeatedGroup.color : group.color

        return repeatedGroup.type === group.type
          ? {
              ...repeatedGroup,
              advisories: [...group.advisories, ...repeatedGroup.advisories],
              color: color || defaultColor
            }
          : group
      })
      const categoriesWithoutRepeatedGroup = categories.filter(category => repeatedGroup.type !== category.type)

      updatedCategories = [...updatedGroups, ...categoriesWithoutRepeatedGroup]
    } else {
      updatedCategories = [...newGroups, ...categories]
    }

    return updatedCategories.map(category => {
      category.advisories.sort((a, b) => {
        const extentFloorA = a.extents && a.extents.floor_m
        const extentFloorB = b.extents && b.extents.floor_m

        return extentFloorA - extentFloorB
      })

      return {
        ...category,
        color: category.color || defaultColor
      }
    })
  }, [])
}
