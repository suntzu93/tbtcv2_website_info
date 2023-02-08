import "./App.css";
import HomePage from "./pages/home";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        allVariants: {
            fontSize:"0.875rem",
            fontFamily: `Work Sans`,
            "-webkit-font-smoothing":"antialiased",
            "-moz-osx-font-smoothing":"grayscale"
        },
    },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
        <HomePage />
    </ThemeProvider>
  );
}


export default App;
