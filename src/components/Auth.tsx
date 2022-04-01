import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'



const Auth = () => {


  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}


export default Auth
