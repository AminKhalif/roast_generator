import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';
import va from '@vercel/analytics';

const Home: NextPage = () => {
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
  
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Can You Explain The Jok  e</title>
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
          Don't get it? <br />Explain any joke {' '}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <SquigglyLines />
            <span className="relative">using AI</span>
          </span>{' '}
        </h1>

        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          Is there a joke that you don't understand? 
          Upload a screenshot or an image of a joke or meme, and our super intelligent AI will explain the joke.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border"
            href="https://twitter.com/SalehOfTomorrow"
            target="_blank"
            rel="noreferrer"
          >
            <button onClick={() => va.track('Referral Clicked')}>
              More Goodness
            </button>
          </a>

          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/explain"
          >
            Explain a joke
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
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
