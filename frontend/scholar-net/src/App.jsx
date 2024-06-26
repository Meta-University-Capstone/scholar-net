import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'


function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={user ? <Home /> : <Login />} /> */}
        <Route path ='/' element={<Home/>}/>
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
