import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { subDays, format, isSameDay } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Xử lý dữ liệu
function processChartData(stocks) {
  const labels = [];
  const importData = [];
  const exportData = [];

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const label = format(date, 'MM/dd');
    labels.push(label);

    const dayStocks = stocks.filter((stock) => {
      const stockDate = new Date(stock.createdAt);
      stockDate.setHours(0, 0, 0, 0); // Normalize time to midnight
      date.setHours(0, 0, 0, 0); // Normalize time to midnight
      return isSameDay(stockDate, date); // dùng createdAt thay vì date
    });

    const totalImport = dayStocks.filter(stock => stock.type === 'import').reduce((sum, s) => sum + (s.quantity || 0), 0);
    const totalExport = dayStocks.filter(stock => stock.type === 'export').reduce((sum, s) => sum + (s.quantity || 0), 0);

    importData.push(totalImport);
    exportData.push(totalExport);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Nhập',
        data: importData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Xuất',
        data: exportData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
}

// Cấu hình biểu đồ
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

// Component hiển thị biểu đồ
export default function ImportExportChart() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://study-language-backend-cpm6.vercel.app/stocks/history') // Đổi URL thành API của bạn
      .then((response) => response.json())
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []); // Chỉ gọi một lần khi component mount

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (stocks.length === 0) {
    return <p>No stock data available.</p>;
  }

  const chartData = processChartData(stocks);

  return <Bar options={options} data={chartData} />;
}
