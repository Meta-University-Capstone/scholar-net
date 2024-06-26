import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Search from './Search'


function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={user ? <Home /> : <Login />} /> */}
        <Route path ='/' element={<Home/>}/>
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </Router>
  )
}

export default App
