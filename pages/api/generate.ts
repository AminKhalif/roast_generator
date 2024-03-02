import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { exp } from "@tensorflow/tfjs";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

debugger

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
  async function fetchOpenAICompletions(imageUrl: string) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure the API key is stored in an environment variable
    
    try {
      let requestBody2 = {
          model: "gpt-4-vision-preview",
          messages: [
              {
                  role: "user",
                  content: [
                      {
                          type: "text",
                          text: "Describe the key features of the person like hair color, glasses, facial hair, gender, etc.." 
                      },
                      {
                          type: "image_url",
                          image_url: {
                            url: imageUrl
                          }
                      },
                      // {
                      //     type: "image_url",
                      //     image_url: {
                      //       url: "https://i.imgur.com/fgyhijF.png"
                      //     }
                      // }
                  ]
              }
          ],
          max_tokens: 300
      };
        let response: any = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify(requestBody2)
        });
        // console.log("response found!!!")
        // console.log("response", response)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let jsonResponse = await response.json();
        // console.log(jsonResponse);
        // console.log("final responseeee", jsonResponse.choices[0].message.content);
        var explanation = jsonResponse.choices[0].message.content

        console.log(explanation)

        let requestBody = {
          model: "dall-e-3",
          prompt: `Using the following description, create an image in a simplified cute cartoon style, focusing on adorable characters designed with basic geometric shapes and minimal lines that adapts or could look like the person in the description. The art style of the creature can be described as "minimalist" or "flat design". The background should be white. This style is characterized by simplicity, the use of solid colors, and minimal detailing, focusing on clean lines and basic shapes to convey the design's essence. It's often used in iconography and digital design for its clarity and ability to communicate ideas effectively without clutter. The characters should feature expressive, friendly faces with just enough detail to convey emotion, while the overall design remains uncluttered. Use bright, cheerful colors to enhance the sense of warmth and positivity. This style should evoke a sense of joy and simplicity, making the characters immediately endearing and accessible. Please retain facial features from the description, such as hair color and length, and facial hair or glasses if they exist. Please make them in cat form. The full body should be in the image. Please just include the image of the animal and nothing else (no text or icons). If the skin tone is dark or black, ensure the character is African American.\nDescription: ${explanation}`,
          n: 1,
          size: "1024x1024",
      };  
      try {
          let response = await fetch("https://api.openai.com/v1/images/generations", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + OPENAI_API_KEY
              },
              body: JSON.stringify(requestBody)
          });
          console.log(response)
  
          // console.log("response found!!!")
          // console.log("response", response)
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          let jsonResponse = await response.json();
          // console.log(jsonResponse);
          // console.log("final responseeee", jsonResponse.choices[0].message.content);
          explanation = jsonResponse.data[0].url
          console.log("EXPLANATION")
          console.log(explanation)
  
  
          return explanation;
      } catch (error) {
          console.error('Error fetching from OpenAI API:', error);
      }  
  



        console.log("EXPLANATION")
        console.log(explanation)


        return explanation;
    } catch (error) {
        console.error('Error fetching from OpenAI API:', error);
    }  
  }

  const restoredImage = await fetchOpenAICompletions(imageUrl);
  res
    .status(200)
    .json(restoredImage ? restoredImage : "Failed to restore image");

}
