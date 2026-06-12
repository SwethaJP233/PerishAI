// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useShipments } from '@/hooks/useShipments';
import { answerAssistant, ChatMessage } from '@/services/assistantService';

const SUGGESTIONS = [
  'Why is FIS-1023 high risk?',
  'How many anomalies right now?',
  'What are the riskiest shipments?',
  'What should I do about PRD-4920?',
];

export default function AssistantScreen() {
  const { shipments } = useShipments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  const send = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text) return;
      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: 'user',
        text,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // Simulate small delay for natural feel
      setTimeout(() => {
        const reply = answerAssistant(text, shipments);
        const botMsg: ChatMessage = {
          id: `${Date.now()}-a`,
          role: 'assistant',
          text: reply,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      }, 350);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    },
    [input, shipments],
  );

  const empty = messages.length === 0;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader
        eyebrow="GENAI"
        title="Ask PerishAI"
        subtitle="Plain-language insight on any shipment"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {empty ? (
            <View style={styles.heroWrap}>
              <Image
                source={require('@/assets/images/assistant-orb.png')}
                style={styles.orb}
                contentFit="contain"
                transition={250}
              />
              <Text style={styles.heroTitle}>Hi, I am PerishAI</Text>
              <Text style={styles.heroText}>
                Ask me about spoilage risk, shelf life, anomalies, or recommended
                actions across your fleet.
              </Text>
              <View style={styles.suggestWrap}>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    style={({ pressed }) => [
                      styles.suggestChip,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="lightning-bolt-outline"
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.suggestText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((m) => <Bubble key={m.id} msg={m} />)
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputBox}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={18}
              color={colors.textDim}
            />
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about a shipment ID..."
              placeholderTextColor={colors.textDim}
              style={styles.input}
              onSubmitEditing={() => send()}
              returnKeyType="send"
              accessibilityLabel="Assistant message input"
            />
          </View>
          <Pressable
            onPress={() => send()}
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <MaterialCommunityIcons name="send" size={18} color={colors.bg} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowBot]}>
      {!isUser ? (
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="robot-happy-outline" size={16} color={colors.primary} />
        </View>
      ) : null}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
        ]}
      >
        <Text style={[styles.bubbleText, isUser && { color: colors.bg }]}>{msg.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  heroWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  orb: { width: 140, height: 140 },
  heroTitle: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
  },
  heroText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  suggestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  suggestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  suggestText: {
    ...typography.small,
    color: colors.text,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowBot: { justifyContent: 'flex-start' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary + '66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  bubbleBot: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 21,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.bgDeep,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
