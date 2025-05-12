import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { subDays, format, isSameDay } from 'date-fns';

// Process data for multiple products
function processChartData(stocks) {
  const labels = [];
  const products = {}; // Object to hold product data

  const today = new Date();

  // Loop through the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const label = format(date, 'MM/dd');
    labels.push(label);

    // Filter stocks by date
    const dayStocks = stocks.filter((stock) => {
      const stockDate = new Date(stock.createdAt);
      stockDate.setHours(0, 0, 0, 0); // Normalize to midnight
      date.setHours(0, 0, 0, 0); // Normalize to midnight
      return isSameDay(stockDate, date);
    });

    // Calculate the import/export totals for each product
    dayStocks.forEach(stock => {
      const { productId, type, quantity } = stock;
      if (!products[productId.name]) {
        products[productId.name] = { import: [], export: [] };
      }

      const productData = products[productId.name];
      if (type === 'import') {
        productData.import.push(quantity || 0);
        productData.export.push(0); // If not export, push 0
      } else if (type === 'export') {
        productData.export.push(quantity || 0);
        productData.import.push(0); // If not import, push 0
      }
    });
  }

  // Create the datasets for each product
  // Define a color palette
  const colorPalette = [
    'rgba(75, 192, 192, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(199, 199, 199, 0.5)',
    'rgba(83, 102, 255, 0.5)',
    'rgba(255, 102, 255, 0.5)',
    'rgba(102, 255, 178, 0.5)',
    'rgba(255, 0, 0, 0.5)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 0, 255, 0.5)',
    'rgba(128, 0, 128, 0.5)',
    'rgba(0, 128, 128, 0.5)',
    'rgba(255, 105, 180, 0.5)',
    'rgba(255, 215, 0, 0.5)',
    'rgba(139, 69, 19, 0.5)',
    'rgba(70, 130, 180, 0.5)',
    'rgba(0, 100, 0, 0.5)',
    'rgba(100, 149, 237, 0.5)',
    'rgba(233, 150, 122, 0.5)',
    'rgba(255, 140, 0, 0.5)',
    'rgba(138, 43, 226, 0.5)',
    'rgba(64, 224, 208, 0.5)',
    'rgba(176, 224, 230, 0.5)',
    'rgba(240, 128, 128, 0.5)',
    'rgba(50, 205, 50, 0.5)',
    'rgba(106, 90, 205, 0.5)',
    'rgba(0, 191, 255, 0.5)'
  ];


  // Create the datasets for each product
  const datasets = Object.keys(products).flatMap((productName, index) => {
    const product = products[productName];
function generateColor(index, type) {
  const hue = (index * 40 + (type === 'export' ? 20 : 0)) % 360;
  return `hsla(${hue}, 70%, 60%, 0.5)`;
}

    return [
      {
        label: `${productName} - Nhập`,
        data: product.import,
        backgroundColor: generateColor(index, 'import'),
      },
      {
        label: `${productName} - Xuất`,
        data: product.export,
        backgroundColor: generateColor(index, 'export'),
      }
    ];
  });

  // Flatten the array of datasets

  return {
    labels,
    datasets,
  };
}

// Chart configuration
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

// Component to display the chart
export default function TopProductsChart() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // Fetch data from API
    fetch('https://study-language-backend-cpm6.vercel.app/stocks/history') // Replace with your actual API URL
      .then((response) => response.json())
      .then((data) => setStocks(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Run only once when the component is mounted

  const chartData = processChartData(stocks);

  return <Bar options={options} data={chartData} />;
}
