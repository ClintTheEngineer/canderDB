import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Constants } from "./Constants";

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            const response = await fetch(`${Constants.SERVER_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            const data = await response.json();

            if(response.status === 200) {
                setMessage(`${Object.keys(data)[0]}, Re-directing to home page`)
                setTimeout(() => {
                    navigate('/login')
                }, 3000);
            } else {
                setMessage('Password reset request failed')
            }
        } catch (error) {
            console.error('Error sending password reser request:', error);
            setMessage('An error occurred while sending the request');
        }
    }

  return (
    <div>
      <h2 id='forgot-hdr'>Forgot Password</h2>
      <p id='email-txt'>Enter your email address to reset your password.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button id='reset-btn' onClick={handleResetPassword}>Reset Password</button>
      {<p>{message}</p>}
    </div>
  )
}
