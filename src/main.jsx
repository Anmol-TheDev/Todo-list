import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Home } from './component/Home/home'
import SignIN from './component/auth/auth'
import TodoPage from './component/Home/todoPage.jsx'
import {  createBrowserRouter,RouterProvider} from "react-router-dom"

  const router =createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/auth',
      element:<SignIN/>
    },
    {
      path:"/todo",
      element:<TodoPage/>
    }
  ])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </React.StrictMode>
)
