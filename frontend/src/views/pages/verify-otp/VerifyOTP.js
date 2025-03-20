import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
} from '@coreui/react-pro';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });

      if (response.status === 200) {
        toast.success('OTP Verified Successfully!', { position: "top-right" });
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data;
        if (error.response.status === 404) {
          toast.error('User not found', { position: "top-right" });
        } else if (error.response.status === 400) {
          if (errorMessage === 'Invalid OTP') {
            toast.error('Invalid OTP. Please try again.', { position: "top-right" });
          } else if (errorMessage === 'OTP Expired') {
            toast.error('OTP has expired. Please request a new one.', { position: "top-right" });
          }
        } else {
          toast.error('Something went wrong. Please try again.', { position: "top-right" });
        }
      } else {
        toast.error('Network error. Please check your connection.', { position: "top-right" });
      }
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleVerifyOTP}>
                    <h1>OTP Verification</h1>
                    <p className="text-body-secondary">Enter the OTP sent to your email</p>
                    <CFormInput
                      type="text"
                      placeholder="OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <CRow className="mt-3">
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Verify OTP
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
  );
};

export default VerifyOTP;
