require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const MONGO_URI = process.env.MONGO_URI;

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, d = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(d));

const COUNT_PER_CATEGORY = 24;

const drinkImages = [
  'https://rosepng.com/wp-content/uploads/2024/08/s11728_cold_drink_isolated_on_white_background_5b4036d2-3048-4463-9b77-21d8e91313d0_2-photoroom.png',
  'https://i.pinimg.com/736x/d1/6b/7a/d16b7a2553252183b8f49aaa2336fca0.jpg',
  'https://www.vhv.rs/dpng/d/458-4589809_beverage-png-image-hd-transparent-png-cup-juice.png',
  'https://static.vecteezy.com/system/resources/thumbnails/045/933/094/small/summertime-treat-mango-juice-and-slices-for-your-creative-projects-free-png.png',
  'https://rosepng.com/wp-content/uploads/2025/01/real-fruit-juice-1.png',
  'https://thumbs.dreamstime.com/b/vibrant-image-showcasing-refreshing-concept-pineapple-juice-splash-juice-erupts-pineapple-base-creating-397125512.jpg',
];

const friesImages = [
  'https://png.pngtree.com/png-clipart/20250429/original/pngtree-hot-and-crispy-french-fries-in-red-box-png-image_20891964.png',
  'https://static.vecteezy.com/system/resources/thumbnails/036/290/866/small/ai-generated-french-fries-with-dipping-sauce-on-a-transparent-background-ai-png.png',
  'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-french-fried-chips-isolated-png-png-image_11572782.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjuBKAsJzrHg87vcTrmzF5EOXneW0hXT4rmg&s',
  'https://img.freepik.com/free-photo/french-fries_1339-1403.jpg?semt=ais_hybrid&w=740&q=80',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE6MAOg2Z5mSqD7-4XV14uCFl79IPNfD9Tlw&s',
];

const saladImages = [
  'https://png.pngtree.com/png-vector/20240712/ourmid/pngtree-food-bowl-vegetable-salad-png-image_13052209.png',
  'https://www.freeiconspng.com/uploads/salad-png-transparent-images-11.png',
  'https://www.freeiconspng.com/uploads/greek-salad-png-21.png',
];

const burgerImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJfil_12iDPKI6VUiqFqLBG8FpVdN_PzpAnA&s',
  'https://i.pinimg.com/736x/95/aa/34/95aa34722ae9ea7e8faa874e5d24ebab.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1dCqxnJjbe88fKwPDMimCCW-9_mjf3sz7Aw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5dSyH3TJaYa9al39vS435tKK50mLZ-by3Kg&s',
  'https://blog.swiggy.com/wp-content/uploads/2025/01/Image-1_-cheese-burger-1024x538.png',
  'https://blog.swiggy.com/wp-content/uploads/2025/01/Image-6_-smash-burger-1024x538.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKi6FGIo9UTXF-MDDJeX0Eblc-MBjghKaHbA&s',
  'https://freepngimg.com/download/burger_sandwich/12-hamburger-burger-png-image.png',
  'https://www.shutterstock.com/image-photo/bacon-burger-isolation-on-transparent-600nw-2628364027.jpg',
  'https://blog.swiggy.com/wp-content/uploads/2025/01/Image-2_-veggie-burger-1024x538.png',
];

const burgers = [
  { name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheese, lettuce, tomato, and house sauce.', price: 199 },
  { name: 'BBQ Bacon Burger', description: 'Grilled beef, BBQ sauce, crispy bacon, and cheddar cheese.', price: 249 },
  { name: 'Veggie Delight Burger', description: 'Crispy veggie patty with lettuce, tomato, and creamy mayo.', price: 179 },
  { name: 'Smash Double Patty', description: 'Double beef patties with caramelized onions and melted cheese.', price: 299 },
  { name: 'Cheese Overload Burger', description: 'A molten cheese explosion with a golden, toasted bun.', price: 229 },
  { name: 'Spicy Chicken Burger', description: 'Crispy chicken fillet with spicy sauce and pickles.', price: 219 },
  { name: 'Smoky Lamb Burger', description: 'Smoked lamb patty with chipotle mayo and caramelized onions.', price: 269 },
  { name: 'Crispy Paneer Burger', description: 'Golden fried paneer patty with mint mayo and lettuce.', price: 189 },
  { name: 'Bacon Lover’s Burger', description: 'Crispy bacon stacked on a juicy patty with smoky sauce.', price: 259 },
  { name: 'Garden Veg Burger', description: 'A wholesome green burger made with fresh veggies and herbs.', price: 169 },
];

const burgerFoods = burgers.map((b, i) => ({
  itemImage: burgerImages[i % burgerImages.length],
  name: b.name,
  description: b.description,
  price: b.price,
  avgPrepTime: randInt(12, 20),
  category: 'burger',
  stock: true,
  rating: randFloat(4.0, 5.0),
}));

function loopedItems({ category, images, count, namePrefix, priceMin, priceMax, prepMin, prepMax, desc = '' }) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      itemImage: images[i % images.length],
      name: `${namePrefix} ${String(i + 1).padStart(2, '0')}`,
      description: desc || `${namePrefix} with fresh ingredients.`,
      price: randInt(priceMin, priceMax),
      avgPrepTime: randInt(prepMin, prepMax),
      category,
      stock: true,
      rating: randFloat(4.0, 5.0),
    });
  }
  return arr;
}

const drinkFoods = loopedItems({
  category: 'drinks',
  images: drinkImages,
  count: COUNT_PER_CATEGORY,
  namePrefix: 'Chilled Drink',
  priceMin: 69,
  priceMax: 149,
  prepMin: 1,
  prepMax: 3,
  desc: 'Refreshing beverage served cold.',
});

const friesFoods = loopedItems({
  category: 'fries',
  images: friesImages,
  count: COUNT_PER_CATEGORY,
  namePrefix: 'Crispy Fries',
  priceMin: 79,
  priceMax: 199,
  prepMin: 7,
  prepMax: 12,
  desc: 'Golden fries with a crispy crunch.',
});

const saladFoods = loopedItems({
  category: 'salads',
  images: saladImages,
  count: COUNT_PER_CATEGORY,
  namePrefix: 'Fresh Salad',
  priceMin: 99,
  priceMax: 229,
  prepMin: 4,
  prepMax: 7,
  desc: 'Light and healthy salad bowl.',
});

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const ops = [
      { cat: 'burger', data: burgerFoods },
      { cat: 'drinks', data: drinkFoods },
      { cat: 'fries', data: friesFoods },
      { cat: 'salads', data: saladFoods },
    ];

    for (const { cat, data } of ops) {
      await Food.deleteMany({ category: cat });
      const inserted = await Food.insertMany(data);
      console.log(`🍽️  ${cat}: inserted ${inserted.length} items`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
