import Svg, { Path, G, Defs, ClipPath, LinearGradient, Stop, Circle } from "react-native-svg";

export const CommentIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="commentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={color} stopOpacity="1" />
        <Stop offset="50%" stopColor={color} stopOpacity="0.9" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
      </LinearGradient>
      <ClipPath id="commentClip">
        <Path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#commentClip)">
      <Path
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        fill="none"
        stroke={`url(#commentGrad)`}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        fill={color}
        fillOpacity={0.06}
      />
      <Circle cx="7.5" cy="11" r="1" fill={color} fillOpacity={0.7} />
      <Circle cx="12" cy="11" r="1" fill={color} fillOpacity={0.7} />
      <Circle cx="16.5" cy="11" r="1" fill={color} fillOpacity={0.7} />
      <Path
        d="M6 7h12M6 9h10M6 13h8"
        stroke={color}
        strokeWidth={0.4}
        strokeOpacity={0.2}
        strokeLinecap="round"
      />
    </G>
  </Svg>
);
