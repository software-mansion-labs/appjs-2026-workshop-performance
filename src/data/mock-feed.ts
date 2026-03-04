export interface FeedPost {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
}

const usernames = [
  'travel_adventures',
  'foodie_delights',
  'urban_explorer',
  'fitness_guru',
  'nature_photography',
  'coffee_lover',
  'pet_paradise',
  'art_studio',
  'beach_vibes',
  'bookworm_reads',
  'tech_geek',
  'fashion_forward',
  'music_maniac',
  'garden_goals',
  'skateboard_life',
  'yoga_daily',
  'street_food',
  'vintage_finds',
  'drone_shots',
  'surf_culture',
];

const captions = [
  'Exploring the beautiful mountains today! The view is absolutely breathtaking. #travel #adventure #nature #mountains #hiking #outdoors #wanderlust',
  'Homemade pasta with fresh tomato sauce. Recipe coming soon! #foodie #pasta #homecooking #italianfood #delicious',
  'City lights at night. There is something magical about the urban landscape after dark. #citylife #nightphotography #urban',
  'Morning workout complete! Remember: consistency is key to reaching your goals. #fitness #motivation #workout #gym',
  'Captured this stunning sunset yesterday. Nature never fails to amaze me. #sunset #photography #nature #beautiful',
  'Perfect latte art to start the day. #coffeeaddict #morningvibes #latteart #barista',
  'Someone is enjoying their weekend! #dogsofinstagram #puppylove #weekendvibes #cute',
  'New painting finished! This one took me about 3 weeks to complete. #art #painting #creative #artwork',
  'Paradise found. #beachlife #vacation #summervibes #tropical #ocean',
  'Cozy reading corner setup. Currently reading: The Midnight Library. #bookstagram #reading #cozy',
  'Just tried the new restaurant downtown - absolutely incredible! The ambiance was perfect and the food was out of this world. Highly recommend!',
  'Throwback to last summer adventures. Can not wait for warmer days again. #throwback #summer #memories',
  'Learning something new every day. Today it is watercolor techniques. #art #learning #watercolor #creative',
  'Best coffee shop in the city, hands down. The pour-over here is perfection. #coffee #coffeeshop #specialty',
  'Rainy day vibes. Sometimes the best thing to do is stay in and enjoy the sound of rain. #rainyDay #cozy #mood',
  'Fresh flowers from the farmers market this morning. Spring is finally here! #flowers #spring #farmersmarket',
  'This view from the rooftop was worth every step. 47 floors up! #rooftop #cityview #skyline #amazing',
  'Homegrown tomatoes are just different. Nothing beats garden-fresh produce! #gardening #organic #homegrown',
  'Golden hour at the beach. The light was absolutely perfect today. #goldenhour #beach #photography',
  'Weekend project: building a bookshelf from reclaimed wood. Turned out better than expected! #diy #woodworking',
];

const tagSets = [
  ['travel', 'adventure', 'nature', 'outdoors', 'wanderlust', 'explore', 'mountains', 'hiking'],
  ['food', 'cooking', 'recipe', 'homemade', 'delicious', 'yummy', 'foodporn', 'chef'],
  ['city', 'urban', 'architecture', 'night', 'lights', 'photography', 'street', 'downtown'],
  ['fitness', 'gym', 'workout', 'health', 'motivation', 'training', 'muscle', 'strong'],
  ['nature', 'sunset', 'landscape', 'beautiful', 'sky', 'earth', 'wilderness', 'scenic'],
  ['coffee', 'morning', 'cafe', 'latte', 'espresso', 'barista', 'coffeetime', 'brew'],
  ['pets', 'dogs', 'cats', 'animals', 'cute', 'love', 'furry', 'adorable'],
  ['art', 'painting', 'creative', 'artist', 'drawing', 'gallery', 'artwork', 'design'],
  ['beach', 'ocean', 'tropical', 'vacation', 'summer', 'waves', 'sand', 'paradise'],
  ['books', 'reading', 'literature', 'library', 'bookworm', 'novel', 'story', 'author'],
];

const timestamps = [
  '1 minute ago',
  '2 minutes ago',
  '5 minutes ago',
  '10 minutes ago',
  '15 minutes ago',
  '30 minutes ago',
  '1 hour ago',
  '2 hours ago',
  '3 hours ago',
  '4 hours ago',
  '6 hours ago',
  '8 hours ago',
  '10 hours ago',
  '12 hours ago',
  '14 hours ago',
  '16 hours ago',
  '1 day ago',
  '2 days ago',
  '3 days ago',
  '4 days ago',
];

function generateMockFeed(count: number): FeedPost[] {
  const posts: FeedPost[] = [];
  for (let i = 0; i < count; i++) {
    const userIndex = i % usernames.length;
    const captionIndex = i % captions.length;
    const tagIndex = i % tagSets.length;
    const timestampIndex = i % timestamps.length;

    posts.push({
      id: String(i + 1),
      user: {
        username: usernames[userIndex],
        avatar: `https://i.pravatar.cc/150?img=${(userIndex % 70) + 1}`,
      },
      image: `https://picsum.photos/seed/post${i + 1}/1080/1080`,
      caption: captions[captionIndex],
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 500),
      timestamp: timestamps[timestampIndex],
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8,
      tags: tagSets[tagIndex],
    });
  }
  return posts;
}

export const MOCK_FEED = generateMockFeed(500);
