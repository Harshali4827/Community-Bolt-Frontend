import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBookmark, cilBuilding, cilCheckCircle,cilClipboard,cilEnvelopeClosed,cilGrid,cilHome, cilImage, cilMedicalCross, cilPhone, cilUser } from '@coreui/icons';
function AddUser(){
  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    mobile_number: '',
    email:'',
    pan_number :'',
    aadhar_number:'',
    ip_address :'',
    profile_photo:'',
    blood_group:''
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
                    user_category: userId,
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
  const { name, value, type, files } = e.target;
  if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  let formErrors = {};

  if (!formData.title) formErrors.title = 'This field is required';
  if (!formData.full_name) formErrors.full_name = 'This field is required';
  if (!formData.mobile_number ) formErrors.mobile_number = 'This field is required';
  if (!formData.email) formErrors.status = 'This field is required';
  if (!formData.pan_number) formErrors.pan_number = 'This field is required';
  if (!formData.aadhar_number) formErrors.aadhar_number = 'This field is required';

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  const form = new FormData();
  for (let key in formData) {
      form.append(key, formData[key]);
  }
  console.log("Form Data:", Object.fromEntries(form.entries()));

  try {
    const response = await axiosInstance.post('/register',form,{
      headers: { "Content-Type": "multipart/form-data", }
     });
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

    navigate('/users/users-list');
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
     navigate('/users/users-list') 
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
              <span className="details">Title</span>
              <span className="required">*</span>
            </div>
                <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilBookmark} />
    </CInputGroupText>
    <CFormSelect
      name="title"
      value={formData.title}
      onChange={handleChange}
    >
        <option value="">-Select-</option>
                    <option value="Mr.">Mr</option>
                    <option value="Mrs.">Mrs</option>
    </CFormSelect>
      </CInputGroup>
          {errors.title && <p className="error">{errors.title}</p>}
          </div>

          <div className="input-box">
            <div className="details-container">
              <span className="details">Full name</span>
              <span className="required">*</span>
            </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
           <CFormInput
               type="text"
               name="full_name"
               value={formData.full_name}
               onChange={handleChange}
             />
             </CInputGroup>
          {errors.full_name && <p className="error">{errors.full_name}</p>}
          </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Mobile number</span>
        <span className="required">*</span>
        </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
           <CFormInput
               type="text"
               name="mobile_number"
               value={formData.mobile_number}
               onChange={handleChange}
             />
             </CInputGroup>
          {errors.mobile_number && <p className="error">{errors.mobile_number}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Email</span>
        <span className="required">*</span>
        </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
           <CFormInput
               type="text"
               name="email"
               value={formData.email}
               onChange={handleChange}
             />
             </CInputGroup>
          {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Pan number</span>
        <span className="required">*</span>
        </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilClipboard} /></CInputGroupText>
           <CFormInput
               type="text"
               name="pan_number"
               value={formData.pan_number}
               onChange={handleChange}
             />
             </CInputGroup>
          {errors.pan_number && <p className="error">{errors.pan_number}</p>}
      </div>
      
      <div className="input-box">
      <div className="details-container">
        <span className="details">Aadhar number</span>
        <span className="required">*</span>
        </div>
                 <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilClipboard} /></CInputGroupText>
           <CFormInput
               type="text"
               name="aadhar_number"
               value={formData.aadhar_number}
               onChange={handleChange}
             />
             </CInputGroup>
          {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
      </div>
       <div className="input-box">
              <span className="details">Profile photo</span>
              <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilImage} /></CInputGroupText>
           <CFormInput
               type="text"
               name="profile_photo"
               value={formData.profile_photo}
               onChange={handleChange}
               accept="image/*"
             />
             </CInputGroup>
      </div>
      <div className="input-box">
        <span className="details">Blood group</span>
          <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilMedicalCross} /></CInputGroupText>
           <CFormInput
               type="text"
               name="blood_group"
               value={formData.blood_group}
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
export default AddUser;