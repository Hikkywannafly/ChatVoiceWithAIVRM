import { OPENAI_ENDPOINT, OPEN_AI_KEY, YOUR_SITE_URL, YOUR_SITE_NAME } from "../constants/openai";
import { Message } from "../messages/messages";

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  endpoint = OPENAI_ENDPOINT
) {

  if (endpoint === OPENAI_ENDPOINT && !apiKey) {
    throw new Error("Invalid API Key");
  }

  // const headers: Record<string, string> = {
  //   "Content-Type": "application/json",
  //   Authorization: `Bearer ${apiKey}`,
  // };
  // const res = await fetch(endpoint, {
  //   headers: headers,
  //   method: "POST",
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo",
  //     messages: messages,
  //     stream: true,
  //     max_tokens: 200,
  //   }),
  // });

  // const reader = res.body?.getReader();
  // if (res.status !== 200 || !reader) {
  //   throw new Error("Something went wrong");
  // }

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
      // "model": "cohere/command",
      // "model": "openai/gpt-3.5-turbo",
      "model": "cohere/command-r-plus",
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
  // const readerResult = await reader.read();
  console.log(reader.read());

  // if (generation.body) {
  //   const reader = generation.body.getReader();
  //   try {
  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       // console.log('value');
  //       // console.log(value);

  //       // Assuming the stream is text, convert the Uint8Array to a string
  //       let chunk = new TextDecoder().decode(value);
  //       // Process the chunk here (e.g., append it to the controller for streaming to the client)
  //       // console.log(chunk); // Or handle the chunk as needed

  //       // split the chunk into lines
  //       let lines = chunk.split('\n');
  //       // console.log('lines');
  //       // console.log(lines);

  //       const SSE_COMMENT = ": OPENROUTER PROCESSING";


  //       // filter out lines that start with SSE_COMMENT
  //       lines = lines.filter((line) => !line.trim().startsWith(SSE_COMMENT));

  //       // filter out lines that end with "data: [DONE]"
  //       lines = lines.filter((line) => !line.trim().endsWith("data: [DONE]"));

  //       // Filter out empty lines and lines that do not start with "data:"
  //       const dataLines = lines.filter(line => line.startsWith("data:"));

  //       // Extract and parse the JSON from each data line
  //       const messages = dataLines.map(line => {
  //         // Remove the "data: " prefix and parse the JSON
  //         const jsonStr = line.substring(5); // "data: ".length == 5
  //         return JSON.parse(jsonStr);
  //       });

  //       // loop through messages and enqueue them to the controller
  //       messages.forEach((message) => {
  //         const content = message.choices[0].delta.content;
  //         // console.log(content);
  //         controller.enqueue(content);
  //       });

  //       // Parse the chunk as JSON
  //       // const parsedChunk = JSON.parse(chunk);
  //       // Access the content
  //       // const content = parsedChunk.choices[0].delta.content;
  //       // console.log(content); // Use the content as needed

  //       // enqueue the content to the controller
  //       // controller.enqueue(content);

  //       isStreamed = true;
  //     }
  //   } catch (error) {
  //     console.error('Error reading the stream', error);
  //   } finally {
  //     reader.releaseLock();
  //   }
  // }


  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");

          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            const messagePiece = json.choices[0].delta.content;

            if (messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
