import Svg, { Path, G, Defs, ClipPath, RadialGradient, Stop, Circle, Polyline } from "react-native-svg";

export const VerifiedIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <RadialGradient id="verifiedGrad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <Stop offset="60%" stopColor={color} stopOpacity="0.08" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </RadialGradient>
      <ClipPath id="verifiedClip">
        <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </ClipPath>
    </Defs>
    <G>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={`url(#verifiedGrad)`}
      />
      <Circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth={0.3} strokeOpacity={0.4} />
      <Polyline
        points="8.5,12 11,14.5 15.5,9.5"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="8.5,12 11,14.5 15.5,9.5"
        fill="none"
        stroke="white"
        strokeWidth={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.4}
      />
    </G>
  </Svg>
);
