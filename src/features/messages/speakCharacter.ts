import { wait } from "@/utils/wait";
import { Viewer } from "../vrmViewer/viewer";
import { EmotionType } from "./messages";

export interface EmotionSentence {
  emotion?: EmotionType;
  sentence: string;
}

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return ({
    emotionSentence,
    viewer,
    onStart,
    onComplete,
    fetchAudio,
  }: {
    emotionSentence: EmotionSentence;
    viewer: Viewer;
    onStart?: () => void;
    onComplete?: () => void;
    fetchAudio: (sentence: EmotionSentence) => Promise<ArrayBuffer>;
  }) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudio(emotionSentence).catch(() => null);

      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, emotionSentence.emotion);
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();
