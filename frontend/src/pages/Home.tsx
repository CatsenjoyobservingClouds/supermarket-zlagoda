import React, { MouseEventHandler } from 'react'
import NavBar from '../components/NavBar'

interface HomeProps {
    user: string
    onLogout: MouseEventHandler<HTMLButtonElement>
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
    return (
        <>
            <main>
                <h2>You are signed in as {user} !</h2>
                <h3>Have a great experience navigating through our data</h3>
                <button type="button" className="btn btn-primary ms-5 btn-lg" onClick={onLogout}>
                    Change password
                </button>
                <button type="button" className="btn btn-danger ms-5 btn-lg" onClick={onLogout}>
                    Sign out
                </button>
            </main>
        </>
    )
}

export default Home;