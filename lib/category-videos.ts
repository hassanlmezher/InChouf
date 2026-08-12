import type { Category } from "./data";

type CategoryVideoRule = {
  keywords: string[];
  src: string;
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

export function getCategoryVideoSrc(category: Pick<Category, "name" | "slug" | "icon_name">) {
  const searchableText = [category.slug, category.name, category.icon_name]
    .filter(Boolean)
    .join(" ")
    .replace(/[-_&/]+/g, " ")
    .toLowerCase();

  return (
    categoryVideoRules.find((rule) =>
      rule.keywords.some((keyword) => searchableText.includes(keyword))
    )?.src ?? "/category-videos/chouf-default.mp4"
  );
}
