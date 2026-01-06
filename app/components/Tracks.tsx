import { GraduationCap, HeartPulse, Box, Brain, Wifi, Lightbulb, Sprout, Users } from 'lucide-react';
import PixelTransition from './PixelTransition';

const Tracks = () => {
    const tracks = [
        {
            title: 'Education',
            icon: <GraduationCap size={64} className="text-green-500" />,
            description: 'Revolutionize learning with ed-tech solutions.',
            color: '#22c55e',
        },
        {
            title: 'Health',
            icon: <HeartPulse size={64} className="text-green-500" />,
            description: 'Innovate healthcare for a better tomorrow.',
            color: '#22c55e',
        },
        {
            title: 'Web3',
            icon: <Box size={64} className="text-green-500" />,
            description: 'Decentralize the future with blockchain.',
            color: '#22c55e',
        },
        {
            title: 'AI/ML & CI',
            icon: <Brain size={64} className="text-green-500" />,
            description: 'Push boundaries with Artificial Intelligence.',
            color: '#22c55e',
        },
        {
            title: 'IoT',
            icon: <Wifi size={64} className="text-green-500" />,
            description: 'Connect the world with smart devices.',
            color: '#22c55e',
        },
        {
            title: 'Open Innovation',
            icon: <Lightbulb size={64} className="text-green-500" />,
            description: 'Solve unique problems with creative solutions.',
            color: '#22c55e',
        },
        {
            title: 'Best Beginners Team',
            icon: <Sprout size={64} className="text-green-500" />,
            description: 'Start your journey with a bang.',
            color: '#22c55e',
        },
        {
            title: 'People\'s Choice',
            icon: <Users size={64} className="text-green-500" />,
            description: 'Win the hearts of the community.',
            color: '#22c55e',
        },
    ];

    return (
        <section id="tracks" className="py-20 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold font-mono text-center text-green-500 mb-16 tracking-tight">
                    &lt;Tracks /&gt;
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                    {tracks.map((track, index) => (
                        <PixelTransition
                            key={index}
                            firstContent={
                                <div className="flex flex-col items-center justify-center h-full w-full p-6">
                                    <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                        {track.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold font-mono text-gray-100">{track.title}</h3>
                                </div>
                            }
                            secondContent={
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "grid",
                                        placeItems: "center",
                                        backgroundColor: "#111",
                                        padding: "1rem"
                                    }}
                                >
                                    <p className="text-center font-mono font-bold text-xl" style={{ color: track.color }}>
                                        {track.description}
                                    </p>
                                </div>
                            }
                            gridSize={12}
                            pixelColor={track.color}
                            once={false}
                            animationStepDuration={0.4}
                            className="w-full h-[300px] border border-neutral-800 bg-neutral-900/50 hover:border-green-500/50 transition-colors group"
                            aspectRatio="100%"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Tracks;
