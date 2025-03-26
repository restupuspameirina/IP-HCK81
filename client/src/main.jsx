import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AuthLayout from './pages/AuthLayout'
import { Provider } from 'react-redux'
import store from './store'
import CartPage from './pages/CartPage'
import HistoryOrder from './pages/HistoryOrder'
import CreateBook from './pages/CreateBook'
import UpdateBook from './pages/UpdateBook'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

        <Route element={<AuthLayout />}>
          
            <Route path='/' element={<HomePage />} />
            <Route path='/my-orders' element={<CartPage />} />
            <Route path='/history-orders' element={<HistoryOrder />} />

            <Route path='/add-book' element={<CreateBook />} />
            <Route path='/update-book/:id' element={<UpdateBook />} />

        </Route>
      </Routes>
    </BrowserRouter>,
  </Provider>
)
