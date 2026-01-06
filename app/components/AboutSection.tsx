'use client';

// import BinaryText from "../Animations/BinaryText";
import PageSection from '../hooks/PageSection';
// import useTextScramble from "../Animations/text";
// import Image from 'next/image';
// import useWindowSize from '../hooks/useWindowSize';
import ParticleImage, {
  ParticleOptions,
  Vector,
  forces,
  ParticleForce,
} from 'react-particle-image';
import ArcadeHeader from './ui/ArcadeHeader';

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return pixel.b > 50;
  },
  color: ({ x, y, image }) => '#fff',
  radius: () => Math.random() * 0.5 + 0.5,
  mass: () => 40,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  },
};

const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5);
};

const About = () => {
  // const { innerWidth, innerHeight } = useWindowSize();
  // const glitch = useGlitch({
  //   playMode: 'always',
  //   createContainers: true,
  //   hideOverflow: false,
  //   timing: {
  //     duration: 3850,
  //   },
  //   glitchTimeSpan: {
  //     start: 0.5,
  //     end: 0.7,
  //   },
  //   shake: {
  //     velocity: 10,
  //     amplitudeX: 0.04,
  //     amplitudeY: 0.04,
  //   },
  //   slice: {
  //     count: 6,
  //     velocity: 15,
  //     minHeight: 0.02,
  //     maxHeight: 0.15,
  //     hueRotate: true,
  //   },
  //   pulse: false,
  // });

  return (
    <PageSection id="about">
      <main className=" ">
        <div className="mt-[96px] md:mt-[116px]">
          <div className="my-2 mb-8 md:text-[3rem]">
            <ArcadeHeader text="About Binary" />
          </div>
          <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-8">
            <div className="order-2 flex flex-col items-start justify-start md:order-1 md:col-span-5">
              <h2 className="mb-4 font-pixelate text-xl font-bold uppercase text-green-400">
                {' '}
                hi everyone
              </h2>
              <p className="font-pixelate font-bold text-white">
                {/* about binary content */}
                Binary is the annual hackathon of Kalyani Government Engineering College. It aims to
                be a stage for college students to showcase their creativity and resolve societal
                issues using technology. We hope to employ the current generation of innovators to
                think out of the box and bring transformative solutions to the forefront.
              </p>
              <p className="my-5 mb-4 font-pixelate font-bold text-green-400">
                {/* about content */}
                We intend to host about 300 students with expertise in diverse domains of computer
                science. The BINARY will take place in March at Kalyani Government Engineering
                College.
              </p>
            </div>
            <div className="order-1 flex h-max items-center justify-center gap-4 md:order-2 md:col-span-3">
              <span className="item-center flex justify-center">
                {/* <Image
                // src='binarylogo.png'
                //   alt="Binary Hackathon"
                height={100}
                  width={100}
                  className="flex w-[60%] items-center justify-center lg:hidden"
                /> */}
              </span>
              <ParticleImage
                src='binarylogo.png'
                width={400}
                scale={0.7}
                entropy={20}
                maxParticles={4000}
                particleOptions={particleOptions}
                mouseMoveForce={motionForce}
                touchMoveForce={motionForce}
                backgroundColor="transparent"
                className="hidden w-full md:w-[70%] lg:block"
              />
            </div>
          </div>
        </div>
      </main>
    </PageSection>
  );
};

export default About;