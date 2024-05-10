import { GitHubLink } from "@/components/githubLink";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { Meta } from "@/components/meta";
import VrmViewer from "@/components/vrmViewer";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { OPENAI_ENDPOINT } from "@/features/constants/openai";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { useElevenLabs } from "@/features/elevenlabs/elevenLabsContext";
import { EmotionType, Message } from "@/features/messages/messages";
import {
  EmotionSentence,
  speakCharacter,
} from "@/features/messages/speakCharacter";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { M_PLUS_2, Montserrat } from "next/font/google";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const m_plus_2 = M_PLUS_2({
  variable: "--font-m-plus-2",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
});

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const { apiKey: elevenLabsKey, voices, currentVoiceId } = useElevenLabs();

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("");
  const [openAiEndpoint, setOpenAiEndpoint] = useState(OPENAI_ENDPOINT);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [showIntroduction, setShowIntroduction] = useState(false);

  const isSpeaking = useRef(false);

  const handleChangePrompt = (prompt: string) => {
    setSystemPrompt(prompt);

    localStorage.setItem("chatvrm_prompt", prompt);
  };
  const handleChangeOpenAIKey = (key: string) => {
    setOpenAiKey(key);

    localStorage.setItem("chatvrm_openai_key", key);
  };
  const handleChangeOpenAIEndpoint = (endpoint: string) => {
    setOpenAiEndpoint(endpoint);

    localStorage.setItem("chatvrm_openai_endpoint", endpoint);
  };

  useEffect(() => {
    const savedPrompt = localStorage.getItem("chatvrm_prompt");
    const savedOpenAIKey = localStorage.getItem("chatvrm_openai_key");
    const savedOpenAIEndpoint = localStorage.getItem("chatvrm_openai_endpoint");
    const shouldShowIntroduction = localStorage.getItem(
      "chatvrm_show_introduction"
    );

    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }

    if (savedOpenAIKey) {
      setOpenAiKey(savedOpenAIKey);
    }

    if (savedOpenAIEndpoint) {
      setOpenAiEndpoint(savedOpenAIEndpoint);
    }

    if (!shouldShowIntroduction) {
      setShowIntroduction(true);

      localStorage.setItem("chatvrm_show_introduction", "true");
    }
  }, []);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  const handleAISpeak = useCallback(
    async (
      sentence: EmotionSentence,
      onStart?: () => void,
      onComplete?: () => void
    ) => {
      isSpeaking.current = true;

      speakCharacter({
        emotionSentence: sentence,
        viewer,
        onStart,
        onComplete: () => {
          isSpeaking.current = false;

          onComplete?.();
        },
        fetchAudio: async (sentence) => {
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}/stream`,
            {
              headers: {
                "xi-api-key": elevenLabsKey,
                "content-type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                text: sentence.sentence,
                model_id: "eleven_monolingual_v1",
              }),
            }
          );

          const buffer = await response.arrayBuffer();

          return buffer;
        },
      });
    },
    [currentVoiceId, elevenLabsKey, viewer]
  );

  /**
   * Engaging in conversation with the assistant.
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      // If using official OpenAI endpoint and no API key is entered, prompt the user.
      if (openAiEndpoint === OPENAI_ENDPOINT && !openAiKey) {
        setAssistantMessage("OpenAI API Key is not entered");
        return;
      }

      if (!elevenLabsKey) {
        setAssistantMessage("ElevenLabs API Key is not entered");
        return;
      }

      if (!voices?.length) {
        setAssistantMessage(
          "No voices detected, please check your ElevenLabs settings (in Menu)"
        );
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      setAssistantMessage("");

      setChatProcessing(true);
      // Displaying additional user input.
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      // Chat GPTへ
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      const stream = await getChatResponseStream(
        messages,
        openAiKey,
        openAiEndpoint
      ).catch((e) => {
        console.error(e);
        return null;
      });

      if (!stream) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let currentSentence = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          receivedMessage += value;
          currentSentence += value;

          const sentences = breakIntoSentences(currentSentence);

          if (sentences[0]) {
            const emotionSentence = sentenceToEmotionSentence(sentences[0]);

            currentSentence = "";

            handleAISpeak(emotionSentence, () => {
              setAssistantMessage(
                (message) => (message += " " + emotionSentence.sentence)
              );
            });
          }
        }
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // Add assistant's response to the log.
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: receivedMessage },
      ];

      viewer.model?.emoteController?.playEmotion("neutral");

      setChatLog(messageLogAssistant);
      setChatProcessing(false);
    },
    [
      openAiEndpoint,
      openAiKey,
      elevenLabsKey,
      voices?.length,
      chatLog,
      systemPrompt,
      viewer.model?.emoteController,
      handleAISpeak,
    ]
  );

  return (
    <div className={`${m_plus_2.variable} ${montserrat.variable}`}>
      <Meta />

      {showIntroduction && (
        <Introduction
          openAiKey={openAiKey}
          onChangeAiKey={handleChangeOpenAIKey}
          onChangeAiEndpoint={handleChangeOpenAIEndpoint}
          openAiEndpoint={openAiEndpoint}
        />
      )}

      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        openAiKey={openAiKey}
        openAiEndpoint={openAiEndpoint}
        onChangeAiEndpoint={handleChangeOpenAIEndpoint}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        assistantMessage={assistantMessage}
        onChangeAiKey={handleChangeOpenAIKey}
        onChangeSystemPrompt={handleChangePrompt}
        onChangeChatLog={handleChangeChatLog}
      />
      <GitHubLink />
    </div>
  );
}

function sentenceToEmotionSentence(sentence: string): EmotionSentence {
  let currentEmotion = undefined;

  // remove the [] from the sentence
  const tagMatch = sentence.match(/^\[(.*?)\]/);

  if (tagMatch?.[1]) {
    currentEmotion = tagMatch[1] as EmotionType;
  }

  const currentSentence = sentence.slice(tagMatch?.[0].length || 0).trim();

  return {
    emotion: currentEmotion,
    sentence: currentSentence,
  };
}

function breakIntoSentences(str: string) {
  // Define a regular expression to match sentence endings.
  const sentenceEndings = /([.?!])/g;

  // Split the string into an array of sentences.
  const sentences = str.split(sentenceEndings);

  // Combine each pair of adjacent elements into a sentence, including the sentence-ending punctuation.
  const formattedSentences: string[] = [];

  const endingMarks = ["?", ".", "!"];

  for (let i = 0; i < sentences.filter(Boolean).length; i += 2) {
    const sentenceMark = sentences[i + 1];
    const currentSentence = sentences[i];

    // If the sentence mark is not in the list of ending marks, skip it.
    if (!endingMarks.some((mark) => mark === sentenceMark)) {
      continue;
    }

    // If the sentence is empty or is a ending mark, skip it.
    if (
      !currentSentence ||
      endingMarks.some((mark) => mark === currentSentence)
    ) {
      continue;
    }

    const sentence = sentences[i].trim() + sentences[i + 1];

    formattedSentences.push(sentence);
  }

  // Return the array of formatted sentences.
  return formattedSentences;
}
