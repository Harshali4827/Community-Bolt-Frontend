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
import {cilGarage,cilCheckCircle, cilToggleOff, cilHome, cilListRich } from '@coreui/icons';


function UpdateGate(){
const [formData, setFormData] = useState({
        property_id: '',
        gate_name: '',
        gate_description: '',
        is_main_gate: '',
        status:''
      });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();

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
      
      useEffect(() => {
        fetchGateData();
      }, [id])
    
        const fetchGateData = async () => {
          try {
            const response = await axiosInstance.get(`/gates/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching gate data:', error);
          }
        };

      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';

        if (!formData.gate_name) formErrors.gate_name = 'gate name is required';

        if (!formData.is_main_gate ) formErrors.is_main_gate  = 'This field is required';

        if (!formData.status) formErrors.status = 'Status is required'
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/gates/${id}`,formData);
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
      
          navigate('/gates/gates-list');
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
           navigate('/gates/gates-list') 
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
              <span className="details">Property</span>
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
            <span className="details">Gate name</span>
            <span className="required">*</span>
      </div>
      <CInputGroup>
      <CInputGroupText className="input-icon">
         <CIcon icon={cilGarage} />
      </CInputGroupText>
       <CFormInput
          type="text"
          name="gate_name"
          value={formData.gate_name}
          onChange={handleChange}
        />
     </CInputGroup>
           {errors.gate_name && <p className="error">{errors.gate_name}</p>}
      </div>
  <div className="input-box">
     <div className="details-container">
      <span className="details">Is main gate</span>
      <span className="required">*</span>
      </div>
      <CInputGroup>
  <CInputGroupText className="input-icon">
    <CIcon icon={cilCheckCircle} />
  </CInputGroupText>
  <CFormSelect
    name="is_main_gate"
    value={formData.is_main_gate}
    onChange={handleChange}
  >
    <option>-Select-</option>
    <option value="1">Yes</option>
    <option value="0">No</option>
  </CFormSelect>
</CInputGroup>
     {errors.is_main_gate && <p className="error">{errors.is_main_gate}</p>}
    </div>

    <div className="input-box">
    <div className="details-container">
      <span className="details">Status</span>
      <span className="required">*</span>
      </div>
      <CInputGroup>
  <CInputGroupText className="input-icon">
    <CIcon icon={cilToggleOff} />
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
            <CInputGroup>
          <CInputGroupText className="input-icon">
           <CIcon icon={cilListRich} />
        </CInputGroupText>
         <CFormInput
            type="text"
            name="gate_description"
            value={formData.gate_description}
            onChange={handleChange}
          />
       </CInputGroup>
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
export default UpdateGate;