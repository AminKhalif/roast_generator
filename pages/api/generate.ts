import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { exp } from "@tensorflow/tfjs";
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs-extra';

import Replicate from 'replicate';

const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}


// Create a new ratelimiter, that allows 5 requests per day
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO: 
  // // Check if user is logged in
  // const session = await getServerSession(req, res, authOptions);
  // if (!session || !session.user) {
  //   return res.status(500).json("Login to upload.");
  // }

  // TODO:
  // Rate Limiting by user email
  // if (ratelimit) {
  //   // const identifier = session.user.email;
  //   const identifier = "saleh.hindi.one@gmail.com"; // TODO:
  //   const result = await ratelimit.limit(identifier!);
  //   res.setHeader("X-RateLimit-Limit", result.limit);
  //   res.setHeader("X-RateLimit-Remaining", result.remaining);

  //   // Calcualte the remaining time until generations are reset
  //   const diff = Math.abs(
  //     new Date(result.reset).getTime() - new Date().getTime()
  //   );
  //   const hours = Math.floor(diff / 1000 / 60 / 60);
  //   const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

  //   if (!result.success) {
  //     return res
  //       .status(429)
  //       .json(
  //         `Your generations will renew in ${hours} hours and ${minutes} minutes. Email hassan@hey.com if you have any questions.`
  //       );
  //   }
  // }
  const imageUrl = req.body.imageUrl;
  async function analyzeImageWithClaude(imageUrl: string) {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const anthropic = new Anthropic(ANTHROPIC_API_KEY);
    console.log("HELLO WORLD --------------------------");
    console.log(imageUrl);
    console.log("HELLO WORLD --------------------------");
  
    try {
      const response = await fetch(imageUrl);
      const contentType = response.headers.get("content-type");
  
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("Invalid image URL. The URL must point to an image file.");
      }
  
      const imageMediaType = contentType;
      const imageArrayBuffer = await response.arrayBuffer();
      const imageData = Buffer.from(imageArrayBuffer).toString("base64");
  
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageMediaType,
                  data: imageData,
                },
              },
            ],
          },
        ],
      });
  
      console.log(message.content[0].text);

      console.log("00000")

      const options = {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message.content[0].text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            similarity_boost: 0.8,
            stability: 0.5,
            style: 0.3
          }
        })
      };    

      console.log("111111")
      
      
      const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/2l3NBlHTt1kN1ijFFAWO', options);

      let elevenLabsData;
      
      const timestamp = Date.now();
      const audioFilename = `audio-${timestamp}.mp3`;
      if (elevenLabsResponse.headers.get('content-type')?.includes('audio/')) {
        // Save the response as an audio file
        const audioBuffer = await elevenLabsResponse.arrayBuffer();
        const audioData = Buffer.from(audioBuffer);
      
        // Convert audio data to Base64
        const audioBase64 = audioData.toString('base64');
        // Assuming the MIME type of the audio is mp3, adjust if necessary
        const audioMimeType = "audio/mpeg";
        const audioDataURI = `data:${audioMimeType};base64,${audioBase64}`;

        // Generate a unique filename for the audio file
        // (Your existing code for filename generation here)
      
        // Save the audio file to disk
        fs.writeFileSync(audioFilename, audioData);
        console.log(`Audio file saved: ${audioFilename}`);

        const input = {
          audio: audioDataURI, // Use the Base64-encoded data URI here
          image: imageUrl // Assuming imageUrl is already in the correct format
        };
      
        const output = await replicate.run("cjwbw/dreamtalk:c52a2bad8c0bdf9645609de071dddb1ddab0b396b8bf7096027819473a85b4ca", { input });
        console.log(output);  
      
      } else if (elevenLabsResponse.headers.get('content-type')?.includes('application/json')) {
        elevenLabsData = await elevenLabsResponse.json();
        console.log("JSON response:", elevenLabsData);
      } else {
        elevenLabsData = await elevenLabsResponse.text();
        console.log("Text response:", elevenLabsData);
      }
      console.log("2222222")

    
      
    } catch (error) {
      console.error("Error analyzing image with Anthropic API:", error);
      throw error;
    }
  }
  
  try {
    const restoredImage = await analyzeImageWithClaude(imageUrl);
    res.status(200).json("{}");
  } catch (error) {
    res.status(400).json("Failed to restore image: " + "error.message");
  }
}
