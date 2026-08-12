import type { Category } from "./data";

type CategoryVideoRule = {
  keywords: string[];
  src: string;
};

const exactCategoryVideos: Record<string, string> = {
  "eat drink": "/category-videos/eat-drink.mp4",
  "eat and drink": "/category-videos/eat-drink.mp4",
  "restaurants dining": "/category-videos/restaurants-dining.mp4",
  "restaurants and dining": "/category-videos/restaurants-dining.mp4",
  basketball: "/category-videos/basketball.mp4",
  football: "/category-videos/football.mp4",
  gyms: "/category-videos/gyms.mp4",
  gym: "/category-videos/gyms.mp4",
  "sunset spots": "/category-videos/sunset-spots.mp4",
  nature: "/category-videos/nature-outdoors.mp4",
  outdoors: "/category-videos/nature-outdoors.mp4",
  stays: "/category-videos/stays-hotels.mp4",
  stay: "/category-videos/stays-hotels.mp4",
  hotels: "/category-videos/stays-hotels.mp4",
  hotel: "/category-videos/stays-hotels.mp4",
  "heritage culture": "/category-videos/heritage-culture.mp4",
  "heritage and culture": "/category-videos/heritage-culture.mp4",
  "shopping markets": "/category-videos/shopping-markets.mp4",
  "shopping and markets": "/category-videos/shopping-markets.mp4",
  wellness: "/category-videos/wellness-relaxation.mp4",
};

const categoryVideoRules: CategoryVideoRule[] = [
  {
    keywords: [
      "restaurant",
      "restaurants",
      "dining",
      "drink",
      "food",
      "eat",
      "meal",
      "kitchen",
      "fork",
      "utensil",
    ],
    src: "/category-videos/restaurants-dining.mp4",
  },
  {
    keywords: ["cafe", "coffee", "bakery", "dessert", "sweet"],
    src: "/category-videos/cafes-bakeries.mp4",
  },
  {
    keywords: ["nature", "outdoor", "hike", "trail", "mountain", "forest", "park", "camp", "sunset", "view", "scenic"],
    src: "/category-videos/nature-outdoors.mp4",
  },
  {
    keywords: ["heritage", "culture", "historic", "museum", "landmark", "monument", "castle", "village"],
    src: "/category-videos/heritage-culture.mp4",
  },
  {
    keywords: [
      "adventure",
      "sport",
      "sports",
      "football",
      "soccer",
      "basketball",
      "court",
      "field",
      "gym",
      "gyms",
      "fitness",
      "workout",
      "swim",
      "activity",
    ],
    src: "/category-videos/adventure-sports.mp4",
  },
  {
    keywords: ["hotel", "stay", "guest", "bnb", "resort", "lodge", "home", "house"],
    src: "/category-videos/stays-hotels.mp4",
  },
  {
    keywords: ["shop", "shopping", "market", "store", "souvenir", "retail"],
    src: "/category-videos/shopping-markets.mp4",
  },
  {
    keywords: ["wellness", "spa", "health", "beauty", "relax"],
    src: "/category-videos/wellness-relaxation.mp4",
  },
];

function normalizeCategoryText(value: string | null | undefined) {
  return (value ?? "")
    .replace(/[-_&/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getCategoryVideoSrc(category: Pick<Category, "name" | "slug" | "icon_name">) {
  const exactMatch = [category.slug, category.name, category.icon_name]
    .map(normalizeCategoryText)
    .find((key) => exactCategoryVideos[key]);

  if (exactMatch) {
    return exactCategoryVideos[exactMatch];
  }

  const searchableText = [category.slug, category.name, category.icon_name]
    .map(normalizeCategoryText)
    .filter(Boolean)
    .join(" ");

  return (
    categoryVideoRules.find((rule) =>
      rule.keywords.some((keyword) => searchableText.includes(keyword))
    )?.src ?? "/category-videos/chouf-default.mp4"
  );
}
