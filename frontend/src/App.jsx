import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import EditApplication from "./pages/EditApplication";
import ApplicationDetails from "./pages/ApplicationDetails";
import AIAnalyzer from "./pages/AIAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/add"
          element={
            <ProtectedRoute>
              <AddApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/edit/:id"
          element={
            <ProtectedRoute>
              <EditApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />

        <Route
  path="/ai-analyzer"
  element={
    <ProtectedRoute>
      <AIAnalyzer />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

