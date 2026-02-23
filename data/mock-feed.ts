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
}

const usernames = [
  'travel_adventures', 'foodie_delights', 'urban_explorer', 'fitness_guru',
  'nature_photography', 'coffee_lover', 'pet_paradise', 'art_studio',
  'beach_vibes', 'bookworm_reads', 'music_mania', 'tech_geek',
  'fashion_forward', 'garden_bliss', 'skate_life', 'yoga_flow',
  'street_food', 'vintage_vibes', 'surf_culture', 'mountain_high',
];

const captions = [
  'Exploring the beautiful mountains today! The view is absolutely breathtaking #travel #adventure #nature',
  'Homemade pasta with fresh tomato sauce. Recipe coming soon!',
  'City lights at night. There is something magical about the urban landscape after dark',
  'Morning workout complete! Remember: consistency is key to reaching your goals',
  'Captured this stunning sunset yesterday. Nature never fails to amaze me',
  'Perfect latte art to start the day #coffeeaddict #morningvibes',
  'Someone is enjoying their weekend #dogsofinstagram #puppylove',
  'New painting finished! This one took me about 3 weeks to complete',
  'Paradise found #beachlife #vacation #summervibes',
  'Cozy reading corner setup. Currently reading: The Midnight Library',
  'Live music at the local venue tonight. The energy was incredible!',
  'Just shipped a new feature! The team did an amazing job on this one',
  'New collection dropping next week. Stay tuned for the reveal!',
  'Spring blooms in full effect. My garden has never looked better',
  'Landing new tricks at the park today. Practice makes perfect!',
  'Morning flow by the ocean. Nothing beats starting the day with peace',
  'Found the best street tacos in town. Absolute game changer!',
  'Thrift store find of the century! This vintage jacket is everything',
  'Caught some amazing waves today. The ocean was on fire!',
  'Summit reached! 14,000 feet of pure determination and breathtaking views',
];

const timestamps = [
  '1 minute ago', '5 minutes ago', '15 minutes ago', '30 minutes ago',
  '1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago',
  '6 hours ago', '8 hours ago', '10 hours ago', '12 hours ago',
  '14 hours ago', '16 hours ago', '18 hours ago', '20 hours ago',
  '1 day ago', '2 days ago', '3 days ago', '4 days ago',
];

export const MOCK_FEED: FeedPost[] = Array.from({ length: 200 }, (_, i) => ({
  id: String(i + 1),
  user: {
    username: usernames[i % usernames.length],
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  },
  image: `https://picsum.photos/seed/post${i + 1}/400/400`,
  caption: captions[i % captions.length],
  likes: Math.floor(Math.random() * 5000) + 100,
  comments: Math.floor(Math.random() * 400) + 5,
  timestamp: timestamps[i % timestamps.length],
  isLiked: i % 3 === 0,
  isBookmarked: i % 5 === 0,
}));
