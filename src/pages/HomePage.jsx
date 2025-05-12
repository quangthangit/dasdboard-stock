import { useEffect, useState } from "react";
import ImportExportChart from "../component/ImportExportChart";
import TopProductsChart from "../component/TopProductsChart";
import { subDays, format } from 'date-fns';
export default function HomePage() {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalImportCurrentWeek, setTotalImportCurrentWeek] = useState(0);
    const [totalExportCurrentWeek, setTotalExportCurrentWeek] = useState(0);
    const [totalImportLastWeek, setTotalImportLastWeek] = useState(0);
    const [totalExportLastWeek, setTotalExportLastWeek] = useState(0);

    // Fetch stocks and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStocks = await fetch("https://study-language-backend-cpm6.vercel.app/stocks/history");
                const stockData = await resStocks.json();
                setStocks(stockData);

                // Calculate totals for this week and last week
                const currentWeekStocks = stockData.filter(stock => {
                    const stockDate = new Date(stock.createdAt);
                    const today = new Date();
                    return (
                        stockDate >= subDays(today, 7) && stockDate <= today
                    );
                });

                const lastWeekStocks = stockData.filter(stock => {
                    const stockDate = new Date(stock.createdAt);
                    const lastWeekStart = subDays(new Date(), 14);
                    const lastWeekEnd = subDays(new Date(), 8);
                    return stockDate >= lastWeekStart && stockDate <= lastWeekEnd;
                });

                // Calculate totals for this week
                const currentWeekImport = currentWeekStocks.filter(stock => stock.type === 'import').reduce((total, stock) => total + stock.quantity, 0);
                const currentWeekExport = currentWeekStocks.filter(stock => stock.type === 'export').reduce((total, stock) => total + stock.quantity, 0);

                // Calculate totals for last week
                const lastWeekImport = lastWeekStocks.filter(stock => stock.type === 'import').reduce((total, stock) => total + stock.quantity, 0);
                const lastWeekExport = lastWeekStocks.filter(stock => stock.type === 'export').reduce((total, stock) => total + stock.quantity, 0);

                setTotalImportCurrentWeek(currentWeekImport);
                setTotalExportCurrentWeek(currentWeekExport);
                setTotalImportLastWeek(lastWeekImport);
                setTotalExportLastWeek(lastWeekExport);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const dummyStocks = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date: format(date, 'yyyy-MM-dd'),
            importQty: Math.floor(Math.random() * 100),
            exportQty: Math.floor(Math.random() * 100),
        };
    });
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://study-language-backend-cpm6.vercel.app/products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Calculate percentage change for import and export
    const calculatePercentageChange = (current, last) => {
        if (last === 0) return current > 0 ? 100 : 0; // If last week is 0, set 100% increase if current > 0, otherwise 0
        return ((current - last) / last) * 100;
    };
    const calculateStock = (stocks) => {
        const currentWeekData = stocks.filter(stock => {
            const stockDate = new Date(stock.date);
            const today = new Date();
            const weekStart = subDays(today, today.getDay());  // Ngày đầu tuần hiện tại (Chủ nhật)
            return stockDate >= weekStart;
        });

        const lastWeekData = stocks.filter(stock => {
            const stockDate = new Date(stock.date);
            const today = new Date();
            const lastWeekStart = subDays(today, today.getDay() + 7);  // Ngày đầu tuần trước
            const lastWeekEnd = subDays(today, today.getDay() + 1);   // Ngày cuối tuần trước (Thứ bảy)
            return stockDate >= lastWeekStart && stockDate <= lastWeekEnd;
        });

        const currentWeekImport = currentWeekData.reduce((total, stock) => {
            return stock.type === "import" ? total + stock.importQty : total;
        }, 0);

        const currentWeekExport = currentWeekData.reduce((total, stock) => {
            return stock.type === "export" ? total + stock.exportQty : total;
        }, 0);

        const lastWeekImport = lastWeekData.reduce((total, stock) => {
            return stock.type === "import" ? total + stock.importQty : total;
        }, 0);

        const lastWeekExport = lastWeekData.reduce((total, stock) => {
            return stock.type === "export" ? total + stock.exportQty : total;
        }, 0);

        // Tính tồn kho
        const currentStock = currentWeekImport - currentWeekExport;
        const lastStock = lastWeekImport - lastWeekExport;

        return {
            currentStock,
            lastStock,
        };
    };

    const { currentStock, lastStock } = calculateStock(dummyStocks);

    console.log(`Tồn kho hiện tại: ${currentStock}`);
    console.log(`Tồn kho tuần trước: ${lastStock}`);

    return (
        <div className="main-content flex-1 ml-64 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Thống Kê Hàng Hóa</h1>
                <p className="text-gray-600">Thống kê nhập xuất hàng hóa trong 7 ngày gần nhất</p>
            </header>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Bộ Lọc Thời Gian</h2>
                        <p className="text-gray-600">Chọn khoảng thời gian cần xem báo cáo</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input type="date" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input type="date" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-6">
                            <i className="fas fa-filter mr-2"></i> Lọc
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng nhập kho</p>
                            <h3 className="text-2xl font-bold text-blue-600">{totalImportCurrentWeek}</h3>
                            <p className="text-green-500 text-sm mt-1">
                                <i className="fas fa-arrow-up mr-1"></i> {calculatePercentageChange(totalImportCurrentWeek, totalImportLastWeek).toFixed(2)}% so với tuần trước
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <i className="fas fa-sign-in-alt text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng xuất kho</p>
                            <h3 className="text-2xl font-bold text-blue-600">{totalExportCurrentWeek}</h3>
                            <p className="text-green-500 text-sm mt-1">
                                <i className="fas fa-arrow-up mr-1"></i> {calculatePercentageChange(totalExportCurrentWeek, totalExportLastWeek).toFixed(2)}% so với tuần trước
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <i className="fas fa-sign-out-alt text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tồn kho hiện tại</p>
                            <h3 className="text-2xl font-bold text-green-600">{totalImportCurrentWeek-totalExportCurrentWeek}</h3>
                            <p className="text-green-500 text-sm mt-1">
                                <i className="fas fa-arrow-up mr-1"></i> {currentStock > lastStock ? 'Giảm' : 'Tăng'} so với tuần trước
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <i className="fas fa-boxes text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Biểu Đồ Nhập Xuất 7 Ngày</h2>
                    </div>
                    <div className="chart-container">
                        <ImportExportChart />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Top Hàng Hóa Nhập/Xuất</h2>
                        <div className="flex space-x-2">
                            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">Nhập</button>
                            <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">Xuất</button>
                        </div>
                    </div>
                    <div className="chart-container">
                        <TopProductsChart />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Giao Dịch Gần Đây</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã GD</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stocks.map((stock, index) => {
                                const product = products.find(
                                    (p) => p._id === (stock.productId._id || stock.productId)
                                );

                                return (
                                    <tr key={index} className="">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {stock._id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product?.name || "Unknown"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.quantity}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${stock.type === "import" ? "text-green-600" : "text-red-600"}`}>
                                            {stock.type === "import" ? "Nhập kho" : "Xuất kho"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {new Date(stock.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                                            <i className="fas fa-check-circle mr-1"></i> Hoàn thành
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Trước</a>
                            <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Sau</a>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">5</span> của <span className="font-medium">12</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Trước</span>
                                        <i className="fas fa-chevron-left"></i>
                                    </a>
                                    <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">3</a>
                                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Sau</span>
                                        <i className="fas fa-chevron-right"></i>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div> */}
            </div>
        </div>
    );
};
