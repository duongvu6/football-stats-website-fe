import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import ErrorPage from "./pages/error.jsx";
import { AuthWrapper } from './components/context/auth.context.jsx';
// import './style/global.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthWrapper>
        <RouterProvider router={router} />
      </AuthWrapper>
    </React.StrictMode>,
)