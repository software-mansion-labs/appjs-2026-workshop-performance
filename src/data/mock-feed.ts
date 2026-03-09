// Complex nested interfaces for realistic data weight

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  totalViews: number;
  joinedDate: string;
  lastActive: string;
  verificationDate?: string;
}

export interface Reaction {
  type: "like" | "love" | "laugh" | "wow" | "sad" | "angry" | "celebrate" | "insightful";
  count: number;
  users: { username: string; avatar: string; timestamp: string }[];
}

export interface Share {
  id: string;
  username: string;
  avatar: string;
  sharedAt: string;
  platform: "feed" | "story" | "dm" | "external";
  message?: string;
}

export interface Mention {
  username: string;
  position: { start: number; end: number };
  userId: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
}

export interface LocationData {
  name: string;
  address?: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  placeId: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number; // bytes
  blurhash: string;
  dominantColor: string;
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
    takenAt?: string;
  };
  altText: string;
  faces?: { x: number; y: number; width: number; height: number }[];
  tags?: string[];
}

export interface FeedImage {
  uri: string;
  aspectRatio: number;
  thumbnailUri: string;
  metadata: ImageMetadata;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  favicon: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: { username: string; avatar: string }[];
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  isAnonymous: boolean;
  allowMultiple: boolean;
  userVote?: string;
}

export interface PostAnalytics {
  views: number;
  uniqueViews: number;
  reach: number;
  impressions: number;
  saves: number;
  shares: number;
  profileVisits: number;
  websiteClicks: number;
  emailClicks: number;
  followsFromPost: number;
  engagementRate: number;
  viewsByHour: { hour: number; count: number }[];
  viewsByCountry: { country: string; count: number }[];
  viewsByAge: { range: string; count: number }[];
  viewsByGender: { gender: string; count: number }[];
}

export interface FeedComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  replies?: FeedComment[];
  replyingTo?: string;
  mentions?: Mention[];
  reactions?: Reaction[];
  isEdited?: boolean;
  editedAt?: string;
  isPinned?: boolean;
  isCreatorReply?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  language?: string;
}

export interface SuggestedPost {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  relevanceScore: number;
  reason: string;
}

export interface RelatedPost {
  id: string;
  thumbnail: string;
  username: string;
  likes: number;
  similarity: number;
}

export interface FeedPost {
  id: string;
  user: {
    username: string;
    avatar: string;
    avatarHD: string;
    isVerified: boolean;
    badges: UserBadge[];
    stats: UserStats;
    bio: string;
    website?: string;
    isFollowing: boolean;
    isFollower: boolean;
    mutualFollowers: { username: string; avatar: string }[];
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
  location: LocationData;
  suggestedPosts: SuggestedPost[];
  showSuggestions: boolean;
  reactions: Reaction[];
  shares: Share[];
  mentions: Mention[];
  analytics: PostAnalytics;
  relatedPosts: RelatedPost[];
  linkPreview?: LinkPreview;
  poll?: Poll;
  isSponsored: boolean;
  sponsorInfo?: {
    advertiser: string;
    targetAudience: string[];
    budget: number;
    impressionsGoal: number;
  };
  isEdited: boolean;
  editHistory?: { editedAt: string; previousCaption: string }[];
  scheduledAt?: string;
  expiresAt?: string;
  visibility: "public" | "followers" | "close_friends" | "private";
  allowComments: boolean;
  allowShares: boolean;
  contentWarning?: string;
  language: string;
  translations?: { [lang: string]: string };
  audioTrack?: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    coverArt: string;
  };
}

const usernames = [
  "appjs_conf",
  "code_craftsman",
  "expo_explorer",
  "react_ninja",
  "dev_pioneer",
  "mobile_maestro",
  "async_adventurer",
  "stack_surfer",
  "pixel_pusher",
  "bug_buster",
  "type_wizard",
  "speaker_circle",
  "mobile_dev_pro",
  "rn_community",
  "krakow_tech",
  "workshop_lead",
  "animations_guru",
  "perf_optimizer",
  "native_builder",
  "attendee_dev",
  "js_junkie",
  "swift_sage",
  "kotlin_king",
  "flutter_fan",
  "web_warrior",
  "api_architect",
  "db_designer",
  "cloud_coder",
  "devops_dude",
  "security_sage",
  "ux_unicorn",
  "ui_master",
  "frontend_fury",
  "backend_boss",
  "fullstack_flex",
  "open_source_hero",
  "git_genius",
  "docker_dev",
  "k8s_captain",
  "aws_ace",
  "gcp_guru",
  "azure_admin",
  "node_ninja",
  "python_pro",
  "rust_ranger",
  "go_getter",
  "java_jester",
  "cpp_champion",
  "ruby_rebel",
  "scala_star",
  "elm_enthusiast",
  "clojure_coder",
  "haskell_hacker",
  "elixir_expert",
  "phoenix_phenom",
  "rails_rider",
  "django_dev",
  "flask_friend",
  "fastapi_fan",
  "graphql_god",
  "rest_rockstar",
  "grpc_guru",
  "websocket_wizard",
  "mqtt_master",
  "kafka_king",
  "redis_ranger",
  "mongo_maven",
  "postgres_pro",
  "mysql_mage",
  "sqlite_sage",
  "firebase_fan",
  "supabase_star",
  "prisma_pro",
  "drizzle_dev",
  "typeorm_titan",
  "jest_jockey",
  "vitest_victor",
  "cypress_champ",
  "playwright_pro",
  "selenium_sage",
  "webpack_wizard",
  "vite_victor",
  "esbuild_expert",
  "rollup_rider",
  "parcel_pro",
  "tailwind_titan",
  "styled_star",
  "emotion_expert",
  "chakra_champ",
  "mui_master",
  "framer_fan",
  "gsap_guru",
  "lottie_lover",
  "rive_rider",
  "spine_star",
  "three_titan",
  "babylon_boss",
  "pixi_pro",
  "phaser_phenom",
  "unity_unicorn",
  "unreal_uber",
  "godot_guru",
  "cocos_captain",
  "defold_dev",
  "love2d_lover",
  "electron_expert",
  "tauri_titan",
  "wails_wizard",
  "neutralino_ninja",
  "nw_master",
  "pwa_pro",
  "service_worker_sage",
  "workbox_wizard",
  "lighthouse_leader",
  "web_vitals_victor"
];

const fullNames = [
  "Alex Morgan",
  "Jordan Rivera",
  "Taylor Kim",
  "Morgan Chen",
  "Casey Brooks",
  "Riley Johnson",
  "Quinn Martinez",
  "Avery Thompson",
  "Drew Williams",
  "Blake Davis",
  "Skylar Anderson",
  "Parker Brown",
  "Reese Garcia",
  "Cameron Wilson",
  "Sage Miller",
  "Finley Jones",
  "Charlie Taylor",
  "Rowan Lee",
  "Phoenix White",
  "River Moore",
  "Emerson Clark",
  "Hayden Lewis",
  "Dakota Walker",
  "Kendall Hall",
  "Peyton Allen",
  "Jamie Young",
  "Jessie King",
  "Logan Wright",
  "Spencer Scott",
  "Oakley Green",
  "Aspen Adams",
  "Marley Baker",
  "Harley Nelson",
  "Frankie Hill",
  "Remy Campbell",
  "Lane Mitchell",
  "Ari Roberts",
  "Ellis Carter",
  "Indigo Perez",
  "Kai Turner",
  "Shay Phillips",
  "Eden Evans",
  "Winter Edwards",
  "August Collins",
  "Briar Stewart",
  "Sutton Morris",
  "Bellamy Rogers",
  "Baylor Reed",
  "Collins Cook",
  "Denver Bailey",
  "Lennon Cooper",
  "Presley Richardson",
  "Remington Cox",
  "Sloane Howard",
  "Tatum Ward",
  "Justice Torres",
  "Legacy Peterson",
  "Ocean Gray",
  "Palmer Ramirez",
  "Reign James",
  "Royal Watson",
  "Scout Brooks",
  "Story Bennett",
  "True Wood",
  "Valor Barnes",
  "Wren Ross",
  "Zion Henderson",
  "Arrow Coleman",
  "Blaze Jenkins",
  "Crew Perry",
  "Dream Powell",
  "Echo Long",
  "Falcon Patterson",
  "Grove Hughes",
  "Haven Flores"
];

const bios = [
  "Building the future with React Native 🚀",
  "Mobile dev | Open source contributor | Coffee enthusiast ☕",
  "Creating beautiful apps one component at a time",
  "Expo advocate | Performance obsessed | Speaker",
  "TypeScript purist | Animation lover | Bug hunter 🐛",
  "10+ years in mobile | Now all-in on React Native",
  "From native to cross-platform | No regrets ⚛️",
  "Workshop instructor | Conference speaker | Code reviewer",
  "Building apps for millions of users",
  "Startup founder turned developer advocate",
  "Making complex things simple since 2015",
  "App.js Conf regular attendee since 2019",
  "Documentation writer | Tutorial creator | Mentor",
  "Performance optimization specialist",
  "Accessibility advocate | Inclusive design champion"
];

const locations = [
  "Kraków, Poland",
  "Stara Zajezdnia, Kraków",
  "App.js Conf 2026",
  "Workshop Hall A",
  "Workshop Hall B",
  "Main Stage",
  "Networking Area",
  "Expo Booth",
  "Software Mansion HQ",
  "Conference Center",
  "Afterparty Venue",
  "Speaker Lounge",
  "Registration Desk",
  "Demo Area",
  "Community Hub",
  "Sponsor Pavilion",
  "Coffee Break Area",
  "Lunch Hall",
  "Outdoor Terrace",
  "VIP Lounge"
];

const captions = [
  "Excited to announce App.js Conf 2026 in Kraków! Join the biggest React Native & Expo-focused conference. 27-29 May, see you there! 🚀 #AppJSConf #ReactNative #Expo #MobileDev #Kraków",
  "Just finished setting up the workshop materials for the Expo Modules API session. Can't wait to share this with everyone tomorrow! The native code integration has never been easier. #AppJS2026 #ExpoModules #Workshop",
  "The Stara Zajezdnia venue looks absolutely stunning! Perfect atmosphere for three days of React Native talks and networking. Kraków never disappoints! #AppJSConf #Kraków #Conference",
  "Day 1 workshop: Animations and Interactions updated for 2026! Learned so much about Reanimated, Gesture Handler, and WebGPU integration. Mind = blown 🤯 #AppJS #Animations #Reanimated",
  "Performance workshop was incredible! Profiling tools, optimization techniques, and native-level debugging. My apps are about to get so much faster! #ReactNative #Performance #AppJS2026",
  "Great discussions at the networking event! Met developers from Meta, Microsoft, Shopify, and Amazon. The React Native community is amazing! ☕️ #AppJSConf #Networking #Community",
  "Universal apps with React Native - covering mobile and web platforms! Repository structure, routing, styling, animations, DOM components... this workshop had it all! #AppJS #UniversalApps",
  "The Expo team just demoed some incredible new features. The future of React Native development is looking bright! ✨ #Expo #AppJS2026 #Innovation",
  "Coffee break conversations hitting different at App.js. Just brainstormed a solution to a problem I've been stuck on for weeks! #DevLife #AppJSConf #Community",
  "The afterparty was legendary! Great music, amazing people, and unforgettable memories. Thanks @software_mansion for organizing! 🎉 #AppJS2026 #Afterparty",
  "Shipped a new feature using techniques learned at the workshop today. This is why conferences matter! Real knowledge, real impact. #ReactNative #AppJS #Learning",
  "Kraków is beautiful! Took a morning walk through the old town before the conference started. Perfect way to start Day 2! 🏰 #Kraków #Poland #AppJSConf",
  "Main stage talks are next level this year. Every speaker bringing their A-game with cutting-edge React Native insights! #AppJS2026 #Talks #ReactNative",
  "Workshop on writing native code with Expo Modules API was exactly what I needed. Finally understand the bridging between JS and native! 🌉 #ExpoModules #NativeCode",
  "98% of attendees would recommend App.js to a colleague - I can absolutely see why! This conference delivers every single year. 💯 #AppJSConf #Recommended",
  "The sponsor booths are showing some amazing tools! CodeRabbit, CodeMagic, Infinite Red... so many great products for React Native developers. #AppJS #Sponsors",
  "Just asked the Reanimated team a question I've had for months. Getting answers directly from the creators is priceless! 🙌 #AppJSConf #Reanimated #Community",
  "Three days of pure React Native immersion. My notes are overflowing and my mind is buzzing with new ideas! 📝 #AppJS2026 #Learning #ReactNative",
  "The venue acoustics are perfect for the talks. Great job by the organizers making sure everyone can hear clearly! 🎤 #AppJSConf #Production",
  "Met my open source hero today! The person who maintains a library I use daily. This is what makes conferences special. 🌟 #OpenSource #AppJS #Community"
];

const shortCaptions = ["🚀", "💜", "App.js 2026!", "✨", "Kraków vibes.", "⚛️", "Day 2!", "Networking.", "🎉", ""];

const commentTexts = [
  "Amazing talk! Learned so much! 🚀",
  "Can't wait for the workshop tomorrow!",
  "Great insights on React Native performance!",
  "This conference is incredible! 💜",
  "Thanks for sharing this, super helpful!",
  "Kraków is beautiful, loving the venue!",
  "The Expo team killed it today!",
  "Adding these techniques to my project ASAP",
  "Best conference I've been to this year!",
  "The community here is so welcoming!",
  "Mind blown by the animations workshop 🤯",
  "Can you share the slides from this talk?",
  "Been using React Native for years, still learning new things!",
  "The networking opportunities are amazing!",
  "Software Mansion really knows how to organize events!",
  "See you at the afterparty! 🎉",
  "This is exactly what I needed for my project",
  "The speakers this year are next level!",
  "Can't believe I finally met the Reanimated team!",
  "App.js never disappoints! See you next year!"
];

const tagSets = [
  ["AppJS", "AppJSConf", "AppJS2026", "ReactNative", "Expo", "Conference", "Kraków", "MobileDev"],
  ["ReactNative", "Expo", "JavaScript", "TypeScript", "MobileApp", "CrossPlatform", "Dev", "Code"],
  ["Workshop", "Learning", "Coding", "Animations", "Reanimated", "Performance", "Tutorial", "HandsOn"],
  ["Networking", "Community", "DevLife", "TechConf", "Speakers", "Talks", "Inspiration", "Connect"],
  ["Poland", "Kraków", "Europe", "TechHub", "Travel", "Conference", "Venue", "StaraZajezdnia"],
  ["Expo", "ExpoModules", "NativeCode", "iOS", "Android", "Build", "Deploy", "EAS"],
  ["Performance", "Optimization", "Profiling", "Speed", "Efficiency", "BestPractices", "Debug", "Tools"],
  ["Animations", "GestureHandler", "Reanimated", "UX", "UI", "Interactions", "WebGPU", "ThreeJS"],
  ["OpenSource", "GitHub", "Contribute", "Community", "Library", "Package", "npm", "Maintainers"],
  ["SoftwareMansion", "Organizers", "Sponsors", "Partners", "Meta", "Microsoft", "Shopify", "Amazon"]
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
  const sentiments: ("positive" | "neutral" | "negative")[] = ["positive", "neutral", "negative"];
  const languages = ["en", "pl", "de", "fr", "es", "pt", "it", "ja", "ko", "zh"];

  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 5 + commentIndex * 3 + i * 11) % usernames.length;
    const hasNestedReplies = count > 2 && i < 2 && (postIndex + commentIndex + i) % 4 === 0;

    replies.push({
      id: `reply-${postIndex}-${commentIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      text: commentTexts[(postIndex + commentIndex + i * 2) % commentTexts.length],
      likes: Math.floor(Math.random() * 50),
      timestamp: timestamps[(postIndex + commentIndex + i) % timestamps.length],
      replyingTo: parentUsername,
      mentions:
        i % 3 === 0
          ? [
              {
                username: parentUsername,
                position: { start: 0, end: parentUsername.length + 1 },
                userId: `user-${userIdx}`
              }
            ]
          : undefined,
      reactions: i % 5 === 0 ? generateCommentReactions(postIndex, commentIndex, i) : undefined,
      isEdited: i % 7 === 0,
      editedAt: i % 7 === 0 ? timestamps[(postIndex + i) % timestamps.length] : undefined,
      isPinned: false,
      isCreatorReply: i % 10 === 0,
      sentiment: sentiments[(postIndex + i) % 3],
      language: languages[userIdx % languages.length],
      replies: hasNestedReplies
        ? generateReplies(postIndex, commentIndex * 10 + i, 1 + (i % 2), usernames[userIdx])
        : []
    });
  }
  return replies;
}

function generateCommentReactions(postIndex: number, commentIndex: number, replyIndex: number): Reaction[] {
  const reactionTypes: ("like" | "love" | "laugh" | "wow" | "sad" | "angry" | "celebrate" | "insightful")[] = [
    "like",
    "love",
    "laugh",
    "wow",
    "sad",
    "angry",
    "celebrate",
    "insightful"
  ];
  const reactions: Reaction[] = [];
  const numReactions = 1 + ((postIndex + commentIndex + replyIndex) % 4);

  for (let r = 0; r < numReactions; r++) {
    const count = Math.floor(Math.random() * 20) + 1;
    const users: { username: string; avatar: string; timestamp: string }[] = [];
    for (let u = 0; u < Math.min(count, 5); u++) {
      const userIdx = (postIndex * 3 + commentIndex * 5 + replyIndex * 7 + r * 11 + u) % usernames.length;
      users.push({
        username: usernames[userIdx],
        avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
        timestamp: timestamps[(postIndex + u) % timestamps.length]
      });
    }
    reactions.push({
      type: reactionTypes[(postIndex + commentIndex + r) % reactionTypes.length],
      count,
      users
    });
  }
  return reactions;
}

function generateComments(postIndex: number, count: number): FeedComment[] {
  const comments: FeedComment[] = [];
  const sentiments: ("positive" | "neutral" | "negative")[] = ["positive", "neutral", "negative"];
  const languages = ["en", "pl", "de", "fr", "es", "pt", "it", "ja", "ko", "zh"];

  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 3 + i * 7) % usernames.length;
    const username = usernames[userIdx];
    // More comments have replies for viral posts
    const hasReplies = (postIndex + i) % 3 === 0 && count > 1;
    // Viral posts (every 50th) have many more replies
    const isViralComment = count > 50 && i < 10;
    const replyCount = isViralComment ? 5 + ((postIndex + i) % 10) : hasReplies ? 1 + ((postIndex + i) % 5) : 0;

    comments.push({
      id: `comment-${postIndex}-${i}`,
      username,
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      text: commentTexts[(postIndex + i * 3) % commentTexts.length],
      likes: Math.floor(Math.random() * 200),
      timestamp: timestamps[(postIndex + i) % timestamps.length],
      replies: replyCount > 0 ? generateReplies(postIndex, i, replyCount, username) : [],
      mentions:
        i % 4 === 0
          ? [
              {
                username: usernames[(userIdx + 1) % usernames.length],
                position: { start: 0, end: 10 },
                userId: `user-${(userIdx + 1) % usernames.length}`
              }
            ]
          : undefined,
      reactions: i % 3 === 0 ? generateCommentReactions(postIndex, i, 0) : undefined,
      isEdited: i % 8 === 0,
      editedAt: i % 8 === 0 ? timestamps[(postIndex + i + 1) % timestamps.length] : undefined,
      isPinned: i === 0 && postIndex % 10 === 0,
      isCreatorReply: false,
      sentiment: sentiments[(postIndex + i) % 3],
      language: languages[userIdx % languages.length]
    });
  }
  return comments;
}

function generateSuggestedPosts(postIndex: number): SuggestedPost[] {
  const suggestions: SuggestedPost[] = [];
  const count = 8 + (postIndex % 6); // 8-13 suggestions per post
  const reasons = [
    "Based on posts you liked",
    "Popular in React Native",
    "Followed by people you follow",
    "Similar to posts you saved",
    "Trending at App.js Conf",
    "New from accounts you might like"
  ];

  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 5 + i * 3) % usernames.length;
    const picsumId = (postIndex * 10 + i) % 1000;
    suggestions.push({
      id: `suggested-${postIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      image: `https://picsum.photos/id/${picsumId}/1080/1080`,
      caption: captions[(postIndex + i * 2) % captions.length].slice(0, 60) + "...",
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 200),
      relevanceScore: 0.5 + Math.random() * 0.5,
      reason: reasons[(postIndex + i) % reasons.length]
    });
  }
  return suggestions;
}

function generateBadges(userIndex: number): UserBadge[] {
  const badges: UserBadge[] = [];
  const badgeTypes = [
    { name: "Early Adopter", icon: "🎖️", rarity: "rare" as const, description: "Joined in the first year" },
    { name: "Speaker", icon: "🎤", rarity: "epic" as const, description: "Presented at App.js Conf" },
    { name: "Contributor", icon: "🛠️", rarity: "rare" as const, description: "Contributed to open source" },
    { name: "Top Commenter", icon: "💬", rarity: "common" as const, description: "Active in discussions" },
    { name: "Verified Pro", icon: "✓", rarity: "legendary" as const, description: "Verified professional" },
    { name: "Workshop Lead", icon: "📚", rarity: "epic" as const, description: "Led a workshop" },
    { name: "Bug Hunter", icon: "🐛", rarity: "rare" as const, description: "Found and reported bugs" },
    { name: "Community Hero", icon: "🦸", rarity: "legendary" as const, description: "Outstanding community member" }
  ];

  const numBadges = 1 + (userIndex % 4);
  for (let i = 0; i < numBadges; i++) {
    const badge = badgeTypes[(userIndex + i) % badgeTypes.length];
    badges.push({
      id: `badge-${userIndex}-${i}`,
      name: badge.name,
      icon: badge.icon,
      earnedAt: `${2020 + (userIndex % 6)}-${String((userIndex % 12) + 1).padStart(2, "0")}-${String((userIndex % 28) + 1).padStart(2, "0")}`,
      description: badge.description,
      rarity: badge.rarity
    });
  }
  return badges;
}

function generateUserStats(userIndex: number): UserStats {
  const baseFollowers = 100 + userIndex * 50;
  const multiplier = 1 + (userIndex % 10);
  return {
    posts: 10 + ((userIndex * 7) % 500),
    followers: baseFollowers * multiplier,
    following: 50 + ((userIndex * 3) % 1000),
    engagementRate: 0.01 + (userIndex % 100) / 1000,
    avgLikes: 50 + ((userIndex * 11) % 2000),
    avgComments: 5 + ((userIndex * 3) % 100),
    totalViews: baseFollowers * multiplier * 10,
    joinedDate: `${2018 + (userIndex % 8)}-${String((userIndex % 12) + 1).padStart(2, "0")}-01`,
    lastActive: timestamps[userIndex % timestamps.length],
    verificationDate: userIndex % 3 === 0 ? `${2022 + (userIndex % 4)}-01-15` : undefined
  };
}

function generateMutualFollowers(userIndex: number): { username: string; avatar: string }[] {
  const mutuals: { username: string; avatar: string }[] = [];
  const count = userIndex % 5;
  for (let i = 0; i < count; i++) {
    const idx = (userIndex * 3 + i * 7) % usernames.length;
    mutuals.push({
      username: usernames[idx],
      avatar: `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`
    });
  }
  return mutuals;
}

function generateReactions(postIndex: number): Reaction[] {
  const reactionTypes: ("like" | "love" | "laugh" | "wow" | "sad" | "angry" | "celebrate" | "insightful")[] = [
    "like",
    "love",
    "laugh",
    "wow",
    "celebrate",
    "insightful"
  ];
  const reactions: Reaction[] = [];
  const numReactions = 2 + (postIndex % 5);

  for (let r = 0; r < numReactions; r++) {
    const count = Math.floor(Math.random() * 500) + 10;
    const users: { username: string; avatar: string; timestamp: string }[] = [];
    for (let u = 0; u < Math.min(count, 10); u++) {
      const userIdx = (postIndex * 7 + r * 13 + u) % usernames.length;
      users.push({
        username: usernames[userIdx],
        avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
        timestamp: timestamps[(postIndex + u) % timestamps.length]
      });
    }
    reactions.push({
      type: reactionTypes[r % reactionTypes.length],
      count,
      users
    });
  }
  return reactions;
}

function generateShares(postIndex: number): Share[] {
  const shares: Share[] = [];
  const platforms: ("feed" | "story" | "dm" | "external")[] = ["feed", "story", "dm", "external"];
  const numShares = postIndex % 20;

  for (let i = 0; i < numShares; i++) {
    const userIdx = (postIndex * 11 + i * 3) % usernames.length;
    shares.push({
      id: `share-${postIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      sharedAt: timestamps[(postIndex + i) % timestamps.length],
      platform: platforms[i % platforms.length],
      message: i % 3 === 0 ? "Check this out!" : undefined
    });
  }
  return shares;
}

function generateLocationData(postIndex: number): LocationData {
  const locationsList = [
    {
      name: "Stara Zajezdnia",
      city: "Kraków",
      country: "Poland",
      lat: 50.0614,
      lng: 19.9366,
      category: "Conference Venue"
    },
    {
      name: "Software Mansion HQ",
      city: "Kraków",
      country: "Poland",
      lat: 50.0647,
      lng: 19.945,
      category: "Tech Office"
    },
    { name: "Main Market Square", city: "Kraków", country: "Poland", lat: 50.0619, lng: 19.9373, category: "Landmark" },
    {
      name: "Wawel Castle",
      city: "Kraków",
      country: "Poland",
      lat: 50.054,
      lng: 19.9352,
      category: "Tourist Attraction"
    },
    {
      name: "ICE Kraków",
      city: "Kraków",
      country: "Poland",
      lat: 50.0474,
      lng: 19.9267,
      category: "Convention Center"
    },
    {
      name: "Kazimierz District",
      city: "Kraków",
      country: "Poland",
      lat: 50.0512,
      lng: 19.9452,
      category: "Neighborhood"
    },
    {
      name: "Galeria Krakowska",
      city: "Kraków",
      country: "Poland",
      lat: 50.0662,
      lng: 19.9451,
      category: "Shopping Center"
    },
    { name: "Planty Park", city: "Kraków", country: "Poland", lat: 50.0612, lng: 19.9415, category: "Park" }
  ];

  const loc = locationsList[postIndex % locationsList.length];
  return {
    name: loc.name,
    address: `ul. ${["Świętego", "Jana", "Floriańska", "Grodzka", "Szewska"][postIndex % 5]} ${postIndex % 100}`,
    city: loc.city,
    country: loc.country,
    coordinates: {
      latitude: loc.lat + (Math.random() * 0.01 - 0.005),
      longitude: loc.lng + (Math.random() * 0.01 - 0.005),
      altitude: 200 + Math.random() * 50,
      accuracy: 5 + Math.random() * 10
    },
    placeId: `place-${postIndex}-${loc.name.toLowerCase().replace(/\s/g, "-")}`,
    category: loc.category,
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 1000) + 50
  };
}

function generateImageMetadata(width: number, height: number, postIndex: number, imageIndex: number): ImageMetadata {
  const formats = ["jpeg", "jpg", "webp", "avif"];
  const cameras = ["iPhone 15 Pro", "Sony A7 IV", "Canon EOS R5", "Pixel 8 Pro", "Samsung S24 Ultra"];
  const lenses = ["24-70mm f/2.8", "35mm f/1.4", "50mm f/1.8", "85mm f/1.2", "16-35mm f/4"];
  const colors = ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#533483", "#2c3e50", "#34495e", "#2980b9"];
  const blurhashes = [
    "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
    "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
    "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
    "LFFY^V%gI:oL.ToLxuae-pRkWVay"
  ];

  return {
    width,
    height,
    format: formats[(postIndex + imageIndex) % formats.length],
    size: 500000 + Math.floor(Math.random() * 4000000), // 0.5MB - 4.5MB
    blurhash: blurhashes[(postIndex + imageIndex) % blurhashes.length],
    dominantColor: colors[(postIndex + imageIndex) % colors.length],
    exif: {
      camera: cameras[(postIndex + imageIndex) % cameras.length],
      lens: lenses[(postIndex + imageIndex) % lenses.length],
      aperture: `f/${(1.4 + (postIndex % 10) * 0.4).toFixed(1)}`,
      shutterSpeed: `1/${60 + (postIndex % 500)}`,
      iso: 100 + (postIndex % 32) * 100,
      focalLength: `${24 + (imageIndex % 60)}mm`,
      takenAt: `2026-05-${String(27 + (postIndex % 3)).padStart(2, "0")}T${String(8 + (postIndex % 12)).padStart(2, "0")}:${String(postIndex % 60).padStart(2, "0")}:00Z`
    },
    altText: `Tech conference photo ${postIndex + 1}-${imageIndex + 1}: developers at App.js Conf 2026`,
    faces:
      postIndex % 3 === 0
        ? [{ x: 100 + (postIndex % 200), y: 100 + (imageIndex % 150), width: 50, height: 60 }]
        : undefined,
    tags: tagSets[postIndex % tagSets.length].slice(0, 3)
  };
}

function generateAnalytics(postIndex: number, likes: number): PostAnalytics {
  const views = likes * (5 + Math.random() * 10);
  return {
    views: Math.floor(views),
    uniqueViews: Math.floor(views * 0.7),
    reach: Math.floor(views * 0.8),
    impressions: Math.floor(views * 1.5),
    saves: Math.floor(likes * 0.1),
    shares: Math.floor(likes * 0.05),
    profileVisits: Math.floor(likes * 0.15),
    websiteClicks: Math.floor(likes * 0.02),
    emailClicks: Math.floor(likes * 0.01),
    followsFromPost: Math.floor(likes * 0.005),
    engagementRate: 0.02 + Math.random() * 0.08,
    viewsByHour: Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: Math.floor((views / 24) * (0.5 + Math.random()))
    })),
    viewsByCountry: [
      { country: "Poland", count: Math.floor(views * 0.3) },
      { country: "United States", count: Math.floor(views * 0.2) },
      { country: "Germany", count: Math.floor(views * 0.1) },
      { country: "United Kingdom", count: Math.floor(views * 0.08) },
      { country: "France", count: Math.floor(views * 0.05) },
      { country: "Netherlands", count: Math.floor(views * 0.04) },
      { country: "Spain", count: Math.floor(views * 0.03) },
      { country: "Brazil", count: Math.floor(views * 0.03) },
      { country: "Canada", count: Math.floor(views * 0.02) },
      { country: "Other", count: Math.floor(views * 0.15) }
    ],
    viewsByAge: [
      { range: "18-24", count: Math.floor(views * 0.25) },
      { range: "25-34", count: Math.floor(views * 0.45) },
      { range: "35-44", count: Math.floor(views * 0.2) },
      { range: "45-54", count: Math.floor(views * 0.07) },
      { range: "55+", count: Math.floor(views * 0.03) }
    ],
    viewsByGender: [
      { gender: "Male", count: Math.floor(views * 0.75) },
      { gender: "Female", count: Math.floor(views * 0.22) },
      { gender: "Other", count: Math.floor(views * 0.03) }
    ]
  };
}

function generateRelatedPosts(postIndex: number): RelatedPost[] {
  const related: RelatedPost[] = [];
  const count = 4 + (postIndex % 6);

  for (let i = 0; i < count; i++) {
    const relatedIdx = (postIndex * 7 + i * 13) % 1000;
    const userIdx = relatedIdx % usernames.length;
    related.push({
      id: `related-${postIndex}-${i}`,
      thumbnail: `https://picsum.photos/id/${relatedIdx}/400/400`,
      username: usernames[userIdx],
      likes: Math.floor(Math.random() * 5000),
      similarity: 0.6 + Math.random() * 0.4
    });
  }
  return related;
}

function generateMockFeed(count: number): FeedPost[] {
  const posts: FeedPost[] = [];
  const languages = ["en", "pl", "de", "fr", "es"];
  const visibilities: ("public" | "followers" | "close_friends" | "private")[] = [
    "public",
    "public",
    "public",
    "followers",
    "close_friends"
  ];

  for (let i = 0; i < count; i++) {
    const userIndex = i % usernames.length;
    const timestampIndex = i % timestamps.length;

    // Vary image count: ~20% single image, ~40% 2-3 images, ~30% 4-6 images, ~10% 7-10 images
    const imageVariant = i % 10;
    let imageCount: number;
    if (imageVariant < 2) imageCount = 1;
    else if (imageVariant < 6) imageCount = 2 + (i % 2);
    else if (imageVariant < 9) imageCount = 4 + (i % 3);
    else imageCount = 7 + (i % 4);

    // Vary aspect ratios
    const aspectRatios = [1, 0.8, 16 / 9, 2, 4 / 5, 1.2, 3 / 4, 9 / 16];
    const postAspectRatio = aspectRatios[i % aspectRatios.length];
    // Use larger image dimensions for Unsplash (heavy images)
    const imgWidth = 2048;
    const imgHeight = Math.round(imgWidth / postAspectRatio);

    const images: FeedImage[] = [];

    for (let j = 0; j < imageCount; j++) {
      // Use picsum.photos with unique IDs for reliable high-res images
      const picsumId = (i * 10 + j) % 1000;
      images.push({
        uri: `https://picsum.photos/id/${picsumId}/${imgWidth}/${imgHeight}`,
        aspectRatio: postAspectRatio,
        thumbnailUri: `https://picsum.photos/id/${picsumId}/400/${Math.round(400 / postAspectRatio)}`,
        metadata: generateImageMetadata(imgWidth, imgHeight, i, j)
      });
    }

    // Vary caption
    const useShortCaption = i % 4 === 0;
    const caption = useShortCaption ? shortCaptions[i % shortCaptions.length] : captions[i % captions.length];

    // Vary comments: ~10% no comments, ~30% 1-5 comments, ~30% 6-20 comments, ~20% 21-50 comments, ~10% 51-100 comments (viral)
    const commentVariant = i % 100;
    let commentCount: number;
    if (commentVariant < 10) {
      commentCount = 0;
    } else if (commentVariant < 40) {
      commentCount = 1 + (i % 5);
    } else if (commentVariant < 70) {
      commentCount = 6 + (i % 15);
    } else if (commentVariant < 90) {
      commentCount = 21 + (i % 30);
    } else {
      commentCount = 51 + (i % 50); // Viral posts with 51-100 comments
    }

    const likes = Math.floor(Math.random() * 10000) + (commentCount > 50 ? 5000 : 0);
    const totalComments = commentCount === 0 ? 0 : Math.floor(Math.random() * 500) + commentCount;

    // Vary tags
    const hasTags = i % 10 < 7;

    // Suggestions: ~15% of posts show suggestions
    const showSuggestions = i % 7 === 0;

    // Sponsored: ~5% of posts
    const isSponsored = i % 20 === 0;

    // Link preview: ~10% of posts
    const hasLinkPreview = i % 10 === 0;

    // Poll: ~3% of posts
    const hasPoll = i % 33 === 0;

    posts.push({
      id: String(i + 1),
      user: {
        username: usernames[userIndex],
        avatar: `https://i.pravatar.cc/150?img=${(userIndex % 70) + 1}`,
        avatarHD: `https://i.pravatar.cc/500?img=${(userIndex % 70) + 1}`,
        isVerified: i % 3 === 0,
        badges: generateBadges(userIndex),
        stats: generateUserStats(userIndex),
        bio: bios[userIndex % bios.length],
        website: userIndex % 2 === 0 ? `https://${usernames[userIndex]}.dev` : undefined,
        isFollowing: i % 4 !== 0,
        isFollower: i % 3 === 0,
        mutualFollowers: generateMutualFollowers(userIndex)
      },
      images,
      caption,
      likes,
      comments: generateComments(i, commentCount),
      totalComments,
      timestamp: timestamps[timestampIndex],
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8,
      tags: hasTags ? tagSets[i % tagSets.length] : [],
      location: generateLocationData(i),
      suggestedPosts: showSuggestions ? generateSuggestedPosts(i) : [],
      showSuggestions,
      reactions: generateReactions(i),
      shares: generateShares(i),
      mentions: caption.includes("@")
        ? [
            {
              username: usernames[(userIndex + 1) % usernames.length],
              position: { start: caption.indexOf("@"), end: caption.indexOf("@") + 15 },
              userId: `user-${(userIndex + 1) % usernames.length}`
            }
          ]
        : [],
      analytics: generateAnalytics(i, likes),
      relatedPosts: generateRelatedPosts(i),
      linkPreview: hasLinkPreview
        ? {
            url: `https://appjs.co/2026/talk-${i}`,
            title: `App.js Conf 2026 - Talk ${i}`,
            description: "Join us for the biggest React Native & Expo conference in Europe!",
            image: `https://picsum.photos/id/${(i * 3) % 1000}/1200/630`,
            siteName: "App.js Conf",
            favicon: "https://appjs.co/favicon.ico"
          }
        : undefined,
      poll: hasPoll
        ? {
            id: `poll-${i}`,
            question: ["What's your favorite React Native feature?", "Best workshop topic?", "Favorite Expo feature?"][
              i % 3
            ],
            options: [
              {
                id: `opt-${i}-1`,
                text: "Reanimated",
                votes: Math.floor(Math.random() * 200),
                voters: [],
                percentage: 0
              },
              {
                id: `opt-${i}-2`,
                text: "Expo Router",
                votes: Math.floor(Math.random() * 200),
                voters: [],
                percentage: 0
              },
              {
                id: `opt-${i}-3`,
                text: "Gesture Handler",
                votes: Math.floor(Math.random() * 200),
                voters: [],
                percentage: 0
              },
              { id: `opt-${i}-4`, text: "EAS Build", votes: Math.floor(Math.random() * 200), voters: [], percentage: 0 }
            ],
            totalVotes: Math.floor(Math.random() * 800),
            endsAt: "2026-05-30T23:59:59Z",
            isAnonymous: i % 2 === 0,
            allowMultiple: i % 4 === 0
          }
        : undefined,
      isSponsored,
      sponsorInfo: isSponsored
        ? {
            advertiser: ["Expo", "Software Mansion", "Meta", "Shopify", "Microsoft"][i % 5],
            targetAudience: ["React Native developers", "Mobile developers", "Frontend engineers"],
            budget: 1000 + (i % 10) * 500,
            impressionsGoal: 10000 + (i % 10) * 5000
          }
        : undefined,
      isEdited: i % 12 === 0,
      editHistory:
        i % 12 === 0
          ? [
              {
                editedAt: timestamps[(i + 2) % timestamps.length],
                previousCaption: caption.slice(0, 50) + "... (edited)"
              }
            ]
          : undefined,
      visibility: visibilities[i % visibilities.length],
      allowComments: i % 15 !== 0,
      allowShares: i % 20 !== 0,
      contentWarning: i % 50 === 0 ? "Flashing lights in video" : undefined,
      language: languages[i % languages.length],
      translations:
        i % 5 === 0
          ? {
              pl: "Polskie tłumaczenie posta...",
              de: "Deutsche Übersetzung des Beitrags...",
              fr: "Traduction française du post..."
            }
          : undefined,
      audioTrack:
        i % 8 === 0
          ? {
              id: `track-${i}`,
              title: ["Coding Vibes", "Dev Flow", "Binary Beat", "React Rhythm", "Async Dreams"][i % 5],
              artist: ["CodeWave", "DevTunes", "ByteBeats", "SyntaxSound", "LoopLogic"][i % 5],
              duration: 180 + (i % 120),
              coverArt: `https://picsum.photos/id/${(i * 7) % 1000}/300/300`
            }
          : undefined
    });
  }
  return posts;
}

// Generate 5000 posts for realistic performance testing
export const MOCK_FEED = generateMockFeed(5000);
