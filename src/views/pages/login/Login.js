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
import { cilLockLocked, cilUser } from '@coreui/icons'
import axiosInstance from 'src/axiosInstance'

const Login = () => {
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors({})

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
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Get OTP</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    {errors.email && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</p>}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </CInputGroup>

                    {errors.mobileNumber && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.mobileNumber}</p>}

                    {errors.general && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.general}</p>}

                    <CRow className="mt-3">
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Get OTP
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
