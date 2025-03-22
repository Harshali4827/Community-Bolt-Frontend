import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function UpdateAssets(){
const [formData, setFormData] = useState({
        property_id: '',
        asset_name: '',
        asset_description: '',
        status:''
    
      });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();

      useEffect(() => {
        fetchAssetsData();
      }, [id])
    

    const fetchAssetsData = async () => {
          try {
            const response = await axiosInstance.get(`/property-assets/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching assets data:', error);
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
      
        if (!formData.property_id) formErrors.property_id = 'Property id is required';

        if (!formData.asset_name) formErrors.asset_name = 'Asset name is required';

        if (!formData.asset_description) formErrors.asset_description = 'Asset Description is required';

        if (!formData.status) formErrors.status = 'Status is required';

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/property-assets/${id}`,formData);
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
      
          navigate('/property-assets/assets-list');
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
           navigate('/property-assets/assets-list') 
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
                <span className="details">Property ID</span>
                <span className="required">*</span>
              </div>
              <select name="property_id" value={formData.property_id} onChange={handleChange}>
                <option value="">-Select Property-</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_id} (ID: {property.id})
                  </option>
                ))}
              </select>
              {errors.property_id && <p className="error">{errors.property_id}</p>}
            </div>

         <div className="input-box">
           <div className="details-container">
              <span className="details">Asset Name</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="asset_name" value={formData.asset_name} onChange={handleChange} />
             {errors.asset_name && <p className="error">{errors.asset_name}</p>}
        </div>
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Asset Description</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="asset_description"  value={formData.asset_description} onChange={handleChange} />
            {errors.asset_description && <p className="error">{errors.asset_description}</p>}
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
export default UpdateAssets;