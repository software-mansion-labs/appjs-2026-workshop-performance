import Svg, { Path, G, Defs, LinearGradient, Stop, Circle, Rect, Line } from "react-native-svg";

type MenuIconName =
  | "bell"
  | "link"
  | "share"
  | "person"
  | "eye-slash"
  | "flag";

export const MenuIcon = ({ size, color, name }: { size: number; color: string; name: MenuIconName }) => {
  const renderPaths = () => {
    switch (name) {
      case "bell":
        return (
          <G>
            <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill={color} fillOpacity={0.08} />
            <Circle cx="12" cy="5" r="1" fill={color} fillOpacity={0.3} />
          </G>
        );
      case "link":
        return (
          <G>
            <Path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={0.5} strokeOpacity={0.3} />
          </G>
        );
      case "share":
        return (
          <G>
            <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Rect x="4" y="12" width="16" height="10" rx="2" fill={color} fillOpacity={0.06} />
          </G>
        );
      case "person":
        return (
          <G>
            <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth={1.6} />
            <Circle cx="12" cy="7" r="4" fill={color} fillOpacity={0.08} />
            <Circle cx="12" cy="21" r="8" fill={color} fillOpacity={0.04} />
          </G>
        );
      case "eye-slash":
        return (
          <G>
            <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          </G>
        );
      case "flag":
        return (
          <G>
            <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill={color} fillOpacity={0.08} />
            <Line x1="4" y1="22" x2="4" y2="15" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          </G>
        );
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="menuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
      {renderPaths()}
    </Svg>
  );
};
