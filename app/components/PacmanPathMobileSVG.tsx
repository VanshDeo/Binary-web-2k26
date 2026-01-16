import React from 'react';

type PacmanPathMobileSVGProps = {
    className_svg?: string;
    className_path?: string;
    pathId?: string;
    pacmanClass?: string;
};

const PacmanPathMobileSVG: React.FC<PacmanPathMobileSVGProps> = ({
    className_svg,
    className_path,
    pathId = "path-mobile",
    pacmanClass = "pattern-rect-mobile z-10 render-pixelated ",
}) => {
    return (
        <svg
            width="60"
            height="1150"
            viewBox="0 0 60 1150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className_svg}
            preserveAspectRatio="xMidYMin meet"
        >
            {/* Track Path (Dotted Line) */}
            <path
                id={pathId}
                className={className_path}
                d="M19.5 0.5V84.1987V192.5V250.5V338V429.5V509.5V577.5V645.5V746.5V822.5V923.5V1150"
                stroke="#4BC715"
                strokeWidth="7"
                strokeDasharray="10 10"
                transform="translate(15, 0)"
            />
            {/* Pacman Shape */}
            <path
                className={pacmanClass}
                d="M40.7895 17.1414C40.0511 12.1531 37.4095 7.62063 33.3931 4.45076C29.3766 1.28089 24.2815 -0.292655 19.127 0.0449074C13.9725 0.38247 9.13867 2.60625 5.5925 6.27138C2.04633 9.93652 0.0492951 14.7728 0.000899533 19.8126C-0.047496 24.8525 1.85631 29.7244 5.33148 33.4537C8.80665 37.183 13.5969 39.4948 18.744 39.9265C23.8912 40.3582 29.0156 38.8781 33.0922 35.7822C37.1688 32.6863 39.897 28.2029 40.7311 23.2289L20.5 20L40.7895 17.1414Z"
                fill="#4BC715"
                transform="translate(15, 15)"
            />

        </svg>
    );
};

export default PacmanPathMobileSVG;
