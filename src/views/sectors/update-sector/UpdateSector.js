import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilCheckCircle,cilHome } from '@coreui/icons';
function AddSector(){
const [formData, setFormData] = useState({
        property_id: '',
        sector_name: '',
        sector_description: '',
        status:''
     });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();
      
      useEffect(() => {
        fetchSectorData();
      }, [id])
      
      const fetchSectorData = async () => {
          try {
            const response = await axiosInstance.get(`/sectors/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching sector data:', error);
          }
        };
        useEffect(() => {
          const fetchProperty = async () => {
            try {
              const response = await axiosInstance.get('/property');
              setProperties(response.data);
            } catch (error) {
              console.error("Error fetching property:", error);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to load property',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          };
      
          fetchProperty ();
        }, []);
    
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prevData) => ({ ...prevData, [name]: value }));
          setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';

        if (!formData.sector_name) formErrors.sector_name = 'Sector name is required';

        if (!formData.status) formErrors.status = 'Status is required';

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/sectors/${id}`,formData);
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
      
          navigate('/sectors/sectors-list');
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
        navigate('/sectors/sectors-list') 
 }
 
  return(
  
    <div className="form-container">
    <div className="page-header">
    <div className="form-note" style={{ textAlign: "right", marginBottom: "10px" }}>
          <span className="required">*</span> Field is mandatory
        </div>
  <form onSubmit={handleSubmit}>
  <div className="user-details">
     <div className="input-box">
            <div className="details-container">
              <span className="details">Property Name</span>
              <span className="required">*</span>
            </div>
            <CInputGroup>
  <CInputGroupText className="input-icon">
    <CIcon icon={cilHome} />
  </CInputGroupText>
  <CFormSelect
    name="property_id"
    value={formData.property_id}
    onChange={handleChange}
  >
    <option value="">-Select Property-</option>
    {properties.map((property) => (
      <option key={property.id} value={property.id}>
        {property.property_name}
      </option>
    ))}
  </CFormSelect>
</CInputGroup>
            {errors.property_id && <p className="error">{errors.property_id}</p>}
          </div>
        
        <div className="input-box">
        <div className="details-container">
            <span className="details">Sector name</span>
            <span className="required">*</span>
         </div>
           <CInputGroup className="input-icon">
        <CInputGroupText><CIcon icon={cilBuilding} /></CInputGroupText>
         <CFormInput
             type="text"
             name="sector_name"
             value={formData.sector_name}
             onChange={handleChange}
           />
           </CInputGroup>
           {errors.sector_name && <p className="error">{errors.sector_name}</p>}
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
    <div className="input-box">
            <span className="details">Description</span>
          <textarea name="sector_description"  value={formData.sector_description} onChange={handleChange} />
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
export default AddSector;