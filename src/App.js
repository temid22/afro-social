import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Signup } from './pages/index';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

function App() {
  const { currentUser } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/login' />;
    }

    return children;
  };
  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='/'>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path='login'
              element={currentUser ? <Navigate to='/' /> : <Login />}
            />
            <Route
              path='signup'
              element={currentUser ? <Navigate to='/' /> : <Signup />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
