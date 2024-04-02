import { useNavigate } from 'react-router-dom'

export const HomeButton = () => {
    const navigate = useNavigate();

const handleHomeClick = () => {
    navigate('/');
}
  return (
    <button id="home-btn" onClick={handleHomeClick} title='Return to Home page'>
      Home
    </button>
  )
}