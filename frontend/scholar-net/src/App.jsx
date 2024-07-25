import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Search from './Search'
import ProfilePage from './ProfilePage'
import OtherUserProfile from './OtherUserProfile'
import CompareChart from './CompareChart'



function App() {

  return (
    <Router>
      <Routes>
        <Route path ='/' element={<Home/>}/>
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userID" element={<ProfilePage />}/>
        <Route path='/other_user/:profileID' element={<OtherUserProfile />}/>
        <Route path='/search' element={<Search />} />
        <Route path='/compare/:userID' element={<CompareChart/>}/>
      </Routes>
    </Router>
  )
}

export default App
