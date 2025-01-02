import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Machines } from './pages/Machines';
import { Backups } from './pages/Backups';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/machines"
            element={
              <AuthGuard>
                <Layout>
                  <Machines />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/backups"
            element={
              <AuthGuard>
                <Layout>
                  <Backups />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Layout>
                  <Settings />
                </Layout>
              </AuthGuard>
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
