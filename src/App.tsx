import { Box } from '@chakra-ui/react'
import AppRoutes from './components/AppRoutes'
import Auth from './components/Auth'
import { useAuthContext } from './context'

function App() {

  const { user } = useAuthContext()


  return (
    <Box w='full' h="full">
      {!user ? <Auth /> : <AppRoutes />}
    </Box>
  );
}

export default App;
