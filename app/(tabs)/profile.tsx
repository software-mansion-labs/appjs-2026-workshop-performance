import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: colors.icon + '30',
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>
      <View style={styles.content}>
        <IconSymbol name="person.fill" size={64} color={colors.icon} />
        <Text style={[styles.placeholder, { color: colors.text }]}>
          Profile coming soon
        </Text>
        <Text style={[styles.subtext, { color: colors.icon }]}>
          Your profile will appear here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholder: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 14,
  },
});
