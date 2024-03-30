import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';
import va from '@vercel/analytics';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { UrlBuilder } from '@bytescale/sdk';
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
// import { CompareSlider } from '../components/CompareSlider';
import NSFWFilter from 'nsfw-filter';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';
import Vapi from '@vapi-ai/web';



const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR('/api/remaining', fetcher);
  var { data: session, status } = useSession();
  status = "authenticated"

  if (typeof window !== 'undefined') {
    // @ts-ignore
    const clarity = window.clarity;
    if (clarity.track) {
      clarity.track('generation-failed-event', {
        message: 'Generation failed'
      });
    }
    
    
    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('event', 'generation-failed-2');
    }    
  }

  
  const options: UploadWidgetConfig = {
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      : 'free',
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    onPreUpload: async (
      file: File
    ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
      let isSafe = false;
      try {
        isSafe = await NSFWFilter.isSafe(file);
        console.log({ isSafe });
        if (!isSafe) va.track('NSFW Image blocked');
      } catch (error) {
        console.error('NSFW predictor threw an error', error);
      }
      if (!isSafe) {
        return { errorMessage: 'Detected a NSFW image which is not allowed.' };
      }
      if (data.remainingGenerations === 0) {
        return { errorMessage: 'No more generations left for the day.' };
      }
      return undefined;
    },
  };

  async function fetchOpenAICompletions(imageUrl: string) {
    debugger
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure the API key is stored in an environment variable
    const requestBody = {
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Using the image attached, create an image in a simplified cute cartoon style, focusing on adorable characters designed with basic geometric shapes and minimal lines that adapts or could look like the person in the attached image. The characters should feature expressive, friendly faces with just enough detail to convey emotion, while the overall design remains uncluttered. Use bright, cheerful colors to enhance the sense of warmth and positivity. This style should evoke a sense of joy and simplicity, making the characters immediately endearing and accessible. Please retain facial features from the photo, such as hair color and length, and facial hair or glasses if they exist. Please make them in cat form."
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

    // const vapi = new Vapi(process.env.ELEVEN_LABS_KEY);
    

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


      const llm_response_text = "You suuuuck"
      const options = {
        method: 'POST',
        headers: {
          'xi-api-key': '519cdf1327783bd8094dde183a91506a',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: llm_response_text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            similarity_boost: 0.8,
            stability: 0.5,
            style: 0.3
          }
        })
      };    
      fetch('https://api.elevenlabs.io/v1/text-to-speech/2l3NBlHTt1kN1ijFFAWO', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

        

      console.log("EXPLANATION")
      console.log(explanation)


      return explanation;
  } catch (error) {
      console.error('Error fetching from OpenAI API:', error);
  }  
}




  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      mutate();
      console.log("******** ", newPhoto)
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }


  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
          // fetchOpenAICompletions(imageUrl)

          
        }
      }}
      width="670px"
      height="250px"
    />
  );

  
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Tomofriend</title>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-20">
        {/* <a
          href="https://twitter.com/nutlope/status/1704894145003741611"
          target="_blank"
          rel="noreferrer"
          className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out"
        >
          Used by over <span className="font-semibold">470,000</span> happy
          users
        </a> */}
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Lorem Ipsem <br />Dolor Delit {' '}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <SquigglyLines />
            <span className="relative">using AI</span>
          </span>{' '}
        </h1>

        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          Add descriptive text maybe. Upload your friend and watch them grow.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border"
            href="https://twitter.com/SalehOfTomorrow"
            target="_blank"
            rel="noreferrer"
          >
            <button onClick={() => va.track('Referral Clicked')}>
              Test1
            </button>
          </a>

          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/explain"
          >
            Test2
          </Link>
        </div>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              {/* <FileUpload /> */}
              {/* TODO: */}
            </div>
          </div>
        </div>
      </main>
      {/* <Testimonials /> */}
      <UploadDropZone />

      {loading ? <Rings
                height="100"
                width="100"
                color="black"
                radius="6"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
              />
 : restoredImage && <img       
          width="335px"
          height="125px"
          src={restoredImage}
        />
      }

      {/* <Testimonials /> */}
      {/* <div id="quizForm" className="my-8">
        <h2>1. What pronouns does your SO go by?</h2>
        <input type="radio" name="question1" value="She" id="q1a1" /><label htmlFor="q1a1">She</label><br />
        <input type="radio" name="question1" value="He" id="q1a2" /><label htmlFor="q1a2">He</label><br />
        <input type="radio" name="question1" value="They" id="q1a3" /><label htmlFor="q1a3">They</label><br />

        <h2>2. What pet would you like your SO to be?</h2>
        <input type="radio" name="question2" value="Cat" id="q2a1" /><label htmlFor="q2a1">Cat</label><br />
        <input type="radio" name="question2" value="Dog" id="q2a2" /><label htmlFor="q2a2">Dog</label><br />
        <input type="radio" name="question2" value="Monkey" id="q2a3" /><label htmlFor="q2a3">Monkey</label><br />
        <input type="radio" name="question2" value="Goat" id="q2a4" /><label htmlFor="q2a4">Goat</label><br />

        <h2>3. What is your SO’s name?</h2>
        <textarea name="question4" id="q4" ></textarea>
        <br/ >
        
        <button type="button" 
          // onClick={() => }
        >Submit</button>
      </div> */}

      <Footer />
    </div>
  );
};

export default Home;
