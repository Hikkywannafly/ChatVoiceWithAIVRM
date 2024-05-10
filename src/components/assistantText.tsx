import { useEffect, useRef } from "react";

export const AssistantText = ({ message }: { message: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [message]);

  return (
    <div className="absolute bottom-0 left-0 mb-104  w-full">
      <div className="mx-auto max-w-4xl w-full p-16">
        <div className="bg-white rounded-8">
          <div className="px-24 py-8 bg-secondary rounded-t-8 text-white font-Montserrat font-bold tracking-wider">
            CHARACTER
          </div>
          <div className="px-24 py-16">
            <div
              ref={containerRef}
              className="text-secondary typography-16 font-M_PLUS_2 font-bold overflow-y-auto max-h-[6rem]"
            >
              {message.replace(/\[([a-zA-Z]*?)\]/g, "").trim()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
