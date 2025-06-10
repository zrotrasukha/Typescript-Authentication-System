import { Route, Routes } from 'react-router-dom';
import { Button } from './components/ui/button';
import Login from './pages/Login';
import {Register} from './pages/Register';
import { VerifyCode } from './pages/verifyEmail';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p >This is the home page of our application.</p>
      <Button className='border-2 border-white ' > kuchh bhar do</Button>
    </div>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email/verify/:code" element={<VerifyCode />} />
    </Routes>
  )
}

export default App
