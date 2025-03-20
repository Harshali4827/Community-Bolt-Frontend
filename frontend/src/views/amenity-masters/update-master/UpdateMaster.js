import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function UpdateMaster(){
const [formData, setFormData] = useState({
        amenity_name: '',
        amenity_details: '',
        icon_url: '',
        status:''
      });
    
      const [errors, setErrors] = useState({});
      const navigate = useNavigate();
      const {id} = useParams();
      
      useEffect(() => {
        fetchMasterData();
      }, [id])
    
        const fetchMasterData = async () => {
          try {
            const response = await axiosInstance.get(`/amenity-masters/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching amenity masters data:', error);
          }
        };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.amenity_name) formErrors.amenity_name = 'amenity name id is required';

        if (!formData.amenity_details) formErrors.amenity_details = 'amenity details is required';

        if (!formData.icon_url ) formErrors.icon_url  = 'icon url is required';

        if (!formData.status) formErrors.status = 'Status is required';
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/amenity-masters/${id}`,formData);
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
      
          navigate('/amenity-masters/amenity-masters-list');
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
           navigate('/amenity-masters/amenity-masters-list') 
    }
    
  return(
  
    <div className="form-container">
      <div className="page-header">
      <div className="form-note" style={{ textAlign: "right", marginBottom: "10px" }}>
            <span className="required">*</span> Field is mandatory
          </div>
   <form onSubmit={handleSubmit}>
    <hr/>
    <div className="user-details">
       <div className="input-box">
          <div className="details-container">
          <span className="details">Amenity Name</span>
          <span className="required">*</span>
          </div>
          <input type="text" name="amenity_name" 
                 value={formData.amenity_name} onChange={handleChange}/>
          {errors.amenity_name && <p className="error">{errors.amenity_name}</p>}
        </div>

        <div className="input-box">
          <div className="details-container">
              <span className="details">Amenity Details</span>
              <span className="required">*</span>
        </div>
             <input type="text" name="amenity_details" value={formData.amenity_details} onChange={handleChange} />
             {errors.amenity_details && <p className="error">{errors.amenity_details}</p>}
        </div>
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Icon URL</span>
              <span className="required">*</span>
            </div>
            <input type="url" name="icon_url" value={formData.icon_url} onChange={handleChange} />
            {errors.icon_url && <p className="error">{errors.icon_url}</p>}
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
export default UpdateMaster;