import { useState, useCallback } from "react";
import { Link } from "./link";
import ElevenLabsSettings from "@/features/elevenlabs/elevenLabsSettings";

type Props = {
  openAiKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  openAiEndpoint: string;
  onChangeAiEndpoint: (openAiEndpoint: string) => void;
};
export const Introduction = ({
  openAiKey,
  onChangeAiKey,
  onChangeAiEndpoint,
  openAiEndpoint,
}: Props) => {
  const [opened, setOpened] = useState(true);

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleAiEndpointChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiEndpoint(event.target.value);
    },
    [onChangeAiEndpoint]
  );

  return opened ? (
    <div className="absolute z-40 w-full h-full px-24 py-40 bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
            Regarding this application.
          </div>
          <div>
            With just a web browser, you can enjoy conversations with 3D
            characters using microphone, text input, and voice synthesis. You
            can change the character&apos;s (VRM) appearance, adjust their
            personality, and customize their voice.
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Introduction to Technology.
          </div>
          <div>
            We use{" "}
            <Link
              url={"https://github.com/pixiv/three-vrm"}
              label={"@pixiv/three-vrm"}
            />{" "}
            for displaying and manipulating 3D models,{" "}
            <Link
              url={
                "https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
              }
              label={"ChatGPT API"}
            />{" "}
            for speech generation, and{" "}
            <Link
              url={"https://beta.elevenlabs.io/"}
              label={"ElevenLabs API"}
            />{" "}
            for speech synthesis.
          </div>
          <div className="my-16">
            The source code for this demo is available on GitHub. Feel free to
            experiment with changes and modifications!
            <br />
            <br />
            Repository:{" "}
            <Link
              url={"https://github.com/pixiv/ChatVRM"}
              label={"https://github.com/pixiv/ChatVRM"}
            />
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Precautions for use
          </div>
          <div>
            Do not intentionally induce discriminatory or violent remarks, or
            remarks that demean a specific person. Also, when replacing
            characters using a VRM model, please follow the model&apos;s terms
            of use.
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            OpenAI API
          </div>

          <div className="flex items-center gap-4">
            <label className="w-[20%]">API Key</label>

            <input
              placeholder="sk-..."
              type="password"
              value={openAiKey}
              onChange={handleAiKeyChange}
              className="my-4 px-16 py-8 grow h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-[20%]">API Endpoint</label>

            <input
              type="text"
              placeholder="OpenAI Endpoint"
              value={openAiEndpoint}
              onChange={handleAiEndpointChange}
              className="my-4 px-16 py-8 grow h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
          </div>

          <div className="my-24">
            API keys can be obtained from{" "}
            <Link
              url="https://platform.openai.com/account/api-keys"
              label="the OpenAI site"
            />
            . Enter the obtained API key in the form.
          </div>
          <div className="my-16">
            The entered API key will be used directly from the browser to use
            the OpenAI API, so it will not be saved on the server, etc. The
            model used is GPT-3.
            <br />
            <br />
            *Your API key and conversation text will not be sent to pixiv&apos;s
            server.
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            ElevenLabs API
          </div>

          <ElevenLabsSettings />
        </div>

        <div className="my-24">
          <button
            onClick={() => {
              setOpened(false);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
