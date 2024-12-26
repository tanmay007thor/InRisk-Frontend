import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, LineController } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import '../css/plot.css';  

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, LineController, zoomPlugin);

export default function LineChart({ dates, temperature }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const data = {
      labels: dates,  // Use dates for x-axis
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperature,  // Use temperature for y-axis
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1,
        },
      ],
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: 'Temperature Over Time',
            font: {
              size: 20,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (tooltipItem) => {
                return `Temperature: ${tooltipItem.raw}°C`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (Hours)',
              font: {
                size: 14,
              },
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)',
              font: {
                size: 14,
              },
            },
            beginAtZero: false,
            ticks: {
              maxTicksLimit: 5,
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            enabled: true,
            mode: 'xy',
            speed: 0.1,
          },
        },
      },
    };

    const chartInstance = new ChartJS(ctx, config);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [dates, temperature]);  // Re-run when dates or temperature changes

  return (
    <div className="chart-container">
      <canvas ref={chartRef} className="canvas" />
    </div>
  );
}
