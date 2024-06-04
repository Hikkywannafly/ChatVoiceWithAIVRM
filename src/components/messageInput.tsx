import { KeyboardEventHandler, useCallback } from "react";
import { IconButton } from "./iconButton";

type Props = {
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: () => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
export const MessageInput = ({
  userMessage,
  isMicRecording,
  isChatProcessing,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
}: Props) => {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onClickSendButton();
      }
    },
    [onClickSendButton]
  );

  return (
    <div className="absolute bottom-0 z-20 w-screen">
      <div className=" text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content]">
            <IconButton
              iconName="24/Microphone"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isMicRecording}
              disabled={isChatProcessing}
              onClick={onClickMicButton}
            />
            <input
              type="text"
              placeholder="Please insert the question you want to ask"
              onChange={onChangeUserMessage}
              disabled={isChatProcessing}
              className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-M_PLUS_2 font-bold disabled"
              value={userMessage}
              onKeyDown={handleKeyDown}
            ></input>

            <IconButton
              iconName="24/Send"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
        <div className="bg-[#413D43]">
          <div className="py-2  text-center text-white font-Montserrat">
            powered by VRoid, ElevenLabs API, ChatGPT API, Author AlexJones(Hikkywannafly)
          </div>
        </div>
      </div>
    </div>
  );
};
