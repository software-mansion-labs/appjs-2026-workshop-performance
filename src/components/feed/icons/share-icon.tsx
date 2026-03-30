import Svg, { Path, G, Defs, ClipPath, LinearGradient, Stop, Circle } from "react-native-svg";

export const ShareIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="shareGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <Stop offset="100%" stopColor={color} stopOpacity="1" />
      </LinearGradient>
      <ClipPath id="shareClip">
        <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
      </ClipPath>
    </Defs>
    <G>
      <Path
        d="M22 2L11 13"
        stroke={`url(#shareGrad)`}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22l-4-9-9-4 20-7z"
        fill="none"
        stroke={`url(#shareGrad)`}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22l-4-9-9-4 20-7z"
        fill={color}
        fillOpacity={0.08}
      />
      <Circle cx="22" cy="2" r="1.5" fill={color} fillOpacity={0.5} />
      <Circle cx="15" cy="22" r="1" fill={color} fillOpacity={0.4} />
      <Circle cx="2" cy="15" r="1" fill={color} fillOpacity={0.4} />
    </G>
  </Svg>
);
