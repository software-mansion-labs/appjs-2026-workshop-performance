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
  "attendee_dev"
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
  const techTopics = ["laptop", "computer", "coding", "keyboard", "office"];
  for (let i = 0; i < count; i++) {
    const userIdx = (postIndex * 5 + i * 3) % usernames.length;
    const topic = techTopics[(postIndex + i) % techTopics.length];
    suggestions.push({
      id: `suggested-${postIndex}-${i}`,
      username: usernames[userIdx],
      avatar: `https://i.pravatar.cc/150?img=${(userIdx % 70) + 1}`,
      image: `https://loremflickr.com/1080/1080/${topic}?lock=${postIndex * 10 + i}`,
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
    // Use coding/tech related images
    const techTopics = ["laptop", "computer", "coding", "keyboard", "office"];
    for (let j = 0; j < imageCount; j++) {
      const topic = techTopics[(i + j) % techTopics.length];
      images.push({
        uri: `https://loremflickr.com/${imgWidth}/${imgHeight}/${topic}?lock=${i * 10 + j}`,
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
