import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar bg-blue-800 text-white w-64 fixed h-full">
            <div className="p-4 flex items-center justify-between border-b border-blue-700">
                <div className="flex items-center">
                    <span className="nav-text text-xl font-bold">Quản Lý Kho</span>
                </div>
                <button id="toggleSidebar" className="text-white focus:outline-none">
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            <nav className="mt-4">
                <Link
                    to="/"
                    className={`flex items-center py-3 px-6 hover:bg-blue-700 ${isActive("/") ? "bg-blue-700" : ""}`}
                >
                    <i className="fas fa-tachometer-alt mr-3"></i>
                    <span className="nav-text">Trang chủ</span>
                </Link>
                <Link
                    to="/product"
                    className={`flex items-center py-3 px-6 hover:bg-blue-700 ${isActive("/prduct") ? "bg-blue-700" : ""}`}
                >
                    <i className="fas fa-boxes mr-3"></i>
                    <span className="nav-text">Sản phẩm</span>
                </Link>
                <Link
                    to="/stock"
                    className={`flex items-center py-3 px-6 hover:bg-blue-700 ${isActive("/stock") ? "bg-blue-700" : ""}`}
                >
                    <i className="fas fa-sign-in-alt mr-3"></i>
                    <span className="nav-text">Nhập / Xuất Kho</span>
                </Link>
            </nav>
        </div>
    );
}
