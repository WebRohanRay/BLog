// Dummy data for Spice & Simmer food blog
// This data simulates what would be stored in Firebase Firestore

export interface Recipe {
  id: string
  title: string
  slug: string
  category: string
  subcategory?: string
  author: { name: string; uid: string }
  ingredients: { item: string; amount: string; unit: string }[]
  steps: {
    stepNumber: number
    phase: 'prep' | 'cooking' | 'finishing'
    title: string
    description: string
    image?: string
    timer?: number
    tip?: string
  }[]
  tips: string[]
  mistakes: string[]
  variations: string[]
  faqs: { question: string; answer: string }[]
  seoTitle: string
  metaDescription: string
  keywords: string[]
  tags: string[]
  image: string
  readingTime: number
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sodium: number
  }
  difficulty: 'Easy' | 'Medium' | 'Hard'
  cuisine: string
  status: 'draft' | 'published'
  featured: boolean
  relatedRecipes: string[]
  relatedBlogs: string[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  viewCount: number
  ratingAvg: number
  ratingCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  seoIntro: string
  image: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: { name: string; uid: string }
  seoTitle: string
  metaDescription: string
  tags: string[]
  image: string
  readingTime: number
  status: 'draft' | 'published'
  relatedRecipes: string[]
  relatedBlogs: string[]
  createdAt: string
  publishedAt: string
}

export interface Subscriber {
  id: string
  email: string
  confirmed: boolean
  confirmToken: string
  createdAt: string
}

export interface Comment {
  id: string
  recipeId: string
  name: string
  email: string
  comment: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

// Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Main Dishes',
    slug: 'main-dishes',
    seoIntro: 'Discover bold, flavorful main dishes that blend the best of Indian spices with American comfort food classics. From spiced chicken to fusion curries, these hearty recipes are perfect for weeknight dinners or weekend gatherings.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Appetizers',
    slug: 'appetizers',
    seoIntro: 'Start your meal with these irresistible Indian-American fusion appetizers. From crispy samosa bites to spiced wings, these starters will impress your guests and tantalize your taste buds.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Desserts',
    slug: 'desserts',
    seoIntro: 'Indulge in sweet creations that marry traditional Indian sweets with American dessert favorites. From cardamom-spiced cookies to mango cheesecake, satisfy your sweet tooth with these fusion desserts.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Drinks',
    slug: 'drinks',
    seoIntro: 'Refresh yourself with vibrant drinks that combine Indian flavors with modern mixology. From masala chai lattes to mango lassi smoothies, these beverages are perfect for any occasion.',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Sides',
    slug: 'sides',
    seoIntro: 'Complete your meals with these flavorful side dishes. From spiced rice to fusion salads, these accompaniments add depth and variety to any main course.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Breakfast',
    slug: 'breakfast',
    seoIntro: 'Start your day with energizing breakfast recipes that bring Indian flavors to your morning routine. From spiced pancakes to masala eggs, these recipes make mornings delicious.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// Tags
export const tags: Tag[] = [
  { id: '1', name: 'Quick & Easy', slug: 'quick-easy' },
  { id: '2', name: 'Vegetarian', slug: 'vegetarian' },
  { id: '3', name: 'Spicy', slug: 'spicy' },
  { id: '4', name: 'Kid-Friendly', slug: 'kid-friendly' },
  { id: '5', name: 'Gluten-Free', slug: 'gluten-free' },
  { id: '6', name: 'One-Pot', slug: 'one-pot' },
  { id: '7', name: 'Meal Prep', slug: 'meal-prep' },
  { id: '8', name: 'Date Night', slug: 'date-night' },
]

// Recipes
export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Butter Chicken Tacos',
    slug: 'easy-butter-chicken-tacos-recipe',
    category: 'main-dishes',
    subcategory: 'tacos',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'boneless chicken thighs', amount: '1.5', unit: 'lbs' },
      { item: 'butter', amount: '4', unit: 'tbsp' },
      { item: 'heavy cream', amount: '1', unit: 'cup' },
      { item: 'tomato sauce', amount: '1', unit: 'cup' },
      { item: 'garam masala', amount: '2', unit: 'tsp' },
      { item: 'turmeric', amount: '1', unit: 'tsp' },
      { item: 'cumin', amount: '1', unit: 'tsp' },
      { item: 'garlic cloves', amount: '4', unit: 'minced' },
      { item: 'ginger', amount: '1', unit: 'inch' },
      { item: 'flour tortillas', amount: '8', unit: 'small' },
      { item: 'cilantro', amount: '1/4', unit: 'cup' },
      { item: 'red onion', amount: '1/2', unit: 'diced' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'prep',
        title: 'Marinate the Chicken',
        description: 'Cut chicken into bite-sized pieces. In a bowl, mix chicken with garam masala, turmeric, cumin, and a pinch of salt. Let marinate for at least 15 minutes.',
        timer: 900,
        tip: 'For best results, marinate overnight in the refrigerator.',
      },
      {
        stepNumber: 2,
        phase: 'cooking',
        title: 'Sear the Chicken',
        description: 'Heat 2 tbsp butter in a large skillet over medium-high heat. Add chicken pieces and cook until golden brown on all sides, about 5-6 minutes. Remove and set aside.',
        timer: 360,
      },
      {
        stepNumber: 3,
        phase: 'cooking',
        title: 'Make the Sauce',
        description: 'In the same pan, add remaining butter. Sauté garlic and ginger for 1 minute until fragrant. Add tomato sauce and simmer for 5 minutes.',
        timer: 360,
        tip: 'Don\'t burn the garlic - it should be golden, not brown.',
      },
      {
        stepNumber: 4,
        phase: 'cooking',
        title: 'Combine and Simmer',
        description: 'Add heavy cream to the sauce and stir well. Return the chicken to the pan and simmer for 10 minutes until the sauce thickens and chicken is cooked through.',
        timer: 600,
      },
      {
        stepNumber: 5,
        phase: 'finishing',
        title: 'Assemble Tacos',
        description: 'Warm tortillas in a dry pan. Spoon butter chicken onto each tortilla. Top with fresh cilantro and diced red onion. Serve immediately with lime wedges.',
        tip: 'Add a dollop of Greek yogurt for extra creaminess.',
      },
    ],
    tips: [
      'Use full-fat cream for the richest sauce',
      'Toast your tortillas for extra flavor',
      'Add a squeeze of lime before serving',
    ],
    mistakes: [
      'Overcrowding the pan when searing chicken',
      'Adding cream when sauce is too hot (it may curdle)',
      'Using dried spices that are too old',
    ],
    variations: [
      'Make it vegetarian with paneer or chickpeas',
      'Use naan bread instead of tortillas',
      'Add some heat with kashmiri chili powder',
    ],
    faqs: [
      {
        question: 'Can I make this ahead of time?',
        answer: 'Yes! The butter chicken filling can be made up to 3 days ahead. Store in the refrigerator and reheat gently before assembling tacos.',
      },
      {
        question: 'How do I make it less spicy?',
        answer: 'Reduce the garam masala by half and skip any additional chili powder. The dish will still be flavorful but milder.',
      },
      {
        question: 'Can I use chicken breast instead?',
        answer: 'Yes, but thighs stay more moist. If using breast, reduce cooking time and don\'t overcook.',
      },
    ],
    seoTitle: 'Best Butter Chicken Tacos Recipe (Easy & Quick)',
    metaDescription: 'Make delicious butter chicken tacos in just 30 minutes! This easy Indian-American fusion recipe combines creamy butter chicken with warm tortillas. Perfect for busy weeknights.',
    keywords: ['butter chicken tacos', 'indian tacos', 'fusion tacos', 'easy butter chicken', 'quick dinner recipe'],
    tags: ['quick-easy', 'spicy', 'date-night'],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=800&fit=crop',
    readingTime: 5,
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 4,
    nutrition: {
      calories: 485,
      protein: 32,
      carbs: 28,
      fat: 27,
      fiber: 2,
      sodium: 680,
    },
    difficulty: 'Easy',
    cuisine: 'Indian-American',
    status: 'published',
    featured: true,
    relatedRecipes: ['2', '3'],
    relatedBlogs: ['1'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T10:00:00Z',
    viewCount: 15420,
    ratingAvg: 4.8,
    ratingCount: 127,
  },
  {
    id: '2',
    title: 'Tikka Masala Mac and Cheese',
    slug: 'best-tikka-masala-mac-cheese-recipe',
    category: 'main-dishes',
    subcategory: 'pasta',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'elbow macaroni', amount: '1', unit: 'lb' },
      { item: 'butter', amount: '4', unit: 'tbsp' },
      { item: 'all-purpose flour', amount: '4', unit: 'tbsp' },
      { item: 'whole milk', amount: '3', unit: 'cups' },
      { item: 'sharp cheddar', amount: '2', unit: 'cups' },
      { item: 'tikka masala paste', amount: '3', unit: 'tbsp' },
      { item: 'heavy cream', amount: '1/2', unit: 'cup' },
      { item: 'garlic powder', amount: '1', unit: 'tsp' },
      { item: 'paprika', amount: '1', unit: 'tsp' },
      { item: 'fresh cilantro', amount: '1/4', unit: 'cup' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'prep',
        title: 'Cook the Pasta',
        description: 'Bring a large pot of salted water to a boil. Cook macaroni according to package directions until al dente. Drain and set aside.',
        timer: 480,
      },
      {
        stepNumber: 2,
        phase: 'cooking',
        title: 'Make the Roux',
        description: 'In a large saucepan, melt butter over medium heat. Whisk in flour and cook for 1-2 minutes until golden and fragrant.',
        timer: 120,
        tip: 'Stir constantly to prevent burning.',
      },
      {
        stepNumber: 3,
        phase: 'cooking',
        title: 'Add the Milk',
        description: 'Slowly pour in milk while whisking constantly. Continue whisking until the sauce thickens, about 5 minutes.',
        timer: 300,
      },
      {
        stepNumber: 4,
        phase: 'cooking',
        title: 'Add Cheese and Spices',
        description: 'Remove from heat. Stir in tikka masala paste, heavy cream, and cheddar cheese until melted and smooth. Season with garlic powder and paprika.',
        tip: 'Off-heat melting prevents the cheese from becoming grainy.',
      },
      {
        stepNumber: 5,
        phase: 'finishing',
        title: 'Combine and Serve',
        description: 'Fold in the cooked pasta until well coated. Transfer to serving bowls and garnish with fresh cilantro. Serve hot.',
      },
    ],
    tips: [
      'Use a good quality tikka masala paste for authentic flavor',
      'Freshly shred your own cheese for smoother melting',
      'Add a splash of pasta water if sauce gets too thick',
    ],
    mistakes: [
      'Adding cheese while the sauce is too hot',
      'Not whisking continuously when adding milk',
      'Overcooking the pasta (it continues cooking in sauce)',
    ],
    variations: [
      'Add cooked chicken for extra protein',
      'Top with panko breadcrumbs and broil until golden',
      'Use different pasta shapes like shells or cavatappi',
    ],
    faqs: [
      {
        question: 'Can I make this vegetarian?',
        answer: 'This recipe is already vegetarian! Just ensure your tikka masala paste doesn\'t contain any meat-based ingredients.',
      },
      {
        question: 'How do I reheat leftovers?',
        answer: 'Add a splash of milk when reheating to restore the creamy consistency. Microwave in 30-second intervals, stirring between each.',
      },
    ],
    seoTitle: 'Best Tikka Masala Mac and Cheese Recipe (Creamy & Spiced)',
    metaDescription: 'Creamy tikka masala mac and cheese combines classic comfort food with bold Indian spices. Ready in 30 minutes - the perfect fusion dinner for the whole family!',
    keywords: ['tikka masala mac and cheese', 'indian mac and cheese', 'fusion pasta', 'spiced mac and cheese'],
    tags: ['quick-easy', 'vegetarian', 'kid-friendly'],
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=1200&h=800&fit=crop',
    readingTime: 4,
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    servings: 6,
    nutrition: {
      calories: 520,
      protein: 18,
      carbs: 52,
      fat: 26,
      fiber: 2,
      sodium: 720,
    },
    difficulty: 'Easy',
    cuisine: 'Indian-American',
    status: 'published',
    featured: true,
    relatedRecipes: ['1', '3'],
    relatedBlogs: ['2'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    publishedAt: '2024-01-20T10:00:00Z',
    viewCount: 12350,
    ratingAvg: 4.9,
    ratingCount: 89,
  },
  {
    id: '3',
    title: 'Tandoori Grilled Chicken Wings',
    slug: 'quick-tandoori-grilled-chicken-wings-recipe',
    category: 'appetizers',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'chicken wings', amount: '2', unit: 'lbs' },
      { item: 'Greek yogurt', amount: '1', unit: 'cup' },
      { item: 'tandoori masala', amount: '3', unit: 'tbsp' },
      { item: 'lemon juice', amount: '2', unit: 'tbsp' },
      { item: 'garlic paste', amount: '1', unit: 'tbsp' },
      { item: 'ginger paste', amount: '1', unit: 'tbsp' },
      { item: 'kashmiri red chili', amount: '1', unit: 'tsp' },
      { item: 'salt', amount: '1', unit: 'tsp' },
      { item: 'vegetable oil', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'prep',
        title: 'Make the Marinade',
        description: 'In a large bowl, combine yogurt, tandoori masala, lemon juice, garlic paste, ginger paste, kashmiri chili, salt, and oil. Mix well until smooth.',
      },
      {
        stepNumber: 2,
        phase: 'prep',
        title: 'Marinate the Wings',
        description: 'Add chicken wings to the marinade and coat thoroughly. Cover and refrigerate for at least 2 hours, preferably overnight.',
        timer: 7200,
        tip: 'Score the wings lightly for better marinade penetration.',
      },
      {
        stepNumber: 3,
        phase: 'cooking',
        title: 'Preheat and Prepare',
        description: 'Preheat grill to medium-high heat (400°F). Remove wings from refrigerator 30 minutes before grilling. Line a baking sheet with foil.',
        timer: 1800,
      },
      {
        stepNumber: 4,
        phase: 'cooking',
        title: 'Grill the Wings',
        description: 'Grill wings for 6-8 minutes per side, until charred and cooked through. Internal temperature should reach 165°F.',
        timer: 960,
        tip: 'Don\'t move the wings too often - let them develop char marks.',
      },
      {
        stepNumber: 5,
        phase: 'finishing',
        title: 'Rest and Serve',
        description: 'Let wings rest for 5 minutes. Serve with mint chutney and lemon wedges. Garnish with fresh cilantro.',
      },
    ],
    tips: [
      'Use full-fat Greek yogurt for best results',
      'Don\'t skip the marinating time',
      'For oven method, bake at 425°F for 40-45 minutes',
    ],
    mistakes: [
      'Not marinating long enough',
      'Grilling over too high heat (burns outside, raw inside)',
      'Skipping the resting time',
    ],
    variations: [
      'Air fry at 400°F for 25 minutes',
      'Add honey for sweet and spicy version',
      'Use drumsticks instead of wings',
    ],
    faqs: [
      {
        question: 'Can I make these in the oven?',
        answer: 'Absolutely! Bake at 425°F for 40-45 minutes, flipping halfway through. Broil for the last 2-3 minutes for extra char.',
      },
      {
        question: 'How long can I marinate them?',
        answer: 'Up to 24 hours in the refrigerator. The yogurt tenderizes the chicken, but longer than 24 hours may make the texture too soft.',
      },
    ],
    seoTitle: 'Quick Tandoori Grilled Chicken Wings Recipe (Crispy & Spiced)',
    metaDescription: 'Crispy tandoori chicken wings with bold Indian spices! This easy grilled wings recipe features a creamy yogurt marinade for tender, flavorful results every time.',
    keywords: ['tandoori wings', 'grilled chicken wings', 'indian wings', 'spicy wings recipe'],
    tags: ['spicy', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1200&h=800&fit=crop',
    readingTime: 4,
    prepTime: 15,
    cookTime: 20,
    totalTime: 155,
    servings: 4,
    nutrition: {
      calories: 380,
      protein: 28,
      carbs: 4,
      fat: 28,
      fiber: 0,
      sodium: 620,
    },
    difficulty: 'Easy',
    cuisine: 'Indian-American',
    status: 'published',
    featured: true,
    relatedRecipes: ['1', '4'],
    relatedBlogs: ['1'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    publishedAt: '2024-02-01T10:00:00Z',
    viewCount: 9870,
    ratingAvg: 4.7,
    ratingCount: 64,
  },
  {
    id: '4',
    title: 'Mango Lassi Smoothie Bowl',
    slug: 'easy-mango-lassi-smoothie-bowl-recipe',
    category: 'breakfast',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'frozen mango chunks', amount: '2', unit: 'cups' },
      { item: 'Greek yogurt', amount: '1', unit: 'cup' },
      { item: 'milk', amount: '1/2', unit: 'cup' },
      { item: 'honey', amount: '2', unit: 'tbsp' },
      { item: 'cardamom powder', amount: '1/4', unit: 'tsp' },
      { item: 'granola', amount: '1/4', unit: 'cup' },
      { item: 'fresh berries', amount: '1/4', unit: 'cup' },
      { item: 'chia seeds', amount: '1', unit: 'tbsp' },
      { item: 'coconut flakes', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'prep',
        title: 'Blend the Base',
        description: 'Add frozen mango, yogurt, milk, honey, and cardamom to a high-speed blender. Blend until thick and smooth, about 1 minute.',
        tip: 'Use frozen fruit for a thicker consistency.',
      },
      {
        stepNumber: 2,
        phase: 'finishing',
        title: 'Pour and Top',
        description: 'Pour the thick smoothie into a bowl. Arrange toppings in rows: granola, fresh berries, chia seeds, and coconut flakes.',
      },
      {
        stepNumber: 3,
        phase: 'finishing',
        title: 'Serve Immediately',
        description: 'Serve right away while cold. Drizzle extra honey on top if desired.',
        tip: 'Eat quickly before the bowl melts!',
      },
    ],
    tips: [
      'Freeze your banana the night before for extra creaminess',
      'Use ripe mangoes for the best sweetness',
      'Add a scoop of protein powder for post-workout fuel',
    ],
    mistakes: [
      'Using too much liquid (makes it runny)',
      'Not using frozen fruit',
      'Waiting too long to eat after assembling',
    ],
    variations: [
      'Add spinach for a green smoothie bowl',
      'Use coconut yogurt for dairy-free version',
      'Top with sliced almonds and pistachios',
    ],
    faqs: [
      {
        question: 'Can I prep this the night before?',
        answer: 'You can prep the toppings, but blend the base fresh in the morning for best texture.',
      },
      {
        question: 'What can I use instead of cardamom?',
        answer: 'Cinnamon works as a substitute, or simply omit it for a plain mango lassi flavor.',
      },
    ],
    seoTitle: 'Easy Mango Lassi Smoothie Bowl Recipe (Healthy & Quick)',
    metaDescription: 'Start your day with this refreshing mango lassi smoothie bowl! A healthy Indian-inspired breakfast ready in 5 minutes with creamy yogurt and tropical mango.',
    keywords: ['mango lassi bowl', 'smoothie bowl recipe', 'indian breakfast', 'healthy mango recipe'],
    tags: ['quick-easy', 'vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=1200&h=800&fit=crop',
    readingTime: 3,
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 1,
    nutrition: {
      calories: 385,
      protein: 15,
      carbs: 62,
      fat: 10,
      fiber: 6,
      sodium: 85,
    },
    difficulty: 'Easy',
    cuisine: 'Indian-American',
    status: 'published',
    featured: false,
    relatedRecipes: ['5', '6'],
    relatedBlogs: ['3'],
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    publishedAt: '2024-02-10T10:00:00Z',
    viewCount: 7650,
    ratingAvg: 4.6,
    ratingCount: 45,
  },
  {
    id: '5',
    title: 'Masala Chai Brownies',
    slug: 'best-masala-chai-brownies-recipe',
    category: 'desserts',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'dark chocolate', amount: '8', unit: 'oz' },
      { item: 'unsalted butter', amount: '1/2', unit: 'cup' },
      { item: 'sugar', amount: '1', unit: 'cup' },
      { item: 'eggs', amount: '3', unit: 'large' },
      { item: 'vanilla extract', amount: '1', unit: 'tsp' },
      { item: 'all-purpose flour', amount: '1', unit: 'cup' },
      { item: 'chai spice blend', amount: '2', unit: 'tsp' },
      { item: 'salt', amount: '1/4', unit: 'tsp' },
      { item: 'brewed chai tea', amount: '1/4', unit: 'cup' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'prep',
        title: 'Preheat and Prepare',
        description: 'Preheat oven to 350°F. Line a 9x9 inch baking pan with parchment paper and grease lightly.',
      },
      {
        stepNumber: 2,
        phase: 'prep',
        title: 'Melt Chocolate',
        description: 'In a microwave-safe bowl, melt chocolate and butter together in 30-second intervals, stirring between each. Let cool slightly.',
        tip: 'Don\'t overheat - chocolate burns easily.',
      },
      {
        stepNumber: 3,
        phase: 'prep',
        title: 'Mix Wet Ingredients',
        description: 'Whisk sugar into the chocolate mixture. Add eggs one at a time, whisking well after each. Stir in vanilla and brewed chai tea.',
      },
      {
        stepNumber: 4,
        phase: 'prep',
        title: 'Combine Dry and Wet',
        description: 'In a separate bowl, whisk flour, chai spice blend, and salt. Fold dry ingredients into wet until just combined. Don\'t overmix.',
        tip: 'Overmixing creates tough brownies.',
      },
      {
        stepNumber: 5,
        phase: 'cooking',
        title: 'Bake',
        description: 'Pour batter into prepared pan and spread evenly. Bake for 25-30 minutes until a toothpick comes out with moist crumbs.',
        timer: 1800,
      },
      {
        stepNumber: 6,
        phase: 'finishing',
        title: 'Cool and Cut',
        description: 'Let cool completely in the pan before cutting. Dust with powdered sugar if desired.',
        tip: 'Refrigerate for 30 minutes for cleaner cuts.',
      },
    ],
    tips: [
      'Make your own chai spice with cinnamon, cardamom, ginger, and cloves',
      'Use high-quality dark chocolate (70% cacao)',
      'Room temperature eggs blend better',
    ],
    mistakes: [
      'Overbaking (brownies should be slightly underdone in center)',
      'Not letting them cool before cutting',
      'Using cold eggs',
    ],
    variations: [
      'Add walnuts or pecans for crunch',
      'Swirl in cream cheese for chai cheesecake brownies',
      'Top with a chai-spiced frosting',
    ],
    faqs: [
      {
        question: 'How long do these keep?',
        answer: 'Store in an airtight container at room temperature for up to 5 days, or freeze for up to 3 months.',
      },
      {
        question: 'Can I use chai tea bags?',
        answer: 'Yes! Steep 2 bags in 1/4 cup hot water for 5 minutes. Let cool before adding to batter.',
      },
    ],
    seoTitle: 'Best Masala Chai Brownies Recipe (Fudgy & Spiced)',
    metaDescription: 'Rich, fudgy brownies infused with warm chai spices! This unique fusion dessert combines dark chocolate with cardamom, cinnamon, and ginger.',
    keywords: ['chai brownies', 'masala chai dessert', 'spiced brownies', 'indian chocolate recipe'],
    tags: ['vegetarian', 'date-night'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&h=800&fit=crop',
    readingTime: 5,
    prepTime: 20,
    cookTime: 30,
    totalTime: 50,
    servings: 16,
    nutrition: {
      calories: 245,
      protein: 3,
      carbs: 28,
      fat: 14,
      fiber: 1,
      sodium: 45,
    },
    difficulty: 'Medium',
    cuisine: 'Indian-American',
    status: 'published',
    featured: true,
    relatedRecipes: ['4', '6'],
    relatedBlogs: ['2'],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    publishedAt: '2024-02-15T10:00:00Z',
    viewCount: 11230,
    ratingAvg: 4.9,
    ratingCount: 78,
  },
  {
    id: '6',
    title: 'Turmeric Golden Latte',
    slug: 'easy-turmeric-golden-latte-recipe',
    category: 'drinks',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    ingredients: [
      { item: 'milk of choice', amount: '1.5', unit: 'cups' },
      { item: 'ground turmeric', amount: '1', unit: 'tsp' },
      { item: 'ground cinnamon', amount: '1/2', unit: 'tsp' },
      { item: 'ground ginger', amount: '1/4', unit: 'tsp' },
      { item: 'black pepper', amount: '1', unit: 'pinch' },
      { item: 'honey or maple syrup', amount: '1', unit: 'tbsp' },
      { item: 'coconut oil', amount: '1', unit: 'tsp' },
    ],
    steps: [
      {
        stepNumber: 1,
        phase: 'cooking',
        title: 'Heat the Milk',
        description: 'Pour milk into a small saucepan. Heat over medium heat until warm but not boiling.',
        timer: 180,
      },
      {
        stepNumber: 2,
        phase: 'cooking',
        title: 'Add Spices',
        description: 'Whisk in turmeric, cinnamon, ginger, black pepper, and coconut oil. Continue heating and whisking for 3-4 minutes.',
        timer: 240,
        tip: 'Black pepper increases turmeric absorption by 2000%!',
      },
      {
        stepNumber: 3,
        phase: 'finishing',
        title: 'Sweeten and Serve',
        description: 'Remove from heat. Stir in honey or maple syrup. Pour into a mug and dust with extra cinnamon on top.',
      },
    ],
    tips: [
      'Use oat milk for the creamiest dairy-free version',
      'Add a shot of espresso for a turmeric latte',
      'Make a big batch and store in the fridge for 3 days',
    ],
    mistakes: [
      'Boiling the milk (scorches and changes flavor)',
      'Skipping the black pepper (reduces absorption)',
      'Not whisking enough (spices clump)',
    ],
    variations: [
      'Add vanilla extract for extra warmth',
      'Blend in a frozen banana for a smoothie version',
      'Use ashwagandha for extra wellness benefits',
    ],
    faqs: [
      {
        question: 'Is this safe to drink daily?',
        answer: 'Yes! Golden milk has been consumed in India for centuries. Turmeric has anti-inflammatory properties.',
      },
      {
        question: 'Why add black pepper?',
        answer: 'Piperine in black pepper increases curcumin (turmeric\'s active compound) absorption by up to 2000%.',
      },
    ],
    seoTitle: 'Easy Turmeric Golden Latte Recipe (Anti-Inflammatory)',
    metaDescription: 'Make a soothing turmeric golden latte at home in 5 minutes! This anti-inflammatory drink combines warming spices for a healthy, cozy beverage.',
    keywords: ['golden latte', 'turmeric milk', 'golden milk recipe', 'healthy drink recipe'],
    tags: ['quick-easy', 'vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=1200&h=800&fit=crop',
    readingTime: 3,
    prepTime: 2,
    cookTime: 5,
    totalTime: 7,
    servings: 1,
    nutrition: {
      calories: 185,
      protein: 6,
      carbs: 22,
      fat: 8,
      fiber: 1,
      sodium: 120,
    },
    difficulty: 'Easy',
    cuisine: 'Indian-American',
    status: 'published',
    featured: false,
    relatedRecipes: ['4', '5'],
    relatedBlogs: ['3'],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
    publishedAt: '2024-02-20T10:00:00Z',
    viewCount: 8920,
    ratingAvg: 4.5,
    ratingCount: 52,
  },
]

// Blogs
export const blogs: Blog[] = [
  {
    id: '1',
    title: 'The Art of Balancing Spices: A Beginner\'s Guide',
    slug: 'art-of-balancing-spices-beginners-guide',
    content: `<p>When I first started cooking Indian-American fusion dishes, I was terrified of spices. Too much? Too little? Would everything taste like a spice cabinet exploded? Sound familiar?</p>
    
<p>The truth is, balancing spices is less about exact measurements and more about understanding how flavors work together. In this guide, I'll share the techniques that transformed me from a spice-phobic cook into someone who confidently layers complex flavors.</p>

<h2>The Foundation: Understanding Spice Categories</h2>
<p>Think of spices in three categories: warming (cinnamon, cardamom), earthy (cumin, coriander), and heat (chili, black pepper). A well-balanced dish usually includes at least one from each category.</p>

<h2>Start Low, Build Slow</h2>
<p>My golden rule: you can always add more spices, but you can't take them away. Start with half of what you think you need, taste, and adjust.</p>

<h2>The Toast Test</h2>
<p>Toasting whole spices in a dry pan releases their essential oils and deepens flavor. When they become fragrant (about 1-2 minutes), they're ready.</p>`,
    excerpt: 'Learn the fundamentals of balancing Indian spices for perfectly flavored dishes every time. A beginner-friendly guide to understanding spice categories and layering techniques.',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    seoTitle: 'The Art of Balancing Spices: A Beginner\'s Guide',
    metaDescription: 'Master the art of balancing Indian spices with this beginner-friendly guide. Learn spice categories, toasting techniques, and flavor layering tips.',
    tags: ['cooking-tips', 'spices', 'beginners'],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=800&fit=crop',
    readingTime: 8,
    status: 'published',
    relatedRecipes: ['1', '2', '3'],
    relatedBlogs: ['2'],
    createdAt: '2024-01-10T10:00:00Z',
    publishedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: '10 Pantry Staples Every Indian-American Kitchen Needs',
    slug: '10-pantry-staples-indian-american-kitchen',
    content: `<p>Whether you're new to Indian cooking or looking to stock up, having the right pantry staples makes all the difference. Here are my top 10 must-haves.</p>

<h2>1. Garam Masala</h2>
<p>This warming spice blend is the backbone of countless dishes. Look for a blend with cardamom, cinnamon, cloves, and cumin.</p>

<h2>2. Basmati Rice</h2>
<p>Long-grain and aromatic, basmati rice is essential for biryanis, pilafs, and everyday meals.</p>

<h2>3. Ghee</h2>
<p>Clarified butter adds richness and has a high smoke point, perfect for sautéing spices.</p>

<h2>4. Cumin Seeds</h2>
<p>Whole cumin seeds, toasted in oil, create the flavor base for many dishes.</p>

<h2>5. Turmeric</h2>
<p>The golden spice adds color, earthy flavor, and health benefits.</p>`,
    excerpt: 'Stock your kitchen with these essential ingredients for perfect Indian-American fusion cooking. From garam masala to ghee, these staples will transform your dishes.',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    seoTitle: '10 Pantry Staples Every Indian-American Kitchen Needs',
    metaDescription: 'Essential pantry staples for Indian-American fusion cooking. Stock your kitchen with these 10 must-have ingredients for flavorful meals.',
    tags: ['pantry-essentials', 'shopping-guide', 'beginners'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    readingTime: 6,
    status: 'published',
    relatedRecipes: ['1', '5'],
    relatedBlogs: ['1', '3'],
    createdAt: '2024-01-25T10:00:00Z',
    publishedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '3',
    title: 'Meal Prep Sunday: Indian Fusion Edition',
    slug: 'meal-prep-sunday-indian-fusion-edition',
    content: `<p>Meal prepping doesn't have to mean boring chicken and broccoli. With a little planning, you can enjoy flavorful Indian-American fusion meals all week long.</p>

<h2>The Strategy</h2>
<p>I prep in layers: proteins, grains, sauces, and fresh components. This modular approach keeps things interesting.</p>

<h2>Sunday Prep List</h2>
<ul>
<li>Marinate tandoori chicken (for Monday + Tuesday)</li>
<li>Cook a big batch of basmati rice</li>
<li>Make butter chicken sauce (stores for 5 days)</li>
<li>Prep vegetables for stir-fry</li>
<li>Mix spice blends for the week</li>
</ul>

<h2>Storage Tips</h2>
<p>Sauces keep best in glass containers. Store proteins and grains separately to prevent sogginess.</p>`,
    excerpt: 'Master the art of meal prepping with these Indian fusion strategies. Prep once on Sunday and enjoy delicious, flavorful meals all week long.',
    author: { name: 'Priya Sharma', uid: 'admin1' },
    seoTitle: 'Meal Prep Sunday: Indian Fusion Edition',
    metaDescription: 'Learn to meal prep Indian fusion dishes efficiently. Sunday prep strategies for flavorful weekday meals that take minutes to assemble.',
    tags: ['meal-prep', 'time-saving', 'weeknight-cooking'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
    readingTime: 7,
    status: 'published',
    relatedRecipes: ['1', '3', '4'],
    relatedBlogs: ['2'],
    createdAt: '2024-02-05T10:00:00Z',
    publishedAt: '2024-02-05T10:00:00Z',
  },
]

// Comments
export const comments: Comment[] = [
  {
    id: '1',
    recipeId: '1',
    name: 'Sarah M.',
    email: 'sarah@example.com',
    comment: 'Made these for taco Tuesday and they were a HIT! The butter chicken sauce is perfect. Will definitely make again.',
    rating: 5,
    status: 'approved',
    createdAt: '2024-02-01T15:30:00Z',
  },
  {
    id: '2',
    recipeId: '1',
    name: 'Mike T.',
    email: 'mike@example.com',
    comment: 'Great fusion recipe! I added some extra garam masala and it was amazing. My kids loved it too.',
    rating: 5,
    status: 'approved',
    createdAt: '2024-02-05T10:15:00Z',
  },
  {
    id: '3',
    recipeId: '2',
    name: 'Jennifer K.',
    email: 'jen@example.com',
    comment: 'This is now my go-to mac and cheese recipe. The tikka masala paste adds such great depth of flavor!',
    rating: 5,
    status: 'approved',
    createdAt: '2024-02-10T18:45:00Z',
  },
  {
    id: '4',
    recipeId: '5',
    name: 'David L.',
    email: 'david@example.com',
    comment: 'The chai spices in these brownies are incredible. Rich, fudgy, and so unique. Made them for a dinner party.',
    rating: 5,
    status: 'approved',
    createdAt: '2024-02-20T12:00:00Z',
  },
]

// Subscribers
export const subscribers: Subscriber[] = [
  {
    id: '1',
    email: 'foodlover@example.com',
    confirmed: true,
    confirmToken: 'abc123',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'spicefan@example.com',
    confirmed: true,
    confirmToken: 'def456',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'homecook@example.com',
    confirmed: false,
    confirmToken: 'ghi789',
    createdAt: '2024-02-01T09:15:00Z',
  },
]

// Helper functions to simulate database queries
export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug && r.status === 'published')
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(r => r.id === id)
}

export function getRecipesByCategory(categorySlug: string): Recipe[] {
  return recipes.filter(r => r.category === categorySlug && r.status === 'published')
}

export function getFeaturedRecipes(): Recipe[] {
  return recipes.filter(r => r.featured && r.status === 'published')
}

export function getLatestRecipes(limit: number = 6): Recipe[] {
  return recipes
    .filter(r => r.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export function getRecipesByTag(tagSlug: string): Recipe[] {
  return recipes.filter(r => r.tags.includes(tagSlug) && r.status === 'published')
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find(b => b.slug === slug && b.status === 'published')
}

export function getLatestBlogs(limit: number = 3): Blog[] {
  return blogs
    .filter(b => b.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export function getCommentsByRecipeId(recipeId: string): Comment[] {
  return comments.filter(c => c.recipeId === recipeId && c.status === 'approved')
}

export function getRelatedRecipes(recipeIds: string[]): Recipe[] {
  return recipes.filter(r => recipeIds.includes(r.id) && r.status === 'published')
}

export function getRelatedBlogs(blogIds: string[]): Blog[] {
  return blogs.filter(b => blogIds.includes(b.id) && b.status === 'published')
}
