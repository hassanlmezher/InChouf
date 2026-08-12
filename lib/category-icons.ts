const categoryIconAliases: Record<string, string> = {
  dribble: 'CircleDot',
  football: 'Goal',
  home: 'House',
  monument: 'Landmark',
  swimmer: 'Waves',
}

export function getCategoryIconName(iconName: string | null | undefined) {
  if (!iconName) {
    return 'HelpCircle'
  }

  const normalizedName = iconName.trim().toLowerCase()

  if (categoryIconAliases[normalizedName]) {
    return categoryIconAliases[normalizedName]
  }

  return normalizedName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
