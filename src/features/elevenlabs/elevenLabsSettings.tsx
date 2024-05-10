import React, { useCallback } from "react";
import { VoiceSettings, useElevenLabs } from "./elevenLabsContext";
import { Link } from "@/components/link";

const ElevenLabsSettings = () => {
  const {
    voices,
    apiKey,
    setApiKey,
    voiceSettings,
    setVoiceSettings,
    setCurrentVoiceId,
    isLoadingVoices,
    isLoadingSettings,
    currentVoiceId,
  } = useElevenLabs();

  const updateSettings = useCallback(
    async (fn: (settings: VoiceSettings) => VoiceSettings) => {
      const data = fn(voiceSettings);

      fetch(
        `https://api.elevenlabs.io/v1/voices/${currentVoiceId}/settings/edit`,
        {
          method: "POST",
          body: JSON.stringify({
            similarity_boost: data.similarity,
            stability: data.stability,
          }),
          headers: {
            "xi-api-key": apiKey,
            "content-type": "application/json",
          },
        }
      );
    },
    [apiKey, currentVoiceId, voiceSettings]
  );

  const handleElevenLabsKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setApiKey(event.target.value);
    },
    [setApiKey]
  );

  const handleVoiceChange: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      (e) => {
        const voiceId = e.target.value;

        if (!voiceId) return;

        setCurrentVoiceId(voiceId);
      },
      [setCurrentVoiceId]
    );

  return (
    <React.Fragment>
      <div className="flex items-center gap-4">
        <label className="w-[20%]">API Key</label>

        <input
          type="password"
          placeholder="ElevenLabs API Key (Required)"
          value={apiKey}
          onChange={handleElevenLabsKeyChange}
          className="my-4 px-16 py-8 grow h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
        ></input>
      </div>

      <div className="my-24">
        API keys can be obtained from{" "}
        <Link
          url="https://beta.elevenlabs.io/speech-synthesis"
          label="the ElevenLabs profile"
        />
        . Enter the obtained API key in the form.
      </div>
      <div className="my-16">
        The entered API key will be used directly from the browser to use the
        ElevenLabs API, so it will not be saved on the server, etc.
        <br />
        <br />
        *Your API key will not be sent to pixiv&apos;s server.
      </div>

      <div className="my-24">
        <select
          value={voices?.length ? currentVoiceId : "none"}
          disabled={isLoadingVoices}
          onChange={handleVoiceChange}
          className="appearance-none w-full my-4 px-16 py-8 grow h-40 bg-surface3 hover:bg-surface3-hover disabled:bg-surface4-disabled rounded-4 text-ellipsis"
        >
          {!voices.length ? (
            <option value="none">No voices found</option>
          ) : (
            voices.map((voice) => (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.category}/{voice.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="my-24">
        <div className="select-none">
          Stability: {Math.floor(voiceSettings.stability * 100)}%
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={voiceSettings.stability}
          className="mt-8 mb-16 input-range"
          onChange={(e) => {
            setVoiceSettings((prev) => {
              return {
                ...prev,
                stability: Number(e.target.value),
              };
            });
          }}
          onBlur={(e) => {
            updateSettings((prev) => ({
              ...prev,
              stability: Number(e.target.value),
            }));
          }}
          disabled={isLoadingSettings}
        ></input>
        <div className="select-none">
          Similarity: {Math.floor(voiceSettings.similarity * 100)}%
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={voiceSettings.similarity}
          className="mt-8 mb-16 input-range"
          onChange={(e) => {
            setVoiceSettings((prev) => {
              return {
                ...prev,
                similarity: Number(e.target.value),
              };
            });
          }}
          onBlur={(e) => {
            updateSettings((prev) => ({
              ...prev,
              similarity: Number(e.target.value),
            }));
          }}
          disabled={isLoadingSettings}
        ></input>
      </div>
    </React.Fragment>
  );
};

export default ElevenLabsSettings;
