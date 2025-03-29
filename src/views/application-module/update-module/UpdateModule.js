import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
function UpdateModule(){
const [formData, setFormData] = useState({
        module_name: '',
        module_description: '',
        parent_module_id: '',
        status:''
      });
    
      const [errors, setErrors] = useState({});
      const navigate = useNavigate();
      const {id} = useParams();
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };

      useEffect(() => {
        fetchModuleData();
      }, [id])
    const fetchModuleData = async () => {
          try {
            const response = await axiosInstance.get(`/application-module/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching property amenities data:', error);
          }
        };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.module_name) formErrors.module_name = 'module name id is required';

        if (!formData.module_description) formErrors.module_description = 'This field is required';

        if (!formData.parent_module_id ) formErrors.parent_module_id  = 'This field is required';

        if (!formData.status) formErrors.status = 'Status is required'
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/application-module/${id}`,formData);
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
      
          navigate('/application-module/module-list');
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
           navigate('/application-module/module-list') 
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
          <span className="details">Module name</span>
          <span className="required">*</span>
          </div>
          <input type="text" name="module_name" 
                 value={formData.module_name} onChange={handleChange}/>
          {errors.module_name && <p className="error">{errors.module_name}</p>}
        </div>

        <div className="input-box">
              <span className="details">Description</span>
             <textarea name="module_description" value={formData.module_description} onChange={handleChange} />
        </div>
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Parent module id</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="parent_module_id" value={formData.parent_module_id} onChange={handleChange} />
            {errors.parent_module_id && <p className="error">{errors.parent_module_id}</p>}
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
export default UpdateModule;