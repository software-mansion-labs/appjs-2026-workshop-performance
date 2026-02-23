export interface CommentPreview {
  username: string;
  avatar: string;
  text: string;
}

export interface LikedByUser {
  username: string;
  avatar: string;
}

export interface FeedPost {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  images: string[];
  imageAspectRatio: number;
  caption: string | null;
  location: string | null;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likedBy: LikedByUser[];
  topComments: CommentPreview[];
  isSponsored: boolean;
}

export interface SuggestedUser {
  username: string;
  avatar: string;
  isVerified: boolean;
  latestPost: string;
}

export type FeedItem =
  | { type: "post"; data: FeedPost }
  | { type: "suggestions"; data: SuggestedUser[] };

const usernames = [
  "travel_adventures",
  "foodie_delights",
  "urban_explorer",
  "fitness_guru",
  "nature_photography",
  "coffee_lover",
  "pet_paradise",
  "art_studio",
  "beach_vibes",
  "bookworm_reads",
  "music_mania",
  "tech_geek",
  "fashion_forward",
  "garden_bliss",
  "skate_life",
  "yoga_flow",
  "street_food",
  "vintage_vibes",
  "surf_culture",
  "mountain_high",
];

const captions = [
  "Exploring the beautiful mountains today! The view is absolutely breathtaking #travel #adventure #nature",
  "Homemade pasta with fresh tomato sauce. Recipe coming soon!",
  "City lights at night. There is something magical about the urban landscape after dark",
  "Morning workout complete! Remember: consistency is key to reaching your goals",
  "Captured this stunning sunset yesterday. Nature never fails to amaze me",
  "Perfect latte art to start the day #coffeeaddict #morningvibes",
  "Someone is enjoying their weekend #dogsofinstagram #puppylove",
  "New painting finished! This one took me about 3 weeks to complete",
  "Paradise found #beachlife #vacation #summervibes",
  "Cozy reading corner setup. Currently reading: The Midnight Library",
  "Live music at the local venue tonight. The energy was incredible!",
  "Just shipped a new feature! The team did an amazing job on this one",
  "New collection dropping next week. Stay tuned for the reveal!",
  "Spring blooms in full effect. My garden has never looked better",
  "Landing new tricks at the park today. Practice makes perfect!",
  "Morning flow by the ocean. Nothing beats starting the day with peace",
  "Found the best street tacos in town. Absolute game changer!",
  "Thrift store find of the century! This vintage jacket is everything",
  "Caught some amazing waves today. The ocean was on fire!",
  "Summit reached! 14,000 feet of pure determination and breathtaking views",
];

const timestamps = [
  "1 minute ago",
  "5 minutes ago",
  "15 minutes ago",
  "30 minutes ago",
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
  "4 hours ago",
  "6 hours ago",
  "8 hours ago",
  "10 hours ago",
  "12 hours ago",
  "14 hours ago",
  "16 hours ago",
  "18 hours ago",
  "20 hours ago",
  "1 day ago",
  "2 days ago",
  "3 days ago",
  "4 days ago",
];

const commentTexts = [
  "This is amazing!",
  "Love this so much",
  "Wow, incredible shot!",
  "Need to visit this place!",
  "Goals",
  "This made my day",
  "So beautiful!",
  "Can't stop looking at this",
  "Absolutely stunning",
  "This is everything",
];

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Tokyo, Japan",
  "Paris, France",
  "London, United Kingdom",
  "Bali, Indonesia",
  "Barcelona, Spain",
  "Sydney, Australia",
  "Santorini, Greece",
  "Reykjavik, Iceland",
];

export const MOCK_FEED: FeedPost[] = Array.from({ length: 200 }, (_, i) => {
  const imageCount = (i % 5) + 1;

  // Some posts have liked-by avatars, others just show count
  const showLikedBy = i % 3 !== 2;
  const likedBy = showLikedBy
    ? Array.from({ length: 3 }, (_, j) => {
        const idx = (i * 7 + j * 3 + 2) % usernames.length;
        return {
          username: usernames[idx],
          avatar: `https://i.pravatar.cc/450?img=${((idx * 2 + j) % 70) + 1}`,
        };
      })
    : [];

  // Some posts have comment previews, some don't
  const hasCommentPreviews = i % 4 !== 0;
  const commentCount = hasCommentPreviews ? (i % 3) + 1 : 0;
  const topComments = Array.from({ length: commentCount }, (_, j) => {
    const idx = (i * 5 + j * 4 + 1) % usernames.length;
    return {
      username: usernames[idx],
      avatar: `https://i.pravatar.cc/450?img=${((idx * 3 + j + 10) % 70) + 1}`,
      text: commentTexts[(i * 2 + j) % commentTexts.length],
    };
  });

  // Some posts have no caption (photo-only posts)
  const hasCaption = i % 7 !== 0;

  // Some posts have location, some don't
  const hasLocation = i % 3 === 0;

  // Occasional sponsored post
  const isSponsored = i % 11 === 0;

  // Vary aspect ratios: square, portrait (4:5), landscape (16:9)
  const aspectRatios = [1, 4 / 5, 16 / 9, 1, 4 / 5];
  const imageAspectRatio = aspectRatios[i % aspectRatios.length];
  const imgW = 1600;
  const imgH = Math.round(imgW / imageAspectRatio);

  return {
    id: String(i + 1),
    user: {
      username: usernames[i % usernames.length],
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      isVerified: i % 4 === 0,
    },
    images: Array.from(
      { length: imageCount },
      (_, j) => `https://picsum.photos/seed/post${i + 1}_${j}/${imgW}/${imgH}`,
    ),
    imageAspectRatio,
    caption: hasCaption ? captions[i % captions.length] : null,
    location: hasLocation ? locations[i % locations.length] : null,
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 400) + 5,
    timestamp: timestamps[i % timestamps.length],
    isLiked: i % 3 === 0,
    isBookmarked: i % 5 === 0,
    likedBy,
    topComments,
    isSponsored,
  };
});

function generateSuggestions(seed: number): SuggestedUser[] {
  return Array.from({ length: 15 }, (_, j) => {
    const idx = (seed * 7 + j * 3) % usernames.length;
    return {
      username: usernames[idx],
      avatar: `https://i.pravatar.cc/450?img=${((idx + j * 5 + seed) % 70) + 1}`,
      isVerified: (seed + j) % 3 === 0,
      latestPost: `https://picsum.photos/seed/suggest${seed}_${j}/400/400`,
    };
  });
}

// Interleave suggestion cards into the feed every 4-6 posts
export const FEED_DATA: FeedItem[] = (() => {
  const items: FeedItem[] = [];
  let suggestionIndex = 0;
  const interval = 5;

  for (let i = 0; i < MOCK_FEED.length; i++) {
    items.push({ type: "post", data: MOCK_FEED[i] });

    if ((i + 1) % interval === 0) {
      items.push({
        type: "suggestions",
        data: generateSuggestions(suggestionIndex++),
      });
    }
  }

  return items;
})();
