import { Message } from "@/features/messages/messages";
import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";

import ElevenLabsSettings from "@/features/elevenlabs/elevenLabsSettings";
import { Link } from "./link";
import VrmPresets from "@/features/vrmViewer/vrmPresets";

type Props = {
  openAiKey: string;
  openAiEndpoint: string;
  systemPrompt: string;
  chatLog: Message[];
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAiEndpoint: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onClickOpenVrmFile: () => void;
};
export const Settings = ({
  openAiKey,
  openAiEndpoint,
  chatLog,
  systemPrompt,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeAiEndpoint,
  onChangeChatLog,
  onClickOpenVrmFile,
}: Props) => {
  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <div className="absolute m-24">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
        <div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">Settings</div>
          <div className="my-24">
            <div className="my-8 font-bold typography-20">OpenAI API</div>

            <div className="flex items-center gap-4">
              <label className="w-[20%]">API Key</label>

              <input
                placeholder="sk-..."
                type="password"
                value={openAiKey}
                onChange={onChangeAiKey}
                className="my-4 px-16 py-8 grow h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              ></input>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-[20%]">API Endpoint</label>

              <input
                type="text"
                placeholder="OpenAI Endpoint"
                value={openAiEndpoint}
                onChange={onChangeAiEndpoint}
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
              *Your API key and conversation text will not be sent to
              pixiv&apos;s server.
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">Character model</div>
            <div className="my-8">
              <div className="mb-24">
                <VrmPresets />
              </div>

              <TextButton onClick={onClickOpenVrmFile}>
                Or open your own VRM model
              </TextButton>
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              Character configuration (system prompt)
            </div>

            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="px-16 py-8  bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
            ></textarea>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              Voice adjustment (ElevenLabs)
            </div>

            <ElevenLabsSettings />
          </div>

          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-16 typography-20 font-bold">
                Conversation log
              </div>
              <div className="my-8">
                {chatLog.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="my-8 grid grid-flow-col  grid-cols-[min-content_1fr] gap-x-fixed"
                    >
                      <div className="w-[64px] py-8">
                        {value.role === "assistant" ? "Character" : "You"}
                      </div>
                      <input
                        key={index}
                        className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                        type="text"
                        value={value.content
                          .replace(/\[([a-zA-Z]*?)\]/g, "")
                          .trim()}
                        onChange={(event) => {
                          onChangeChatLog(index, event.target.value);
                        }}
                      ></input>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
