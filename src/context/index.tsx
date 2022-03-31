import UserContextProvider, {useAuthContext} from './user'

export {
  useAuthContext
}

const Store = ({children}) => {


  return (
    <UserContextProvider>
        {children}
    </UserContextProvider>
  )
}


export default Store
