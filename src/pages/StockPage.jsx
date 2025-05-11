import React, { useState, useEffect } from "react";

export default function StockPage() {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [newStock, setNewStock] = useState({ productId: "", quantity: "", type: "import" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch stocks and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStocks = await fetch("https://study-language-backend-cpm6.vercel.app/stocks/history");
                const stockData = await resStocks.json();
                setStocks(stockData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

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
    // Log khi products đã thay đổi
    useEffect(() => {
        console.log("Products loaded:", products);
    }, [products]);


    const handleAddStock = async () => {
        if (!newStock.productId || !newStock.quantity) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("https://study-language-backend-cpm6.vercel.app/stocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newStock,
                    quantity: parseInt(newStock.quantity),
                }),
            });

            const addedStock = await response.json();
            setStocks([...stocks, addedStock]);
            setNewStock({ productId: "", quantity: "", type: "import" });
            setIsModalOpen(false);
            alert("Stock transaction added!");
        } catch (error) {
            console.error("Error adding stock:", error);
        }
    };

    return (
        <div className="main-content flex-1 ml-64 p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Stock Management</h1>

                <div className="mb-8 flex justify-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
                    >
                        + Nhập / Xuất
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Tất Cả Giao Dịch</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã GD</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hàng Hóa</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng</th>
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
                {/* Modal for adding a new stock transaction */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm hóa đơn</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
                                <select
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newStock.productId}
                                    onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newStock.quantity}
                                    onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nhập / Xuất</label>
                                <select
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newStock.type}
                                    onChange={(e) => setNewStock({ ...newStock, type: e.target.value })}
                                >
                                    <option value="import">Nhập kho</option>
                                    <option value="export">Xuất kho</option>
                                </select>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddStock}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
