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

export const MOCK_FEED: FeedPost[] = [
  {
    id: '1',
    user: {
      username: 'travel_adventures',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    image: 'https://picsum.photos/seed/post1/400/400',
    caption: 'Exploring the beautiful mountains today! The view is absolutely breathtaking 🏔️ #travel #adventure #nature',
    likes: 1243,
    comments: 89,
    timestamp: '2 hours ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '2',
    user: {
      username: 'foodie_delights',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    image: 'https://picsum.photos/seed/post2/400/400',
    caption: 'Homemade pasta with fresh tomato sauce 🍝 Recipe coming soon!',
    likes: 856,
    comments: 42,
    timestamp: '4 hours ago',
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: '3',
    user: {
      username: 'urban_explorer',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    image: 'https://picsum.photos/seed/post3/400/400',
    caption: 'City lights at night ✨ There is something magical about the urban landscape after dark',
    likes: 2156,
    comments: 134,
    timestamp: '6 hours ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '4',
    user: {
      username: 'fitness_guru',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    image: 'https://picsum.photos/seed/post4/400/400',
    caption: 'Morning workout complete! 💪 Remember: consistency is key to reaching your goals',
    likes: 567,
    comments: 28,
    timestamp: '8 hours ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '5',
    user: {
      username: 'nature_photography',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    image: 'https://picsum.photos/seed/post5/400/400',
    caption: 'Captured this stunning sunset yesterday 🌅 Nature never fails to amaze me',
    likes: 3421,
    comments: 201,
    timestamp: '10 hours ago',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: '6',
    user: {
      username: 'coffee_lover',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    image: 'https://picsum.photos/seed/post6/400/400',
    caption: 'Perfect latte art to start the day ☕️ #coffeeaddict #morningvibes',
    likes: 789,
    comments: 45,
    timestamp: '12 hours ago',
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: '7',
    user: {
      username: 'pet_paradise',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    image: 'https://picsum.photos/seed/post7/400/400',
    caption: 'Someone is enjoying their weekend 🐕 #dogsofinstagram #puppylove',
    likes: 4523,
    comments: 312,
    timestamp: '14 hours ago',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: '8',
    user: {
      username: 'art_studio',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    image: 'https://picsum.photos/seed/post8/400/400',
    caption: 'New painting finished! 🎨 This one took me about 3 weeks to complete',
    likes: 1876,
    comments: 98,
    timestamp: '1 day ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '9',
    user: {
      username: 'beach_vibes',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    image: 'https://picsum.photos/seed/post9/400/400',
    caption: 'Paradise found 🏖️ #beachlife #vacation #summervibes',
    likes: 2987,
    comments: 156,
    timestamp: '1 day ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '10',
    user: {
      username: 'bookworm_reads',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    image: 'https://picsum.photos/seed/post10/400/400',
    caption: 'Cozy reading corner setup 📚 Currently reading: The Midnight Library',
    likes: 654,
    comments: 67,
    timestamp: '2 days ago',
    isLiked: true,
    isBookmarked: true,
  },
];
