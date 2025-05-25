import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Loading from './app/Loading'
import { useSelector } from 'react-redux'
import routes from './routes/routes'

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading)

  return (
    <Router>
      {isLoading && <Loading />}
      <Suspense >
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App