import React, { useState, useEffect } from "react";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        code: "",
        name: "",
        price: "",
        unit: "",
        description: "",
        quantity: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch products from API on component mount
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

    // Handle edit product
    const handleEdit = (_id) => {
        alert(`Edit product with _id: ${_id}`);
    };

    // Handle delete product
    const handleDelete = async (_id) => {
        try {
            await fetch(`https://study-language-backend-cpm6.vercel.app/products/${_id}`, {
                method: "DELETE",
            });

            const updatedProducts = products.filter((product) => product._id !== _id);
            setProducts(updatedProducts);
            alert(`Product with _id: ${_id} has been deleted`);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Handle add product
    const handleAddProduct = async () => {
        if (!newProduct.code || !newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.quantity || !newProduct.description) {
            alert("Please fill out all fields");
            return;
        }

        const addedProduct = {
            code: newProduct.code,
            name: newProduct.name,
            price: parseInt(newProduct.price), // Ensure price is an integer
            unit: newProduct.unit,
            quantity: parseInt(newProduct.quantity), // Ensure quantity is an integer
            description: newProduct.description,
        };

        try {
            await fetch("https://study-language-backend-cpm6.vercel.app/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addedProduct),
            });

            // Assuming the backend returns the added product with an _id
            setProducts([...products, addedProduct]);
            setNewProduct({ code: "", name: "", price: "", unit: "", description: "", quantity: "" });
            setIsModalOpen(false);
            alert("Product added successfully!");

        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="main-content flex-1 ml-64 p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Quản lý sản phẩm</h1>

                <div className="mb-8 flex justify-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
                    >
                        + Thêm sản phẩm
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Giao Dịch Gần Đây</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SP</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product, index) => {
                                    return (
                                        <tr key={index} className="">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product?.name || "Unknown"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.quantity}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${stock.type === "import" ? "text-green-600" : "text-red-600"}`}>
                                                {stock.type === "import" ? "Nhập kho" : "Xuất kho"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(stock.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                                                <i className="fas fa-check-circle mr-1"></i> Hoàn thành
                                            </td> */}
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

                {/* Modal for adding a new product */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm sản phẩm mới</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.code}
                                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                                    placeholder="Enter product code"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Giá</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    placeholder="Enter product price"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.unit}
                                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                    placeholder="Enter product unit"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                    placeholder="Enter product quantity"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    className="w-full border border-gray-300 px-4 py-2 mt-1 rounded-lg"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Enter product description"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
