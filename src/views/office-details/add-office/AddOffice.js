import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { jwtDecode } from "jwt-decode";
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilBuilding, cilCheckCircle,cilGrid,cilHome, cilLayers, cilPhone} from '@coreui/icons';
function AddOffice(){
const [formData, setFormData] = useState({
        property_id: '',
        property_sector_id: '',
        property_block_id: '',
        property_unit_id:'',
        office_name : '',
        office_description:'',
        office_contact:'',
        status:'',
        ip_address: '',
        created_by:''
      });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
      const [sectors, setSectors] = useState([]);
      const [blocks, setBlocks] = useState([]);
      const [units, setUnits] = useState([]);
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
              setFormData(prev => ({ ...prev, property_sector_id: "", property_block_id: "" })); 
            } catch (error) {
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
              setFormData(prev => ({ ...prev, property_block_id: "" }));
            } catch (error) {
              console.error("Error fetching blocks:", error);
            }
          };
          fetchBlocksBySector();
        }
      }, [formData.property_sector_id]);
    

      useEffect(() => {
        if (formData.property_block_id) {
          const fetchUnitsByBlock = async () => {
            try {
              const response = await axiosInstance.get(`/units/blocks/${formData.property_block_id}`);
              setUnits(response.data);
              setFormData(prev => ({ ...prev, property_unit_id: "" }));
            } catch (error) {
              console.error("Error fetching units:", error);
            }
          };
          fetchUnitsByBlock();
        }
      }, [formData.property_block_id]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

        if (name === "property_id") {
          setSectors([]);
          setBlocks([]);
          setUnits([]);
        }
        if (name === "property_sector_id") {
          setBlocks([]);
          setUnits([]);
        }
        if (name === "property_block_id") {
          setUnits([]);
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';
        if (!formData.property_sector_id) formErrors.property_sector_id = 'sectord name is required';
        if (!formData.property_block_id ) formErrors.property_block_id  = 'Block name is required';
        if (!formData.property_unit_id) formErrors.property_unit_id = 'Unit number is required';
        if (!formData.office_name) formErrors.office_name = 'Office name is required';
        if (!formData.office_contact) formErrors.office_contact = 'This fileld are required';
        if (!formData.status) formErrors.status = 'Status is required'
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.post('/offices',formData);
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
          navigate('/office-details/office-list');
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
      
    const handleCancel = () => {
      navigate('/office-details/office-list')
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
                <span className="details">Property unit</span>
                <span className="required">*</span>
              </div>
              <CInputGroup>
               <CInputGroupText className="input-icon">
                  <CIcon icon={cilLayers} />
                   </CInputGroupText>
           <CFormSelect
      name="property_unit_id"
      value={formData.property_unit_id}
      onChange={handleChange}
    >
        <option value="">-Select Unit-</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                   {unit.unit_number}
                  </option>
      ))}
    </CFormSelect>
  </CInputGroup>
              {errors.property_unit_id && <p className="error">{errors.property_unit_id}</p>}
            </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Office name</span>
        <span className="required">*</span>
        </div>
        <CInputGroup>
        <CInputGroupText className="input-icon">
           <CIcon icon={cilBriefcase} />
        </CInputGroupText>
         <CFormInput
            type="text"
            name="office_name"
            value={formData.office_name}
            onChange={handleChange}
          />
       </CInputGroup>
        {errors.office_name && <p className="error">{errors.office_name}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Contact</span>
        <span className="required">*</span>
        </div>
        <CInputGroup>
        <CInputGroupText className="input-icon">
           <CIcon icon={cilPhone} />
        </CInputGroupText>
         <CFormInput
            type="text"
            name="office_contact"
            value={formData.office_contact}
            onChange={handleChange}
          />
       </CInputGroup>
        {errors.office_contact && <p className="error">{errors.office_contact}</p>}
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
        <textarea name="office_description" value={formData.office_description} onChange={handleChange}  />
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
export default AddOffice;