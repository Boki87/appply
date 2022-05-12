import AppRoutes from './components/AppRoutes'
import Auth from './components/Auth'
import { useAuthContext } from './context'
import NewBoardModal from './components/NewBoardModal'


function App() {

  const { user } = useAuthContext()


  return (
    <>
      {!user ? <Auth /> : <AppRoutes />}
      <NewBoardModal />
    </>
  );
}

export default App;
