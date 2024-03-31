import { LoginButton } from "../components/LoginButton";
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <>
    <Link to='/instances'>
    <LoginButton />
    </Link>
    </>
  )
}
