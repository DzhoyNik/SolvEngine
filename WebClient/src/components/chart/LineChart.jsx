import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJs,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom";

ChartJs.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, zoomPlugin, annotationPlugin)

const LineChart = ({ points, ratioA, ratioB, highlightPoint }) => {
    const data = {
        datasets: [
        {
            data: points,
            fill: true,
            borderColor: "#46e55eff",
            showLine: true,
            pointBackgroundColor: "#4f46e5",
            pointRadius: 0,
            tension: 0.3,
        },
        ],
    };

    const annotations = {
        ...(ratioA != ""  && {
            lineA: {
                type: "line",
                xMin: ratioA,
                xMax: ratioA,
                borderColor: "#ff0000ff",
                borderWidth: 3
            }
        }),
        ...(ratioB != "" && {
            lineb: {
                type: "line",
                xMin: ratioB,
                xMax: ratioB,
                borderColor: "#fbff00ff",
                borderWidth: 3
            },
        })
    }

    if (highlightPoint) {
        annotations.highlightPoint = {
            type: "point",
            xValue: highlightPoint.x,
            yValue: highlightPoint.y,
            backgroundColor: "#ff3131ff",
            radius: 6
        }
    }

    const options = {
        responsive: true,
        animation: false,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear",
                title: { display: false },
                min: -100,
                max: 100,
                grid: {
                    color: function(context) {
                        const val = context.tick.value
                        if (val === 0) return "#fff"
                        return "#c8c8c84d"
                    },
                    borderColor: "#fff",
                    borderWidth: 2,
                    lineWidth: (context) => {
                        const val = context.tick.value
                        if (val === 0) return 2
                        return 1
                    },
                }
            },
            y: {
                type: "linear",
                title: { display: false },
                min: -100,
                max: 100,
                grid: {
                    color: function(context) {
                        return context.tick.value === 0 ? "#fff" : "#c7c7c74d"
                    },
                    borderColor: "#fff",
                    borderWidth: 2,
                    lineWidth: 1,
                }
            }
        },
        plugins: {
            annotation: {
                annotations: annotations
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "xy"
                },
                zoom: {
                    wheel: { 
                        enabled: true,
                        speed: 0.1
                    },
                    pinch: { enabled: true },
                    mode: "xy"
                },
                limits: {
                    x: { minRange: 1 }
                }
            }
        }
    }

    return <Line data={data} options={options} />
}

export default LineChart