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

import PrivateRoute from "./pages/private.route.jsx";
import PlayerPage from "./pages/client/players.jsx";

import ClubPage from "./pages/client/clubs.jsx";
import CoachPage from "./pages/client/coaches.jsx";
import AdminPage from "./pages/admin/admin.jsx";
import AdminPlayerPage from "./pages/admin/players.jsx";
import AdminClubPage from "./pages/admin/clubs.jsx";
import AdminCoachPage from "./pages/admin/coaches.jsx";
import AdminPlayerDetail from "./components/admin/player/player.detail.jsx";
import ClientPlayerDetail from "./components/client/player/player.detail.jsx";
import ClientCoachDetail from "./components/client/coach/coach.detail.jsx";
import AdminCoachDetail from "./components/admin/coach/coach.detail.jsx";
import AdminLeaguePage from "./pages/admin/leagues.jsx";
import ClientLeaguePage from "./pages/client/leagues.jsx";
import LeagueDetailPage from "./components/client/league/league.detail.jsx";
import AdminLeagueDetailPage from "./components/admin/league/league.detail.jsx";
import LeagueSeasonDetail from "./pages/admin/league-season.detail.jsx";
import MatchActionPage from "./components/admin/league-season/match/match.actions.jsx";
import AdminClubDetail from "./components/admin/club/club.detail.jsx";
import ClientClubSeasonDetail from "./components/client/club/club.detail.jsx";
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
            <PlayerPage/>
        ),
      },
      {
        path: "players/:id",
        element: (
            <ClientPlayerDetail/>
        ),
      },
      {
        path: "admin/players",
        element: (
            <PrivateRoute>
              <AdminPlayerPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/players/:id",
        element: (
            <PrivateRoute>
              <AdminPlayerDetail/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/clubs",
        element: (

            <PrivateRoute>
              <AdminClubPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/clubs/:id",
        element: (
            <PrivateRoute>
              <AdminClubDetail/>
            </PrivateRoute>
        ),
      },
      {
        path: "clubs/:id",
        element: (
            <ClientClubSeasonDetail/>
        ),
      },
      {
        path: "admin/coaches",
        element: (
            <PrivateRoute>
              <AdminCoachPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/coaches/:id",
        element: (
            <PrivateRoute>
              <AdminCoachDetail/>
            </PrivateRoute>
        ),
      },
      {
        path: "clubs",
        element: (
            <ClubPage/>
        ),
      },
      {
        path: "coaches",
        element:(
            <CoachPage/>
        )
      },
      {
        path: "coaches/:id",
        element: (
            <ClientCoachDetail/>
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
      {
        path: "leagues",
        element: (
            <ClientLeaguePage/>
        ),
      },
      {
        path: "admin/leagues",
        element: (
            <PrivateRoute>
              <AdminLeaguePage/>
            </PrivateRoute>
        ),
      },
      {
        path: "leagues/:id",
        element: (
            <LeagueDetailPage/>
        ),
      },
      {
        path: "admin/leagues/:id",
        element: (
            <PrivateRoute>
              <AdminLeagueDetailPage/>
            </PrivateRoute>
        ),
      },
      {
        path: "admin/league-seasons/:id",
        element: (
            <PrivateRoute>
              <LeagueSeasonDetail />
            </PrivateRoute>
        ),
      },
      {
        path: "admin/match-actions/:id",
        element: (
            <PrivateRoute>
              <MatchActionPage />
            </PrivateRoute>
        ),
      }
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