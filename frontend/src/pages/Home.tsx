import React, { MouseEventHandler } from 'react'
import NavBar from '../components/NavBar'
import '../css-files/Home.css';

interface HomeProps {
    user: string | null
    onLogout: MouseEventHandler<HTMLButtonElement>
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
    return (
        <main className='margin-top home-container'>
            <h2 className="mb-12 text-6xl main-text">You are signed in as {user}</h2>
            <h3 className='mb-10 text-2xl'>Have a great experience navigating through our website</h3>
            <button type="submit" className="my-button" onClick={onLogout}>
                Sign out
            </button>
        </main>
    )
}

export default Home;