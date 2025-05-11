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
  const datasets = Object.keys(products).map(productName => {
    const product = products[productName];
    return [
      {
        label: `${productName} - Nhập`,
        data: product.import,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: `${productName} - Xuất`,
        data: product.export,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ];
  }).flat(); // Flatten the array of datasets

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
