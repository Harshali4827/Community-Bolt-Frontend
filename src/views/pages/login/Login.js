import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed} from '@coreui/icons'
import axiosInstance from 'src/axiosInstance'
import loader from '../../../assets/images/cb_logo_100.gif'
import logo from '../../../assets/images/logo.svg'
import './login.css';
const Login = () => {
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const response = await axiosInstance.post('/check-email', { email, mobileNumber })

      if (response.status === 200) {
        navigate('/verify-otp', { state: { email } })
      }
    } catch (error) {
      const errorMsg = error.response?.data || 'Login failed. Please try again.'

      if (error.response?.status === 404) {
        setErrors({ email: 'User not found with this email.' })
      } else {
        setErrors({ general: typeof errorMsg === 'string' ? errorMsg : 'Something went wrong.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
<>
    {loading && (
      <div className="full-loader">
        <img src={loader} alt="Loading..." />
      </div>
    )}
    <div className="login-background"></div>
    <div className="login-container">
      <div className="text-center mb-2">
        <img src={logo} className='login-logo' alt="Logo"/>
      </div>
       <CContainer>
    <CRow className="justify-content-center">
      <CCol md={4}>
        <CCardGroup>
          <CCard className="p-4">
            <CCardBody>
              <CForm onSubmit={handleLogin}>
                <h2 className="text-center">Community Bolt</h2>
                <p className="text-body-secondary text-center">Sign In to your account</p>

                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilEnvelopeClosed} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </CInputGroup>
                {errors.email && <p className="text-danger small">{errors.email}</p>}

                {/* <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </CInputGroup> */}
                {errors.mobileNumber && <p className="text-danger small">{errors.mobileNumber}</p>}
                {errors.general && <p className="text-danger small">{errors.general}</p>}

                <div className="d-flex justify-content-center mt-3">
                  <CButton type="submit" color="primary" className="px-5" disabled={loading}>
                    Get OTP
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
      <div className="text-center mt-4 text-muted small">
        © {new Date().getFullYear()} Community Bolt. All rights reserved.
      </div>
    </div>
  </>
  )
}

export default Login
