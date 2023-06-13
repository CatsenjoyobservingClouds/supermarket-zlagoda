import React from 'react'
import AuthForm, {AuthFormProps} from '../components/AuthForm';

const Login: React.FC<AuthFormProps> = ({onLogin}) => {
  return (
    <main>
        <AuthForm onLogin={onLogin}/>
    </main>
  )
}

export default Login;