import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
