import { Navbar } from './components/common/Navbar';
import RoutesComponent from './routes';
import Box from '@mui/material/Box';

// Conceptual Main Layout Component (To be created in src/layouts/)
// const MainLayout = ({ children }) => (
//   <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//     <Navbar />
//     <Box component="main" sx={{ flexGrow: 1, p: 3 /* Example padding */ }}>
//       {children}
//     </Box>
//     {/* <Footer /> */}
//   </Box>
// );

function App() {
  // User info might be used for context/theming, but not routing here
  // const { userInfo } = useSelector((state) => state.auth);

  return (
      // {/* Router is now applied in main.jsx */}
      // {/* Conceptual: Apply main layout here or within RoutesComponent */}
      // {/* <MainLayout> */}
      <RoutesComponent /> 
      // {/* </MainLayout> */}
  );
}

export default App;
