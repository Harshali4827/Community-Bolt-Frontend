import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function UpdateBlock(){
const [formData, setFormData] = useState({
        property_id: '',
        property_sector_id: '',
        block_name: '',
        total_units: '',
        unit_number_start_from: '',
        unit_number_end_to: '',
        status:''
      });
    
      const [errors, setErrors] = useState({});
      const [sectors, setSectors] = useState([]);
      const [properties, setProperties] = useState([]);
      const [filteredSectors, setFilteredSectors] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();
    
      useEffect(() => {
        fetchBlockData();
      }, [id])
    
      const fetchBlockData = async () => {
        try {
          const response = await axiosInstance.get(`/blocks/${id}`);
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
        const fetchSectors = async () => {
          try {
            const response = await axiosInstance.get('/sectors');
            setSectors(response.data);
          } catch (error) {
            console.error("Error fetching sectors:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to load sectors',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        };
    
        fetchSectors();
      }, []);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

        if (name === "property_id") {
          const filtered = sectors.filter(sector => sector.property_id === parseInt(value));
          setFilteredSectors(filtered);
           setFormData(prevData => ({
            ...prevData,
            property_sector_id: ''
          }));
        }
      };

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';

        if (!formData.property_sector_id ) formErrors.property_sector_id = 'Sector name is required'

        if (!formData.block_name) formErrors.block_name = 'Block name is required';
        
        if (!formData.total_units) formErrors.block_name = 'Total Units is required';
        
        if (!formData.unit_number_start_from) formErrors.unit_number_start_from = 'This Field is required';
        
        if (!formData.unit_number_end_to) formErrors.unit_number_end_to = 'Total Units is required';

        if (!formData.ip_address) formErrors.ip_address = 'IP address is required';

        if (!formData.created_by) formErrors.created_by = 'Created by is required';

        if (!formData.status) formErrors.status = 'Status is required';

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/blocks/${id}`,formData);
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
      
          navigate('/blocks/blocks-list');
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
           navigate('/blocks/blocks-list') 
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
                <span className="details">Property</span>
                <span className="required">*</span>
              </div>
              <select name="property_id" value={formData.property_id} onChange={handleChange}>
                <option value="">-Select Property-</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_name}
                  </option>
                ))}
              </select>
              {errors.property_id && <p className="error">{errors.property_id}</p>}
            </div>
             <div className="input-box">
            <div className="details-container">
              <span className="details">Property sector</span>
              <span className="required">*</span>
            </div>
            <select name="property_sector_id" value={formData.property_sector_id} onChange={handleChange}>
                <option value="">-Select Sector-</option>
                {filteredSectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.sector_name}
                  </option>
                ))}
              </select>
            {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
        </div>
    
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Block name</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="block_name"  value={formData.block_name} onChange={handleChange} />
            {errors.block_name && <p className="error">{errors.block_name}</p>}
        </div>
    
        <div className="input-box">
            <div className="details-container">
              <span className="details">Total units</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="total_units"  value={formData.total_units} onChange={handleChange} />
            {errors.total_units && <p className="error">{errors.total_units}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Unit number start from</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="unit_number_start_from"  value={formData.unit_number_start_from} onChange={handleChange} />
            {errors.unit_number_start_from && <p className="error">{errors.unit_number_start_from}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Unit number end to</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="unit_number_end_to"  value={formData.unit_number_end_to} onChange={handleChange} />
            {errors.unit_number_end_to && <p className="error">{errors.unit_number_end_to}</p>}
        </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Status</span>
        <span className="required">*</span>
        </div>
       <select name="status" value={formData.status} onChange={handleChange} >
         <option value="">-Select-</option>
         <option value="active">Active</option>
         <option value="inactive">Inactive</option>
       </select>
       {errors.status && <p className="error">{errors.status}</p>}
      </div>

     </div>
     <hr/>
    <div className="button-row">
      <button type="submit" className="simple-button primary-button">Save</button>
      <button type="button" className="simple-button secondary-button" onClick={handleCancel} >Cancel</button>
     </div>
  </form>
</div>
</div>
  )
};
export default UpdateBlock;
