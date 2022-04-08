import { ReactChild } from 'react'
import UserContextProvider, { useAuthContext } from './user'
import BoardContextProvider, {useBoardsContext} from './board'
import ModalsContextProvider, {useModalsContext} from './modals'


export {
  useAuthContext,
  useBoardsContext,
  useModalsContext
}


type StoreProps = {
  children?: | ReactChild | ReactChild[]
}


const Store = ({ children }: StoreProps) => {


  return (
      <BoardContextProvider>
        <UserContextProvider>
          <ModalsContextProvider>
          {children}
          </ModalsContextProvider>
        </UserContextProvider>
      </BoardContextProvider>
  )
}


export default Store
