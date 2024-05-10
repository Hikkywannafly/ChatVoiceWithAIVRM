import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@charcoal-ui/icons";
import ElevenLabsContextProvider from "@/features/elevenlabs/elevenLabsContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ElevenLabsContextProvider>
      <Component {...pageProps} />
    </ElevenLabsContextProvider>
  );
}
