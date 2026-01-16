import { GraduationCap, HeartPulse, Box, Brain, Wifi, Lightbulb, Sprout, Users } from 'lucide-react';
import PixelTransition from './PixelTransition';
import ArcadeHeader from './ui/ArcadeHeader';
import PageSection from '../hooks/PageSection';

const Tracks = () => {
    const tracks = [
        {
            title: 'Education',
            icon: <GraduationCap size={52} className="text-green-500" />,
            description: 'Revolutionize learning with ed-tech solutions.',
            color: '#22c55e',
        },
        {
            title: 'Health',
            icon: <HeartPulse size={52} className="text-green-500" />,
            description: 'Innovate healthcare for a better tomorrow.',
            color: '#22c55e',
        },
        {
            title: 'Web3',
            icon: <Box size={52} className="text-green-500" />,
            description: 'Decentralize the future with blockchain.',
            color: '#22c55e',
        },
        {
            title: 'AI/ML & CI',
            icon: <Brain size={52} className="text-green-500" />,
            description: 'Push boundaries with Artificial Intelligence.',
            color: '#22c55e',
        },
        {
            title: 'IoT',
            icon: <Wifi size={52} className="text-green-500" />,
            description: 'Connect the world with smart devices.',
            color: '#22c55e',
        },
        {
            title: 'Open Innovation',
            icon: <Lightbulb size={52} className="text-green-500" />,
            description: 'Solve unique problems with creative solutions.',
            color: '#22c55e',
        },
        {
            title: 'Best Beginners Team',
            icon: <Sprout size={52} className="text-green-500" />,
            description: 'Start your journey with a bang.',
            color: '#22c55e',
        },
        {
            title: 'People\'s Choice',
            icon: <Users size={52} className="text-green-500" />,
            description: 'Win the hearts of the community.',
            color: '#22c55e',
        },
    ];

    return (
        <PageSection id="tracks">
            <section className="py-10 md:py-20 text-white relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-fit">
                    <div className="mb-12">
                        <ArcadeHeader text="Tracks" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center w-5/6 md:w-full mx-auto">
                        {tracks.map((track, index) => (
                            <PixelTransition
                                key={index}
                                firstContent={
                                    <div className="flex flex-col items-center justify-center h-full w-full p-6">
                                        <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                            {track.icon}
                                        </div>
                                        <h3 className="text-xl text-center font-bold text-gray-100">{track.title}</h3>
                                    </div>
                                }
                                secondContent={
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "grid",
                                            placeItems: "center",
                                            backgroundColor: track.color,
                                            padding: "1rem"
                                        }}
                                    >
                                        <p className="text-center font-bold text-lg text-black">
                                            {track.description}
                                        </p>
                                    </div>
                                }
                                gridSize={12}
                                pixelColor={track.color}
                                once={false}
                                animationStepDuration={0.4}
                                className="w-full h-65 md:h-full border border-neutral-800 bg-neutral-900/50 hover:border-green-500/50 transition-colors group"
                                aspectRatio="100%"
                            />
                        ))}
                    </div>
                </div>
            </section>
        </PageSection>
    );
};

export default Tracks;
