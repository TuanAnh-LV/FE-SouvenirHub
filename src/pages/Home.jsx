import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  console.log('Home component rendered') // Debugging log

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => navigate('/about')}>About</button>
    </>
  )
}

export default Home
