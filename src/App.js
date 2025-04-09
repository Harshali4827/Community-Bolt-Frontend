import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react-pro'
import './scss/style.scss'
import './scss/examples.scss'
import VerifyOTP from './views/pages/verify-otp/VerifyOTP'
import PrivateRoute from './components/PrivateRoute'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const EmailApp = React.lazy(() => import('./views/apps/email/EmailApp'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-pro-react-admin-template-theme-bright',
  )
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/verify-otp" name="OTp Page" element={<VerifyOTP />} />
          <Route path="/apps/email/*" name="Email App" element={<EmailApp />} />
          {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}

          <Route element={<PrivateRoute />}>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
