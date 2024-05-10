import Head from "next/head";
export const Meta = () => {
  const title = "ChatVRM";
  const description =
    "With just a web browser, you can enjoy conversations with 3D characters using microphone, text input, and voice synthesis. You can change the character&apos;s (VRM) appearance, adjust their personality, and customize their voice.Webブラウザだけで3Dキャラクターとの会話を、マイクやテキスト入力、音声合成を用いて楽しめます。キャラクター（VRM）の変更や性格設定、音声調整もできます。";
  const imageUrl =
    "https://raw.githubusercontent.com/hoangvu12/ChatVRM/main/images/home.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
