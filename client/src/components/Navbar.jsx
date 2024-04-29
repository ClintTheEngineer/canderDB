import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
    <nav id="login-nav">
        <ul className="login-list">
        <Link to='/'><li>Home</li></Link>
        <Link to='/register'><li>Sign Up</li></Link>
        <Link to='/login'><li>Login</li></Link>
        </ul>
    </nav>
    </>
  )
}
