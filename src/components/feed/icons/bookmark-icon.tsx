import Svg, { Path, G, Defs, ClipPath, LinearGradient, Stop } from "react-native-svg";

export const BookmarkIcon = ({ size, color, filled }: { size: number; color: string; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="bookmarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={color} stopOpacity="1" />
        <Stop offset="60%" stopColor={color} stopOpacity="0.92" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.85" />
      </LinearGradient>
      <ClipPath id="bookmarkClip">
        <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#bookmarkClip)">
      {filled ? (
        <>
          <Path
            d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
            fill={`url(#bookmarkGrad)`}
          />
          <Path
            d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
            fill={color}
            fillOpacity={0.2}
          />
          <Path
            d="M7 3h10v12l-5-3.5L7 15V3z"
            fill={color}
            fillOpacity={0.1}
          />
        </>
      ) : (
        <>
          <Path
            d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Path
            d="M8 3h8v10l-4-2.8L8 13V3z"
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.3}
          />
        </>
      )}
    </G>
  </Svg>
);
