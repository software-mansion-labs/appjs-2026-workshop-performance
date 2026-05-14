import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Engagement from "engagement";

import { ColorsContext } from "@/context/colors-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const POPOVER_WIDTH = 280;

export const EngagementSettingsButton = () => {
  const colors = useContext(ColorsContext);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Engagement.isEnabled()
      .then(value => {
        if (!cancelled) setEnabled(value);
      })
      .catch(() => {
        // ignore — keep default false
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (next: boolean) => {
    setPermissionError(false);
    setEnabled(next);
    try {
      await Engagement.setEnabled(next);
    } catch {
      setEnabled(!next);
      if (next) setPermissionError(true);
    }
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} hitSlop={6}>
        <View style={[styles.toggleBadge, { borderColor: colors.text }]}>
          <Text style={styles.toggleEmoji}>{"⚙️"}</Text>
        </View>
      </Pressable>
      {visible && (
        <EngagementSettingsMenu
          enabled={enabled}
          permissionError={permissionError}
          onToggle={handleToggle}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  );
};

interface EngagementSettingsMenuProps {
  enabled: boolean;
  permissionError: boolean;
  onToggle: (next: boolean) => void;
  onClose: () => void;
}

const EngagementSettingsMenu = ({
  enabled,
  permissionError,
  onToggle,
  onClose,
}: EngagementSettingsMenuProps) => {
  const colors = useContext(ColorsContext);

  const handleClearStats = () => {
    Alert.alert(
      "Clear engagement stats?",
      "This permanently deletes all collected engagement data on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await Engagement.clearStats();
            } catch {
              // best effort
            }
          },
        },
      ],
    );
  };

  const popoverLeft = Math.max(SCREEN_WIDTH - POPOVER_WIDTH - 16, 16);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.popover,
            shadowStyles.popoverShadow,
            { left: popoverLeft, backgroundColor: colors.cardBackground },
          ]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={[styles.title, { color: colors.text }]}>Engagement tracking</Text>
              <Switch value={enabled} onValueChange={onToggle} />
            </View>
            <Text style={[styles.description, { color: colors.icon }]}>
              Anonymously tracks how you interact with posts.
            </Text>
            {permissionError && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                Grant Motion / Activity Recognition access in Settings to enable.
              </Text>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.icon + "20" }]} />

          <TouchableOpacity onPress={handleClearStats} style={styles.clearButton}>
            <Text style={[styles.clearLabel, { color: colors.danger }]}>Clear stats</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  toggleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleEmoji: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popover: {
    position: "absolute",
    top: 100,
    width: POPOVER_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  divider: {
    height: 0.5,
    marginHorizontal: 0,
  },
  clearButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  clearLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});

const shadowStyles = StyleSheet.create({
  popoverShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});
