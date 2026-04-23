import Svg, { Path, G, Defs, ClipPath, RadialGradient, Stop } from "react-native-svg";

export const HeartIcon = ({ size, color, filled }: { size: number; color: string; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <RadialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={color} stopOpacity="1" />
        <Stop offset="40%" stopColor={color} stopOpacity="0.95" />
        <Stop offset="70%" stopColor={color} stopOpacity="0.9" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.85" />
      </RadialGradient>
      <ClipPath id="heartClip">
        <Path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.379 4.068 1 7.5 1c1.977 0 3.813.91 4.5 2.8C12.687 1.91 14.523 1 16.5 1 19.932 1 23 3.379 23 7.191c0 4.105-5.37 8.863-11 14.402z" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#heartClip)">
      {filled ? (
        <>
          <Path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.379 4.068 1 7.5 1c1.977 0 3.813.91 4.5 2.8C12.687 1.91 14.523 1 16.5 1 19.932 1 23 3.379 23 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill={`url(#heartGrad)`}
          />
          <Path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.379 4.068 1 7.5 1c1.977 0 3.813.91 4.5 2.8C12.687 1.91 14.523 1 16.5 1 19.932 1 23 3.379 23 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill={color}
            fillOpacity={0.3}
          />
          <Path
            d="M8.5 6C6.567 6 5 7.567 5 9.5c0 1.054.47 1.998 1.212 2.638L12 17.5l5.788-5.362A3.49 3.49 0 0019 9.5C19 7.567 17.433 6 15.5 6c-.98 0-1.864.402-2.5 1.05A3.493 3.493 0 0011 6H8.5z"
            fill={color}
            fillOpacity={0.15}
          />
        </>
      ) : (
        <>
          <Path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.379 4.068 1 7.5 1c1.977 0 3.813.91 4.5 2.8C12.687 1.91 14.523 1 16.5 1 19.932 1 23 3.379 23 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
          <Path
            d="M12 18c-4.5-4.3-8.5-7.9-8.5-10.8C3.5 5.1 5.3 3.5 7.5 3.5c1.1 0 2.1.5 2.8 1.3l1.7 2 1.7-2c.7-.8 1.7-1.3 2.8-1.3 2.2 0 4 1.6 4 4.7C20.5 10.1 16.5 13.7 12 18z"
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.4}
          />
        </>
      )}
    </G>
  </Svg>
);
