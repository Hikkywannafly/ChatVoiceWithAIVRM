import { OPENAI_ENDPOINT, OPEN_AI_KEY, YOUR_SITE_URL, YOUR_SITE_NAME } from "../constants/openai";
import { getWindowAI } from "window.ai"
import { Message } from "../messages/messages";

export function stream(reader: any) {
  return new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const data = decoder.decode(value);
          const chunks = data.split("\n").filter(val => val.startsWith("data:"));

          for (const chunk of chunks) {
            try {
              const json = JSON.parse(chunk.slice(5)); // Assuming data follows "data:" immediately
              if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
                controller.enqueue(json.choices[0].delta.content);
              }
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError);
              // Optionally handle the error, e.g., skip this chunk or enqueue an error message
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    }
  });
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  endpoint = OPENAI_ENDPOINT
) {

  // let ai;
  // ai = await getWindowAI()
  // if (!ai) {
  //   console.log("ai", 'dang update ')

  // }
  // else {
  if (endpoint === OPENAI_ENDPOINT && !apiKey) {
    throw new Error("Invalid API Key");
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey || OPEN_AI_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL || `localhost`}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  }
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      "model": "google/gemini-2.5-flash",
      "messages": messages,
      "temperature": 0.7,
      "max_tokens": 200,
      "stream": true,
    })
  });
  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }
  // console.log(reader.read());

  return stream(reader);

}

// }

