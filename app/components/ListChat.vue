<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 flex items-end justify-center sm:items-center bg-black/30 backdrop-blur-sm"
      @click.self="isOpen = false"
    >
      <div
        class="w-full sm:max-w-md md:max-w-lg mx-auto rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 flex flex-col max-h-[90vh] overflow-hidden dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/80"
      >
        <header
          class="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3 dark:border-slate-800"
        >
          <div>
            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {{ $t("list.chat.title") }}
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-500">
              {{ $t("list.chat.subtitle") }}
            </p>
          </div>
          <button
            type="button"
            class="h-8 w-8 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300"
            aria-label="Close chat"
            @click="isOpen = false"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
        >
          <!-- Messages (only show if logged in) -->
          <template v-if="isLoggedIn">
            <div v-for="(msg, index) in messages" :key="index" class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                :class="
                  msg.role === 'user'
                    ? 'bg-primary-500/20 text-primary-700 dark:text-primary-200'
                    : 'bg-secondary-500/20 text-secondary-800 dark:text-secondary-200'
                "
              >
                {{
                  msg.role === "user" ? $t("list.chat.you") : $t("list.chat.ai")
                }}
              </div>
              <div
                class="flex-1 rounded-2xl px-3 py-2 border"
                :class="[
                  msg.role === 'user'
                    ? 'bg-slate-100 border-slate-200 dark:bg-slate-900/90 dark:border-slate-700/80 whitespace-pre-wrap'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-900/90 dark:border-slate-700/80 prose prose-sm prose-slate dark:prose-invert max-w-none',
                ]"
              >
                <template v-if="msg.role === 'user'">{{ msg.content }}</template>
                <div v-else v-html="parseMarkdown(msg.content)" />
              </div>
            </div>

            <!-- Streaming message -->
            <div v-if="streamingMessage" class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-secondary-500/20 text-secondary-800 dark:text-secondary-200 flex items-center justify-center text-[11px] font-semibold"
              >
                {{ $t("list.chat.ai") }}
              </div>
              <div
                class="flex-1 rounded-2xl bg-slate-50 px-3 py-2 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-700/80 prose prose-sm prose-slate dark:prose-invert max-w-none"
              >
                <div v-html="parseMarkdown(streamingMessage)" />
                <span class="animate-pulse">▌</span>
              </div>
            </div>

            <!-- Error message -->
            <div
              v-if="errorMessage"
              class="flex gap-2 text-red-600 dark:text-red-400"
            >
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-red-500/20 flex items-center justify-center text-[11px] font-semibold"
              >
                !
              </div>
              <div
                class="flex-1 rounded-2xl bg-red-50 px-3 py-2 border border-red-200 dark:bg-red-900/20 dark:border-red-700/80"
              >
                {{ errorMessage }}
              </div>
            </div>
          </template>

          <!-- Login Required State -->
          <div
            v-else
            class="flex flex-col items-center justify-center py-8 px-4 text-center"
          >
            <div
              class="h-16 w-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4"
            >
              <Icon
                name="lucide:lock"
                class="h-8 w-8 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
            >
              {{ $t("list.chat.loginRequired.title") }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xs">
              {{ $t("list.chat.loginRequired.description") }}
            </p>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-600/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              @click="handleLoginClick"
            >
              <Icon name="lucide:log-in" class="h-4 w-4" />
              {{ $t("list.chat.loginRequired.button") }}
            </button>
          </div>
        </div>

        <!-- Chat input form (only if logged in) -->
        <form
          v-if="isLoggedIn"
          class="border-t border-slate-200 px-3 sm:px-4 py-3 flex items-end gap-2 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95"
          @submit.prevent="sendMessage"
        >
          <textarea
            v-model="userInput"
            :placeholder="$t('list.chat.inputPlaceholder')"
            :disabled="isLoading"
            rows="1"
            class="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <button
            type="submit"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="!userInput.trim() || isLoading"
            :aria-label="$t('list.chat.sendButton')"
          >
            <svg
              v-if="!isLoading"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
            </svg>
            <svg
              v-else
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
            </svg>
          </button>
        </form>

        <!-- Disabled input state (not logged in) -->
        <div
          v-else
          class="border-t border-slate-200 px-3 sm:px-4 py-3 flex items-end gap-2 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95"
        >
          <div
            class="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs sm:text-sm text-slate-400 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-500 cursor-not-allowed"
          >
            {{ $t("list.chat.inputPlaceholder") }}
          </div>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed"
            disabled
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { marked } from "marked";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

// Configure marked for safe rendering
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();

const isLoggedIn = computed(
  () => !!user.value && user.value.role === "authenticated",
);

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Handle login button click - store redirect target in localStorage and navigate
const handleLoginClick = () => {
  if (import.meta.client) {
    localStorage.setItem("munchcoach_redirect", "chat");
  }
  isOpen.value = false;
  navigateTo(localePath("/auth/login"));
};

const messagesContainer = ref<HTMLElement | null>(null);
const userInput = ref("");
const isLoading = ref(false);
const streamingMessage = ref("");
const errorMessage = ref("");

// Initialize with welcome message (static, localized)
const messages = ref<ChatMessage[]>([
  {
    role: "assistant",
    content: t("list.chat.welcomeMessage"),
  },
]);

// Convert messages to API format (excluding the static welcome message)
const getHistoryForApi = (): ApiMessage[] => {
  // Skip the first message (static welcome) and convert to API format
  return messages.value.slice(1).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Parse markdown content to HTML
const parseMarkdown = (content: string): string => {
  return marked.parse(content, { async: false }) as string;
};

const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message || isLoading.value) return;

  // Clear previous error
  errorMessage.value = "";

  // Add user message
  messages.value.push({
    role: "user",
    content: message,
  });

  userInput.value = "";
  isLoading.value = true;
  streamingMessage.value = "";
  scrollToBottom();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history: getHistoryForApi(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process SSE events
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.text) {
              streamingMessage.value += data.text;
              scrollToBottom();
            }
            if (data.done && streamingMessage.value) {
              // Add the completed message to history
              messages.value.push({
                role: "assistant",
                content: streamingMessage.value,
              });
              streamingMessage.value = "";
            }
          } catch {
            // Ignore JSON parse errors for incomplete data
          }
        }
      }
    }

    // Handle any remaining streamed content
    if (streamingMessage.value) {
      messages.value.push({
        role: "assistant",
        content: streamingMessage.value,
      });
      streamingMessage.value = "";
    }
  } catch (error) {
    console.error("Chat error:", error);
    errorMessage.value = t("list.chat.error");
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// Watch for open state to scroll to bottom when opened
watch(isOpen, (newValue) => {
  if (newValue) {
    scrollToBottom();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Markdown content styling adjustments */
:deep(.prose) {
  font-size: inherit;
  line-height: 1.6;
}

:deep(.prose p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose p:first-child) {
  margin-top: 0;
}

:deep(.prose p:last-child) {
  margin-bottom: 0;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.25em;
}

:deep(.prose li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

:deep(.prose code) {
  font-size: 0.875em;
  background-color: rgb(0 0 0 / 0.05);
  padding: 0.125em 0.25em;
  border-radius: 0.25em;
}

:deep(.dark .prose code) {
  background-color: rgb(255 255 255 / 0.1);
}

:deep(.prose pre) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.75em;
  border-radius: 0.5em;
  overflow-x: auto;
  font-size: 0.8em;
}

:deep(.prose pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.prose strong) {
  font-weight: 600;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  font-weight: 600;
  margin-top: 0.75em;
  margin-bottom: 0.25em;
}

:deep(.prose h1:first-child),
:deep(.prose h2:first-child),
:deep(.prose h3:first-child),
:deep(.prose h4:first-child) {
  margin-top: 0;
}
</style>
