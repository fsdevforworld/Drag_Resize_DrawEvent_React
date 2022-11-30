import React, { useMemo } from 'react';
import { Line } from "react-chartjs-2";

const SineWave = ({ samplingRate, lowerBound, upperBound, ...other }) => {
    const points = useMemo(() => {
        const points = [];
        const delta = 1/samplingRate;
        for (let i = lowerBound; i < upperBound; i++) {
            for (let j = 0; j < samplingRate; j++) {
                const x = i + j * delta;
                const y = Math.sin(x);
                points.push([x, y]);
            }
        }
        return points;
    }, [ samplingRate, lowerBound, upperBound ]);

    return (
        <Line
            data={{
                labels: points.map(([ x, _ ]) => x),
                datasets: [{
                    label: 'Sine Wave',
                    data: points.map(([ _, y ]) => y),
                    borderColor: 'rgb(255, 99, 132)'
                }]
            }}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            stepSize: 1
                        }
                    },
                    y: {
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                animation: {
                    duration: 0,
                },
            }}
            {...other}
        />
    );
};

export default SineWave;
