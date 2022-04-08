import { Flex } from '@chakra-ui/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import Board from './Board'
import SideNav from './SideNav'


const AppRoutes = () => {

  return (
    <Flex w='full' h="full">
      <SideNav /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Flex>
  )
}


export default AppRoutes
