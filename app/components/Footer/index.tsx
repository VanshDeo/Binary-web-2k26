'use client';
import { Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden flex w-full flex-col justify-center space-y-10 bg-opacity-50 backdrop-blur-md backdrop-filter">
      <div className="text-outline absolute top-1/4 z-[-1] flex w-full -translate-y-1/2 transform flex-row items-center justify-evenly text-[4rem] font-extrabold tracking-widest text-[#1b1b1ba2] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[18rem]">
        BINARY
      </div>

      <div className="mx-auto mt-6 w-[35%] max-w-[200px] items-center justify-center">
        <div className="text-center text-4xl font-bold text-green-600">BINARY</div>
      </div>

      {/* not needed already visible in navbar */}

      {/* <nav className="flex justify-center flex-wrap gap-6 text-white font-sm mt-8 font-pixelate">
        <a
          className=" gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#hero"
        >
          Home
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#about"
        >
          About
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#timeline"
        >
          Timeline
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#track"
        >
          Tracks
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#prizes"
        >
          Prizes
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#mentors"
        >
          Mentors
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#team"
        >
          Team
        </a>
        <a
          className="gap-5 w-[84px] bg-black/0 text-white text-md hover:text-md font-pixelate hover:font-bold hover:text-white rounded-none flex justify-center text-sm"
          ref={glitch.ref}
          href="#faqs"
        >
          Faqs
        </a>
      </nav> */}

      <div className="flex justify-center space-x-5">
        <a href="https://www.instagram.com/binary.kgec/" target="_blank" rel="noopener noreferrer">
          {/* <svg
            className="h-7 w-7 fill-green-600 hover:fill-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5c3.176 0 5.75-2.574 5.75-5.75v-8.5C22 4.574 19.426 2 16.25 2h-8.5Zm0 1.5h8.5c2.464 0 4.25 1.786 4.25 4.25v8.5c0 2.464-1.786 4.25-4.25 4.25h-8.5c-2.464 0-4.25-1.786-4.25-4.25v-8.5c0-2.464 1.786-4.25 4.25-4.25ZM18 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-6 2a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Zm0 1.5a4.25 4.25 0 1 1 0 8.5 4.25 4.25 0 0 1 0-8.5Z"
            />
          </svg> */}
          <Instagram className="h-7 w-7 stroke-green-600 hover:stroke-white" />
        </a>

        {/* <a href="https://git.com" target="_blank" rel="noopener noreferrer">
          <svg
            className="h-6 w-6 fill-green-600 hover:fill-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clipRule="evenodd"
            />
          </svg>
        </a> */}
        <a href="http://discord.gg/yKcMYeMMe8" target="_blank" rel="noopener noreferrer">
          <svg
            className="h-7 w-7 fill-green-600 hover:fill-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21 16"
          >
            <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
          </svg>
        </a>
        <a href="https://x.com/BinaryKgec" target="_blank" rel="noopener noreferrer">
          <svg
            className="h-7 w-7 fill-green-600 hover:fill-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 17"
          >
            <path
              fillRule="evenodd"
              d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/binarykgec" target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-7 w-7 stroke-green-600 hover:stroke-white" />
        </a>
        <a href="https://t.me/binarykgec" target="_blank" rel="noopener noreferrer">
          <svg
            className="h-7 w-7 fill-green-600 hover:fill-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C10.4178 4 8.87103 4.46919 7.55544 5.34824C6.23985 6.22729 5.21447 7.47672 4.60897 8.93853C4.00347 10.4003 3.84504 12.0089 4.15372 13.5607C4.4624 15.1126 5.22433 16.538 6.34315 17.6569C7.46197 18.7757 8.88743 19.5376 10.4393 19.8463C11.9911 20.155 13.5997 19.9965 15.0615 19.391C16.5233 18.7855 17.7727 17.7602 18.6518 16.4446C19.5308 15.129 20 13.5823 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM15.93 9.48L14.62 15.67C14.52 16.11 14.26 16.21 13.89 16.01L11.89 14.53L10.89 15.46C10.8429 15.5215 10.7824 15.5715 10.7131 15.6062C10.6438 15.6408 10.5675 15.6592 10.49 15.66L10.63 13.66L14.33 10.31C14.5 10.17 14.33 10.09 14.09 10.23L9.55 13.08L7.55 12.46C7.12 12.33 7.11 12.03 7.64 11.83L15.35 8.83C15.73 8.72 16.05 8.94 15.93 9.48Z" />
          </svg>
        </a>
      </div>
      {/* <div className='text-white font-pixelate text-center text-md hover:text-md  hover:font-bold hover:text-white text-sm" ref={glitch.ref}' ref={glitch.ref}> <Link href="/Hackathonbrochure.pdf" target={'_blank'}>
    Sponsorship Brochure
      </Link></div> */}
      <hr className="my-8 ml-20 mr-20 border-[0.5px] border-[#092b0b]" />
      <p className="py-4 text-center font-medium text-white/60">
        &copy; {new Date().getFullYear()} Binary. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
