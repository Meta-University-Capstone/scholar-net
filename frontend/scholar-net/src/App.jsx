import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Authentication/Login'
import Register from './Authentication/Register'
import Home from './Website Pages/Home'
import Search from './Website Pages/Search'
import ProfilePage from './Website Pages/ProfilePage'
import OtherUserProfile from './Website Pages/OtherUserProfile'
import CompareChart from './Data Visualization/CompareChart'



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
