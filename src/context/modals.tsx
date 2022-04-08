import {useState, useContext, createContext} from 'react'


type ModalsContextType = {
    newBoardModal: boolean,
    newBoardModalUpdateMode: string,
    setNewBoardModal: (val: boolean, updateBoardId: string) => void,
}

const ModalsContext = createContext<ModalsContextType>({
    newBoardModal: false,
    newBoardModalUpdateMode: '',
    setNewBoardModal: (val:boolean, updateBoardId:string) => {}
})

export const useModalsContext = () => useContext(ModalsContext)

const ModalsContextProvider: React.FC = ({children}) => {
    const [newBoardModal, setNewBoardModal] = useState(false)
    const [newBoardModalUpdateMode, setNewBoardModalUpdateMode] = useState('')

    const setNewBoardModalHandler = (val:boolean, updateBoardId:string) => {
        setNewBoardModal(val)
        setNewBoardModalUpdateMode(updateBoardId)
    }

    return (
        <ModalsContext.Provider value={{newBoardModal, newBoardModalUpdateMode, setNewBoardModal: setNewBoardModalHandler}}>
            {children}
        </ModalsContext.Provider>
    )
}
export default ModalsContextProvider