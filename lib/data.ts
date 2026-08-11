import { supabase } from './supabase'

export type Category = {
  category_id: string
  name: string
  slug: string
  icon_name: string
  parent_category_id: string | null
  place_count: number
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

export const fallbackCategories: Category[] = [
  {
    category_id: 'fallback-eat-drink',
    name: 'Eat & Drink',
    slug: 'eat-drink',
    icon_name: 'Utensils',
    parent_category_id: null,
    place_count: 85,
  },
  {
    category_id: 'fallback-basketball',
    name: 'Basketball',
    slug: 'basketball',
    icon_name: 'CircleDot',
    parent_category_id: null,
    place_count: 12,
  },
  {
    category_id: 'fallback-football',
    name: 'Football',
    slug: 'football',
    icon_name: 'Goal',
    parent_category_id: null,
    place_count: 18,
  },
  {
    category_id: 'fallback-gyms',
    name: 'Gyms',
    slug: 'gyms',
    icon_name: 'Dumbbell',
    parent_category_id: null,
    place_count: 24,
  },
  {
    category_id: 'fallback-sunset-spots',
    name: 'Sunset Spots',
    slug: 'sunset-spots',
    icon_name: 'Sunset',
    parent_category_id: null,
    place_count: 15,
  },
  {
    category_id: 'fallback-nature',
    name: 'Nature',
    slug: 'nature',
    icon_name: 'Trees',
    parent_category_id: null,
    place_count: 32,
  },
  {
    category_id: 'fallback-stays',
    name: 'Stays',
    slug: 'stays',
    icon_name: 'House',
    parent_category_id: null,
    place_count: 27,
  },
]

export async function fetchMainCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return fallbackCategories
  }

  if (!categories?.length) {
    return fallbackCategories
  }

  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('category_id')

  if (locationsError) {
    console.error('Error fetching category counts:', locationsError)
  }

  const countsByCategory = new Map<string, number>()
  locations?.forEach((location) => {
    if (!location.category_id) {
      return
    }

    countsByCategory.set(
      location.category_id,
      (countsByCategory.get(location.category_id) ?? 0) + 1
    )
  })

  return categories.map((category) => ({
    ...category,
    place_count: countsByCategory.get(category.category_id) ?? 0,
  })) as Category[]
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await fetchMainCategories()
  return categories.find((category) => category.slug === slug) ?? null
}

export async function fetchLocationsByCategorySlug(slug: string): Promise<LocationWithCategory[]> {
  const category = await fetchCategoryBySlug(slug)

  if (!category || category.category_id.startsWith('fallback-')) {
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
