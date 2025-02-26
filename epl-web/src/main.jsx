import React, {useContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import ErrorPage from "./pages/error.jsx";
import { AuthWrapper, AuthContext } from './components/context/auth.context.jsx';

import PrivateRoute from "./pages/private.route.jsx";
import PlayerPage from "./pages/client/players.jsx";

import ClubPage from "./pages/client/clubs.jsx";
import CoachPage from "./pages/client/coaches.jsx";
import AdminPage from "./pages/admin/admin.jsx";
import AdminPlayerPage from "./pages/admin/players.jsx";
import AdminClubPage from "./pages/admin/clubs.jsx";
import AdminCoachPage from "./pages/admin/coaches.jsx";
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
        element: (
            <AuthContext.Consumer>
              {({ user }) => (
                  user.role === "ADMIN" ? <Navigate to="/admin/players" /> : <PlayerPage />
              )}
            </AuthContext.Consumer>
        ),
      },
      {
        path: "admin/players",
        element: (
            // <AuthContext.Consumer>
            //   {({ user }) => (
            //       user.role === "ADMIN" ? <AdminPlayerPage /> : <Navigate to="/players" />
            //   )}
            // </AuthContext.Consumer>

            //another way
            <PrivateRoute>
              <AdminPlayerPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/clubs",
        element: (
            // <AuthContext.Consumer>
            //   {({ user }) => (
            //       user.role === "ADMIN" ? <AdminClubPage /> : <Navigate to="/clubs" />
            //   )}
            // </AuthContext.Consumer>

            <PrivateRoute>
              <AdminClubPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/coaches",
        element: (
            // <AuthContext.Consumer>
            //   {({ user }) => (
            //       user.role === "ADMIN" ? <AdminCoachPage /> : <Navigate to="/coaches" />
            //   )}
            // </AuthContext.Consumer>

            <PrivateRoute>
              <AdminCoachPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "clubs",
        element: (
            // <AuthContext.Consumer>
            //   {({ user }) => (
            //       user.role === "ADMIN" ? <Navigate to="/admin/clubs" /> : <ClubPage />
            //   )}
            // </AuthContext.Consumer>

            <ClubPage/>
        ),
      },
      {
        path: "coaches",
        element:(
            // <AuthContext.Consumer>
            //   {({ user }) => (
            //       user.role === "ADMIN" ? <Navigate to="/admin/coaches" /> :  <CoachPage />
            //   )}
            // </AuthContext.Consumer>
            <CoachPage/>
        )
      },
      {
        path: "admin",
        element: (
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
        ),
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