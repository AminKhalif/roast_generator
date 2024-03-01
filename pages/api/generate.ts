import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

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
  async function fetchOpenAICompletions(imageUrl: string) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure the API key is stored in an environment variable
    const requestBody = {
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "You are given a picture of something funny from the interne. Can you explain the following joke and what makes it funny?"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            // url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                            url: imageUrl
                        }
                    }
                ]
            }
        ],
        max_tokens: 300
    };

    try {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify(requestBody)
        });
        // console.log("response found!!!")
        // console.log("response", response)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let jsonResponse = await response.json();
        // console.log(jsonResponse);
        // console.log("final responseeee", jsonResponse.choices[0].message.content);
        const explanation = jsonResponse.choices[0].message.content
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
