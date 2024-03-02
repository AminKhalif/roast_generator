import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div>
        Made by Rainia Lee and Saleh Hindi with ❤️
        {/* <Link
          href="saleh.hindi.one@gmail.com"
          className="group"
          aria-label="Saleh Hindi on Email"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
          >
              <path
    d="M20,4H4C2.897,4,2,4.897,2,6v12c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V6C22,4.897,21.103,4,20,4z M20,6v0.511
l-8,6.223L4,6.512V6H20z M4,18V8.044l7.386,5.45c0.093,0.069,0.203,0.103,0.314,0.103s0.221-0.034,0.314-0.104L20,8.043V18H4z"/>
          </svg>
        </Link> */}

      </div>
    </footer>
  );
}
