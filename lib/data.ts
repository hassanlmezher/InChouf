import { supabase } from './supabase'

export type Category = {
  category_id: string
  name: string
  slug: string
  icon_name: string
  parent_category_id: string | null
}

export type LocationWithCategory = {
  location_id: string
  name: string
  description: string
  address_or_area: string
  main_image_url: string
  is_featured: boolean
  category_id: string
  categories: {
    name: string
  }
}

export async function fetchMainCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_category_id', null)

  if (error) {
    console.error('Error fetching main categories:', error)
    return []
  }

  return data as Category[]
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
