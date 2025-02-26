import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import ErrorPage from "./pages/error.jsx";
import { AuthWrapper } from './components/context/auth.context.jsx';
import PlayerPage from "./pages/players.jsx";
import ClubPage from "./pages/clubs.jsx";
import CoachPage from "./pages/coaches.jsx";
import AdminPage from "./pages/admin.jsx";
import PrivateRoute from "./pages/private.route.jsx";
// import './style/global.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "players",
        element: <PlayerPage />,
      },
      {
        path: "clubs",
        element: <ClubPage />,
      },
      {
        path: "coaches",
        element: <CoachPage />,
      },
      {
        path: "admin",

        element:
        <PrivateRoute>
          <AdminPage />
        </PrivateRoute>

      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthWrapper>
        <RouterProvider router={router} />
      </AuthWrapper>
    </React.StrictMode>,
);