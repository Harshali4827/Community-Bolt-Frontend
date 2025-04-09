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
import { cilBuilding,cilElevator,cilGrid,cilHome, cilLayers} from '@coreui/icons';
function UpdateUnit(){
const [formData, setFormData] = useState({
        property_id: '',
        property_sector_id: '',
        property_block_id : '',
        floor_number: '',
        unit_number: ''
      });
    
      const [errors, setErrors] = useState({});
      const [sectors, setSectors] = useState([]);
      const [properties, setProperties] = useState([]);
      const [blocks, setBlocks] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();

      
      useEffect(() => {
        fetchUnitData();
      },[id])
      
      const fetchUnitData = async () => {
        try {
          const response = await axiosInstance.get(`/units/${id}`);
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

      useEffect(() => {
        if (formData.property_id) {
          const fetchSectorsByProperty = async () => {
            try {
              const response = await axiosInstance.get(`/sectors/property/${formData.property_id}`);
              setSectors(response.data);
              const sectorExists = response.data.some(sector => sector.id === formData.property_sector_id);
              if (!sectorExists){
                setFormData(prev => ({ ...prev, property_sector_id: "" }));
              }
            } 
            catch (error) {
              console.error("Error fetching sectors:", error);
            }
          };
          fetchSectorsByProperty();
        }
      }, [formData.property_id]);

      useEffect(() => {
        if (formData.property_sector_id) {
          const fetchBlocksBySector = async () => {
            try {
              const response = await axiosInstance.get(`/blocks/sectors/${formData.property_sector_id}`);
              setBlocks(response.data);
              const blockExists = response.data.some(block => block.id === formData.property_block_id);
              if (!blockExists) {
                setFormData(prev => ({ ...prev, property_block_id: "" }));
              }
            } catch (error) {
              console.error("Error fetching blocks:", error);
            }
          };
          fetchBlocksBySector();
        }
      }, [formData.property_sector_id]);      
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

        if (name === "property_id") {
          setSectors([]);
          setBlocks([]);
        }
        if (name === "property_sector_id") {
          setBlocks([]);
        }
      };

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';

        if (!formData.property_sector_id ) formErrors.property_sector_id = 'Sector name is required';

        if (!formData.property_block_id ) formErrors.property_block_id = 'Block name is required';
        
        if (!formData.floor_number ) formErrors.floor_number = 'Floor Number is required';
        
        if (!formData.unit_number) formErrors.unit_number = 'This Field is required'
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/units/${id}`,formData);
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
      
          navigate('/units/units-list');
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
           navigate('/units/units-list') 
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
              <span className="details">Property sector</span>
              <span className="required">*</span>
            </div>

    <CInputGroup>
  <CInputGroupText className="input-icon">
    <CIcon icon={cilBuilding} />
  </CInputGroupText>
  <CFormSelect
    name="property_sector_id"
    value={formData.property_sector_id}
    onChange={handleChange}
  >
    <option value="">-Select Sector-</option>
                  {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.sector_name}
                  </option>
    ))}
  </CFormSelect>
</CInputGroup>

            {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
          </div>
        
    
          <div className="input-box">
            <div className="details-container">
              <span className="details">Property block</span>
              <span className="required">*</span>
            </div>

               <CInputGroup>
  <CInputGroupText className="input-icon">
    <CIcon icon={cilGrid} />
  </CInputGroupText>
  <CFormSelect
    name="property_block_id"
    value={formData.property_block_id}
    onChange={handleChange}
  >
     <option value="">-Select Block-</option>
                  {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                         {block.block_name}
                  </option>
    ))}
  </CFormSelect>
</CInputGroup>
            {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
          </div>

         <div className="input-box">
          <div className="details-container">
            <span className="details">Floor number</span>
            <span className="required">*</span>
          </div>
          <CInputGroup className="input-icon">
        <CInputGroupText><CIcon icon={cilElevator} /></CInputGroupText>
         <CFormInput
             type="text"
             name="floor_number"
             value={formData.floor_number}
             onChange={handleChange}
           />
           </CInputGroup>
          {errors.floor_number && <p className="error">{errors.floor_number}</p>}
      </div>

      <div className="input-box">
          <div className="details-container">
            <span className="details">Unit number </span>
            <span className="required">*</span>
          </div>
          <CInputGroup className="input-icon">
        <CInputGroupText><CIcon icon={cilLayers} /></CInputGroupText>
         <CFormInput
             type="text"
             name="unit_number"
             value={formData.unit_number}
             onChange={handleChange}
           />
           </CInputGroup>
          {errors.unit_number && <p className="error">{errors.unit_number}</p>}
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
export default UpdateUnit;