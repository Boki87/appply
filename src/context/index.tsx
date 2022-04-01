import { ReactChild } from 'react'
import UserContextProvider, { useAuthContext } from './user'

export {
  useAuthContext
}


type StoreProps = {
  children?: | ReactChild | ReactChild[]
}


const Store = ({ children }: StoreProps) => {


  return (
    <UserContextProvider>
      {children}
    </UserContextProvider>
  )
}


export default Store
