// import logo from './logo.svg';
import './App.css';
import { BrowserRouter} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainNavigation } from './components/MainNavigation';
import { Footer } from './components/footers/Footer';
import { Headers } from './components/headers/Headers';
import { AuthWrapper } from './context/auth.context';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { CartWrapper } from './context/cart.context';
const theme = createTheme();
const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthWrapper>
            <CartWrapper>
              <Headers/>
              <ToastContainer />
              <MainNavigation />
              <Footer/>
            </CartWrapper>
          </AuthWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
