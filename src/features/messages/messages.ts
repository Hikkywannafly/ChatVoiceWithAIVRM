import { VRMExpressionPresetName } from "@pixiv/three-vrm";

// ChatGPT API
export type Message = {
  role: "assistant" | "system" | "user";
  content: string;
};

const talkStyles = [
  "talk",
  "happy",
  "sad",
  "angry",
  "fear",
  "surprised",
] as const;
export type TalkStyle = (typeof talkStyles)[number];

const emotions = ["neutral", "happy", "angry", "sad", "relaxed"] as const;
export type EmotionType = (typeof emotions)[number] & VRMExpressionPresetName;
