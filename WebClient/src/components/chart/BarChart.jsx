import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJs,
    BarElement,
    BarController,
    CategoryScale,
    Title,
    Tooltip,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom";

ChartJs.register(BarElement, BarController, CategoryScale, Title, Tooltip, zoomPlugin, annotationPlugin)

const BarChart = ({ labels = "", counts, axis = "x" }) => {
    const data = {
        labels: counts,
        datasets: [
            {
                data: counts,
                backgroundColor: "#225af4ff",
                borderRadius: 10
            },
        ],
    };

    const options = {
        responsive: true,
        animation: false,
        indexAxis: axis,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: false },
                grid: {
                    color: "#c8c8c84d",
                    borderColor: "#fff",
                    borderWidth: 1,
                    lineWidth: 1,
                }
            }
        }
    }

    return <Bar data={data} options={options} />
}

export default BarChart