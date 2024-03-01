import Image from "next/image";

const testimonials = [
  [
    {
      content:
        "Just had early access to this and it's *ridic*. Powered by @vercel x @replicatehq – also very fast.",
      link: "https://twitter.com/rauchg/status/1612233034622984192",
      author: {
        name: "Guillermo Rauch",
        role: "CEO at Vercel",
        image: "/g.jpg",
      },
    },
    {
      content:
        "This is amazing! And in the 🧵 you can see the whole open-source stack instantly deployable to Vercel",
      link: "https://twitter.com/cramforce/status/1612496954218672128",
      author: {
        name: "Malte Ubl",
        role: "CTO at Vercel",
        image: "/malte.jpg",
      },
    },
  ],
  [
    {
      content:
        "I just used it and am extremely impressed with the website and wanted to express my appreciation for the excellent design and functionality. Keep up the great work!",
      link: "https://twitter.com/phar_whaz/status/1612498030627852309",
      author: {
        name: "Fawaz Adeniji",
        role: "Software Engineer",
        image: "/fawaz.jpg",
      },
    },
    {
      content:
        "Turning blurred photos into perfectly sharp ones. Works like magic",
      link: "https://twitter.com/sergvind/status/1612610058369515521",
      author: {
        name: "Sergei Vinderskikh",
        role: "CPO at Treeum",
        image: "/sergei.jpg",
      },
    },
  ],
  [
    {
      content:
        "I've just used it and damn I'll keep coming back! This is so good. Great work!",
      link: "https://twitter.com/Himanil_Gole/status/1612510385504157697",
      author: {
        name: "Himanil Gole",
        role: "Designer & Founder at CBREX",
        image: "/himanil.jpg",
      },
    },
    {
      content:
        "Wow, thank you! Tried a few and love it! My small example (pic of father from 70s original on right), really cleaned it up!",
      link: "https://twitter.com/rod_ellison/status/1612513333302775809",
      author: {
        name: "Rod Ellison",
        role: "Software Engineer",
        image: "/rod.jpg",
      },
    },
  ],
];

const examples = [
  [
    {src: "example1.jpeg"},
    {src: "example2.png"},
  ],
  [
    {src: "example3.jpeg"},
    {src: "example4.jpeg"},
  ],
  [
    {src: "example5.jpeg"},
    {src: "example6.jpeg"},
  ]
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="py-10"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto md:text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl">
            Examples
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-700 leading-7">
            Try using one of the images below
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-16 lg:max-w-none lg:grid-cols-3"
        >
          {examples.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li
                    key={testimonialIndex}
                    className="hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <img src={testimonial.src} className="w-48 rounded-lg"></img>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
