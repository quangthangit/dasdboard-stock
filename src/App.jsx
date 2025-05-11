import { Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css'
import Layout from './component/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import StockPage from './pages/StockPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='product' element={<ProductPage />} />
          <Route path='stock' element={<StockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
