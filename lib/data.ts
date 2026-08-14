import { supabase } from './supabase'

export type Category = {
  category_id: number
  name: string
  slug: string
  icon_name: string | null
  parent_category_id: number | null
  place_count: number
}

type CategoryRow = Omit<Category, 'place_count'>

export type LocationWithCategory = {
  location_id: string
  name: string
  description: string
  address_or_area: string
  main_image_url: string
  is_featured: boolean
  category_id: number
  categories: {
    name: string
  }
}

export async function fetchMainCategories(): Promise<Category[]> {
  const { data: categoryRows, error } = await supabase
    .from('categories')
    .select('category_id, name, slug, icon_name, parent_category_id')
    .order('category_id', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  const categories = (categoryRows ?? []) as CategoryRow[]

  if (categories.length === 0) {
    return []
  }

  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('category_id')

  if (locationsError) {
    console.error('Error fetching category counts:', locationsError)
  }

  const countsByCategory = new Map<number, number>()
  locations?.forEach((location) => {
    if (typeof location.category_id !== 'number') {
      return
    }

    countsByCategory.set(
      location.category_id,
      (countsByCategory.get(location.category_id) ?? 0) + 1
    )
  })

  // Parent categories include the places assigned to their direct children.
  categories.forEach((category) => {
    if (category.parent_category_id === null) {
      return
    }

    const childCount = countsByCategory.get(category.category_id) ?? 0
    countsByCategory.set(
      category.parent_category_id,
      (countsByCategory.get(category.parent_category_id) ?? 0) + childCount
    )
  })

  return categories.map((category) => ({
    ...category,
    place_count: countsByCategory.get(category.category_id) ?? 0,
  }))
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await fetchMainCategories()
  return categories.find((category) => category.slug === slug) ?? null
}

export async function fetchLocationsByCategorySlug(slug: string): Promise<LocationWithCategory[]> {
  const category = await fetchCategoryBySlug(slug)

  if (!category) {
    return []
  }

  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('category_id', category.category_id)

  if (error) {
    console.error('Error fetching category locations:', error)
    return []
  }

  return data as LocationWithCategory[]
}

export async function fetchSearchableLocations(): Promise<LocationWithCategory[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      categories (
        name
      )
    `)
    .order('name', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Error fetching searchable locations:', error)
    return []
  }

  return data as LocationWithCategory[]
}

export async function fetchFeaturedPicks() {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('is_featured', true)
    .limit(4)

  if (error) {
    console.error('Error fetching featured picks:', error)
    return []
  }

  return data as LocationWithCategory[]
}
