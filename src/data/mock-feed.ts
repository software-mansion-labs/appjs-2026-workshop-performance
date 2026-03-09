export interface FeedComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  replies?: FeedComment[];
  replyingTo?: string;
}

export interface SuggestedPost {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
}

export interface FeedImage {
  uri: string;
  aspectRatio: number; // width / height
}

export interface FeedPost {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  images: FeedImage[];
  caption: string;
  likes: number;
  comments: FeedComment[];
  totalComments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  location: string;
  suggestedPosts: SuggestedPost[];
  showSuggestions: boolean;
}

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
  "tech_geek",
  "fashion_forward",
  "music_maniac",
  "garden_goals",
  "skateboard_life",
  "yoga_daily",
  "street_food",
  "vintage_finds",
  "drone_shots",
  "surf_culture"
];

const locations = [
  "New York, NY",
  "San Francisco, CA",
  "London, UK",
  "Tokyo, Japan",
  "Paris, France",
  "Barcelona, Spain",
  "Bali, Indonesia",
  "Sydney, Australia",
  "Dubai, UAE",
  "Rome, Italy",
  "Amsterdam, Netherlands",
  "Berlin, Germany",
  "Bangkok, Thailand",
  "Cape Town, South Africa",
  "Toronto, Canada",
  "Seoul, South Korea",
  "Lisbon, Portugal",
  "Prague, Czech Republic",
  "Vienna, Austria",
  "Copenhagen, Denmark"
];

const captions = [
  "Exploring the beautiful mountains today! The view is absolutely breathtaking. Such an incredible experience being up here above the clouds, feeling the crisp mountain air. #travel #adventure #nature #mountains #hiking #outdoors #wanderlust #explore",
  "Homemade pasta with fresh tomato sauce. Recipe coming soon! Spent the whole afternoon in the kitchen perfecting this dish. The secret ingredient is fresh basil from my garden. #foodie #pasta #homecooking #italianfood #delicious #recipe",
  "City lights at night. There is something magical about the urban landscape after dark. The way the buildings reflect off the river creates this surreal atmosphere. #citylife #nightphotography #urban #architecture",
  "Morning workout complete! Remember: consistency is key to reaching your goals. Started with a 5K run, then moved to strength training. Feeling stronger every day. #fitness #motivation #workout #gym #health",
  "Captured this stunning sunset yesterday. Nature never fails to amaze me with its incredible color palette. Waited two hours for this perfect moment. #sunset #photography #nature #beautiful #golden",
  "Perfect latte art to start the day. Found this incredible hidden gem of a coffee shop tucked away in a quiet alley downtown. #coffeeaddict #morningvibes #latteart #barista #coffeeshop",
  "Someone is enjoying their weekend! Nothing better than spending quality time with your furry best friend at the park. #dogsofinstagram #puppylove #weekendvibes #cute #pets",
  "New painting finished! This one took me about 3 weeks to complete. Inspired by the changing seasons and the way light filters through autumn leaves. #art #painting #creative #artwork #artist",
  "Paradise found. Crystal clear waters and white sand beaches. This is what dreams are made of. Grateful for every moment in this incredible place. #beachlife #vacation #summervibes #tropical #ocean",
  "Cozy reading corner setup. Currently reading: The Midnight Library. There is nothing quite like losing yourself in a good book on a rainy afternoon. #bookstagram #reading #cozy #books",
  "Just tried the new restaurant downtown - absolutely incredible! The ambiance was perfect and the food was out of this world. The chef came out personally to explain each course. Highly recommend!",
  "Throwback to last summer adventures. Can not wait for warmer days again. These memories keep me going through the winter months. #throwback #summer #memories #goodtimes",
  "Learning something new every day. Today it is watercolor techniques. The way the colors blend and flow on wet paper is mesmerizing. Art is truly the best therapy. #art #learning #watercolor",
  "Best coffee shop in the city, hands down. The pour-over here is perfection. They source their beans from a small farm in Colombia and roast them in-house. #coffee #specialty #pourover",
  "Rainy day vibes. Sometimes the best thing to do is stay in and enjoy the sound of rain hitting the window while wrapped in a warm blanket. #rainyDay #cozy #mood #peaceful",
  "Fresh flowers from the farmers market this morning. Spring is finally here and the colors are absolutely gorgeous! Got tulips, daisies, and sunflowers. #flowers #spring #farmersmarket",
  "This view from the rooftop was worth every step. 47 floors up and you can see the entire skyline stretching to the horizon. The city looks so different from up here. #rooftop #cityview #skyline",
  "Homegrown tomatoes are just different. Nothing beats garden-fresh produce picked at the peak of ripeness. Started this garden three years ago and it keeps getting better. #gardening #organic",
  "Golden hour at the beach. The light was absolutely perfect today, casting long shadows across the sand. These are the moments I live for. #goldenhour #beach #photography #magic",
  "Weekend project: building a bookshelf from reclaimed wood. Turned out better than expected! Spent 12 hours sanding, staining, and assembling. Now I need more books to fill it. #diy #woodworking"
];

const shortCaptions = ["🔥", "❤️", "No caption needed.", "📸", "Mood.", "✨", "Sunday.", "Vibes.", "👀", ""];

const commentTexts = [
  "This is absolutely stunning! Love it!",
  "Where is this? I need to visit!",
  "Great shot! What camera did you use?",
  "So jealous right now 😍",
  "This made my day, thanks for sharing!",
  "Incredible work, keep it up!",
  "The lighting in this is perfect",
  "Adding this to my bucket list ASAP",
  "You have such a great eye for composition",
  "This is goals right here",
  "Wow, just wow. Speechless!",
  "Can you share more details about this?",
  "Been following you for years, never disappointed",
  "This deserves way more likes",
  "Absolutely breathtaking view!",
  "How do you always find the best spots?",
  "Living vicariously through your posts",
  "The colors in this are unreal",
  "Need to try this next weekend",
  "This is what social media should be about"
];

const tagSets = [
  ["travel", "adventure", "nature", "outdoors", "wanderlust", "explore", "mountains", "hiking"],
  ["food", "cooking", "recipe", "homemade", "delicious", "yummy", "foodporn", "chef"],
  ["city", "urban", "architecture", "night", "lights", "photography", "street", "downtown"],
  ["fitness", "gym", "workout", "health", "motivation", "training", "muscle", "strong"],
  ["nature", "sunset", "landscape", "beautiful", "sky", "earth", "wilderness", "scenic"],
  ["coffee", "morning", "cafe", "latte", "espresso", "barista", "coffeetime", "brew"],
  ["pets", "dogs", "cats", "animals", "cute", "love", "furry", "adorable"],
  ["art", "painting", "creative", "artist", "drawing", "gallery", "artwork", "design"],
  ["beach", "ocean", "tropical", "vacation", "summer", "waves", "sand", "paradise"],
  ["books", "reading", "literature", "library", "bookworm", "novel", "story", "author"]
];

const timestamps = [
  "1 minute ago",
  "2 minutes ago",
  "5 minutes ago",
  "10 minutes ago",
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
  "1 day ago",
  "2 days ago",
  "3 days ago",
  "4 days ago",
  "5 days ago",
  "1 week ago"
];

function generateReplies(
  postIndex: number,
  commentIndex: number,
  count: number,
  parentUsername: string
): FeedComment[] {
  const replies: FeedComment[] = [];
  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 5 + commentIndex * 3 + i * 11) % usernames.length;
    replies.push({
      id: `reply-${postIndex}-${commentIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      text: commentTexts[(postIndex + commentIndex + i * 2) % commentTexts.length],
      likes: Math.floor(Math.random() * 50),
      timestamp: timestamps[(postIndex + commentIndex + i) % timestamps.length],
      replyingTo: parentUsername
    });
  }
  return replies;
}

function generateComments(postIndex: number, count: number): FeedComment[] {
  const comments: FeedComment[] = [];
  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 3 + i * 7) % usernames.length;
    const username = usernames[userIdx];
    // ~30% of comments have 1-3 replies
    const hasReplies = (postIndex + i) % 3 === 0 && count > 1;
    const replyCount = hasReplies ? 1 + ((postIndex + i) % 3) : 0;

    comments.push({
      id: `comment-${postIndex}-${i}`,
      username,
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      text: commentTexts[(postIndex + i * 3) % commentTexts.length],
      likes: Math.floor(Math.random() * 200),
      timestamp: timestamps[(postIndex + i) % timestamps.length],
      replies: hasReplies ? generateReplies(postIndex, i, replyCount, username) : []
    });
  }
  return comments;
}

function generateSuggestedPosts(postIndex: number): SuggestedPost[] {
  const suggestions: SuggestedPost[] = [];
  const count = 6 + (postIndex % 4); // 6-9 suggestions per post
  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 5 + i * 3) % usernames.length;
    suggestions.push({
      id: `suggested-${postIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      image: `https://picsum.photos/seed/suggested${postIndex}-${i}/1080/1080`,
      caption: captions[(postIndex + i * 2) % captions.length].slice(0, 60) + "..."
    });
  }
  return suggestions;
}

function generateMockFeed(count: number): FeedPost[] {
  const posts: FeedPost[] = [];
  for (let i = 0; i < count; i++) {
    const userIndex = i % usernames.length;
    const timestampIndex = i % timestamps.length;

    // Vary image count: ~30% single image, ~40% 2-3 images, ~30% 4-5 images
    const imageVariant = i % 10;
    const imageCount = imageVariant < 3 ? 1 : imageVariant < 7 ? 2 + (i % 2) : 4 + (i % 2);

    // Vary aspect ratios: square (1:1), portrait (4:5), landscape (16:9), wide (2:1)
    const aspectRatios = [1, 0.8, 16 / 9, 2, 4 / 5, 1.2, 3 / 4];
    const postAspectRatio = aspectRatios[i % aspectRatios.length];
    const imgWidth = 1080;
    const imgHeight = Math.round(imgWidth / postAspectRatio);

    const images: FeedImage[] = [];
    for (let j = 0; j < imageCount; j++) {
      images.push({
        uri: `https://picsum.photos/seed/post${i + 1}-img${j}/${imgWidth}/${imgHeight}`,
        aspectRatio: postAspectRatio
      });
    }

    // Vary caption: ~25% short/empty, ~75% long
    const useShortCaption = i % 4 === 0;
    const caption = useShortCaption ? shortCaptions[i % shortCaptions.length] : captions[i % captions.length];

    // Vary comments: ~20% no comments, ~40% 1-2 comments, ~25% 3 comments, ~15% 5-8 comments
    const commentVariant = i % 20;
    let commentCount: number;
    if (commentVariant < 4) {
      commentCount = 0;
    } else if (commentVariant < 12) {
      commentCount = 1 + (i % 2);
    } else if (commentVariant < 17) {
      commentCount = 3;
    } else {
      commentCount = 5 + (i % 4);
    }

    const totalComments = commentCount === 0 ? 0 : Math.floor(Math.random() * 500) + commentCount;

    // Vary tags: ~30% no tags, ~70% has tags
    const hasTags = i % 10 < 7;

    // Suggestions: ~20% of posts show suggestions
    const showSuggestions = i % 5 === 0;

    posts.push({
      id: String(i + 1),
      user: {
        username: usernames[userIndex],
        avatar: `https://i.pravatar.cc/150?img=${(userIndex % 70) + 1}`,
        isVerified: i % 3 === 0
      },
      images,
      caption,
      likes: Math.floor(Math.random() * 10000),
      comments: generateComments(i, commentCount),
      totalComments,
      timestamp: timestamps[timestampIndex],
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8,
      tags: hasTags ? tagSets[i % tagSets.length] : [],
      location: locations[i % locations.length],
      suggestedPosts: showSuggestions ? generateSuggestedPosts(i) : [],
      showSuggestions
    });
  }
  return posts;
}

export const MOCK_FEED = generateMockFeed(100);
