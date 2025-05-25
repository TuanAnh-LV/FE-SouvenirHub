import React, { lazy } from 'react'

// Lazy load components
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/about'))
const Contact = lazy(() => import('../pages/contact'))

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
]

export default routes