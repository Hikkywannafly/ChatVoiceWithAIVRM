import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PropsWithChildren } from "react";

export interface Voice {
  voice_id: string;
  name: string;
  samples: any;
  category: string;
  fine_tuning: FineTuning;
  labels: {};
  description: any;
  preview_url: string;
  available_for_tiers: any[];
  settings: any;
}

interface FineTuning {
  model_id: any;
  is_allowed_to_fine_tune: boolean;
  fine_tuning_requested: boolean;
  finetuning_state: string;
  verification_attempts: any;
  verification_failures: any[];
  verification_attempts_count: number;
  slice_ids: any;
}

export interface VoiceSettings {
  stability: number;
  similarity: number;
}

interface ContextProps {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  currentVoiceId: string;
  setCurrentVoiceId: React.Dispatch<React.SetStateAction<string>>;
  voiceSettings: VoiceSettings;
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>;
  voices: Voice[];
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  isLoadingVoices: boolean;
  isLoadingSettings: boolean;
}

const ElevenLabsContext = createContext<ContextProps>({
  apiKey: "",
  setApiKey: () => {},
  currentVoiceId: "",
  setCurrentVoiceId: () => {},

  voiceSettings: {
    stability: 0.75,
    similarity: 0.75,
  },
  setVoiceSettings: () => {},
  voices: [] as Voice[],
  setVoices: () => {},
  isLoadingVoices: false,
  isLoadingSettings: false,
});

const ElevenLabsContextProvider = ({ children }: PropsWithChildren) => {
  const [apiKey, setApiKey] = useState("");
  const [currentVoiceId, setCurrentVoiceId] = useState("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.75,
    similarity: 0.75,
  });
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  useEffect(() => {
    if (!apiKey && !currentVoiceId) return;

    localStorage.setItem(
      "chatvrm_elevenlabs",
      JSON.stringify({
        apiKey,
        currentVoiceId,
      })
    );
  }, [apiKey, currentVoiceId]);

  useEffect(() => {
    const json = localStorage.getItem("chatvrm_elevenlabs");

    if (!json) return;

    try {
      const { apiKey, currentVoiceId } = JSON.parse(json);

      setApiKey(apiKey);
      setCurrentVoiceId(currentVoiceId);
    } catch (err) {
      console.log("Error trying to parse elevenlabs saved data");
    }
  }, []);

  const fetchElevenLabs = useCallback(
    (path: string, { headers, ...init }: RequestInit = {}) => {
      return fetch(`https://api.elevenlabs.io/v1${path}`, {
        headers: {
          "xi-api-key": apiKey,
          ...headers,
        },
        ...init,
      });
    },
    [apiKey]
  );

  useEffect(() => {
    (async () => {
      if (!apiKey) return;

      setIsLoadingVoices(true);

      const request = await fetchElevenLabs("/voices");
      const json = await request.json();

      setIsLoadingVoices(false);

      if (json?.voices?.length) {
        setVoices(json.voices);
      }
    })();
  }, [apiKey, fetchElevenLabs]);

  useEffect(() => {
    (async () => {
      if (!voices?.length) return;

      if (!currentVoiceId) {
        setCurrentVoiceId(voices[0].voice_id);
      }

      setIsLoadingSettings(true);

      const voice =
        voices.find((voice) => voice.voice_id === currentVoiceId) || voices[0];

      const request = await fetchElevenLabs(
        `/voices/${voice.voice_id}/settings`
      );
      const json = await request.json();

      setIsLoadingSettings(false);

      if (json?.stability && json?.similarity_boost) {
        setVoiceSettings({
          stability: json.stability,
          similarity: json.similarity_boost,
        });
      }
    })();
  }, [voices, fetchElevenLabs, currentVoiceId]);

  return (
    <ElevenLabsContext.Provider
      value={{
        isLoadingVoices,
        isLoadingSettings,
        voices,
        setVoices,
        apiKey,
        setApiKey,
        currentVoiceId,
        setCurrentVoiceId,
        voiceSettings,
        setVoiceSettings,
      }}
    >
      {children}
    </ElevenLabsContext.Provider>
  );
};

export const useElevenLabs = () => {
  return React.useContext(ElevenLabsContext);
};

export default ElevenLabsContextProvider;
