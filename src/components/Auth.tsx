import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'



const Auth = () => {


  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}


export default Auth
