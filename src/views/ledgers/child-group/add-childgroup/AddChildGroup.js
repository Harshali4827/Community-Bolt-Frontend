import React, { useEffect, useState } from "react";
import '../../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { jwtDecode } from "jwt-decode";
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {cilGarage,cilCheckCircle} from '@coreui/icons';

function AddChildGroup(){
const [formData, setFormData] = useState({
        child_group_name: '',
        status:'',
        ip_address: '',
        created_by:''
      });
    
      const [errors, setErrors] = useState({});
      const navigate = useNavigate();
      
      const getIPAddress = async () => {
      try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
      } catch (error) {
          console.error("Error fetching IP address:", error);
          return '';
      }
  };
    
    useEffect(() => {
      const fetchUserData = async () => {
          try {
              const token = localStorage.getItem("token");
              if (token) {
                  const decodedToken = jwtDecode(token);
                  const userId = decodedToken.userId; 

                  const ip = await getIPAddress();

                  setFormData((prevData) => ({
                      ...prevData,
                      created_by: userId,
                      ip_address: ip
                  }));
              }
          } catch (error) {
              console.error("Error decoding token:", error);
          }
      };

      fetchUserData();
  }, []);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};

        if (!formData.child_group_name) formErrors.child_group_name = 'required';
        if (!formData.status) formErrors.status = 'Status is required';
        if (!formData.ip_address) formErrors.ip_address = 'IP address is required';
        if (!formData.created_by) formErrors.created_by = 'This field is required';
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.post('/ledger-childgroup',formData);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
      
          Toast.fire({
            icon: "success",
            title:"Data Saved Successfully!"
          });
      
          navigate('/ledgers/childgroup-list');
        } catch (error) {
          console.error("Error details:", error);
          if (error.response && error.response.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: error.response.data.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      };

   const handleCancel = ()=> {
           navigate('/ledgers/childgroup-list') 
    }
    
  return(
  
    <div className="form-container">
      <div className="page-header">
   <form onSubmit={handleSubmit}>
   <div className="form-note" style={{ textAlign: "right", marginBottom: "10px" }}>
            <span className="required">*</span> Field is mandatory
          </div>
       <div className="user-details">
        <div className="input-box">
          <div className="details-container">
              <span className="details">Child group name</span>
              <span className="required">*</span>
        </div>
        <CInputGroup>
        <CInputGroupText className="input-icon">
           <CIcon icon={cilGarage} />
        </CInputGroupText>
         <CFormInput
            type="text"
            name="child_group_name"
            value={formData.child_group_name}
            onChange={handleChange}
          />
       </CInputGroup>
             {errors.child_group_name && <p className="error">{errors.child_group_name}</p>}
        </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Status</span>
        <span className="required">*</span>
        </div>
        <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilCheckCircle} />
    </CInputGroupText>
    <CFormSelect
      name="status"
      value={formData.status}
      onChange={handleChange}
    >
      <option value="">-Select-</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </CFormSelect>
      </CInputGroup>
       {errors.status && <p className="error">{errors.status}</p>}
      </div>
     </div>
    <div className="button-row">
      <button type="submit" className="simple-button primary-button">Save</button>
      <button type="button" className="simple-button secondary-button" onClick={handleCancel} >Cancel</button>
     </div>
  </form>
</div>
</div>
  )
};
export default AddChildGroup;