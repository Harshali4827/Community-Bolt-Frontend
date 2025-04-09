import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
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
import { cilHome,cilLocationPin, cilCheckCircle, cilImage, cilGlobeAlt, cilMap, cilBuilding, cilPaperPlane, cilGrid, cilViewModule, cilBriefcase, cilPool, cilDoor, cilCarAlt, cilGroup, cilBike, cilUserFemale, cilPhone, cilPeople, cilUser,cilMoney, cilToggleOff, cilEnvelopeClosed,cilChart, cilChartLine } from '@coreui/icons';

const GOOGLE_MAPS_API_KEY = "AIzaSyAyufpVzzQOm5-z0H___ZEG9pN-P-aAA8M";


function AddProperty(){
  const [formData, setFormData] = useState({
    property_name: '',
    logo: '',
    address: '',
    country_id :'',
    city_id :'',
    state_id:'',
    google_location:'',
    latitude:'',
    longitude :'',
    gst_number:'',
    total_sectors: '0',
    total_blocks: '0',
    total_units: '0',
    total_offices: '0',
    total_amenities: '0',
    total_gates: '0',
    total_parkings: '0',
    total_guest_parking: '0',
    min_sub_members_allow:'',
    min_cars_allow:'',
    min_bikes_allow:'',
    min_house_helps_allow:'',
    chairman_name:'',
    chairman_contact_no:'',
    chairman_email:'',
    emergency_name:'',
    emergency_contact_no:'',
    emergency_email:'',
    additional_parking_charges:'',
    is_payment_gateway_visible:'',
    status:'',
    ip_address: '',
    created_by:''
  });
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [searchBox, setSearchBox] = useState(null);
  const navigate = useNavigate();

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const location = place.geometry.location;

        setAddress(place.formatted_address);
        setLatitude(location.lat());
        setLongitude(location.lng());
      }
    }
  };

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

  if (!formData.property_name) formErrors.property_name = 'Property name is required';
  if (!formData.logo) formErrors.logo = 'This field is required';
  if (!formData.address ) formErrors.address = 'Address is required';
  if (!formData.status) formErrors.status = 'Status is required';
  if (!formData. country_id) formErrors.country_id = 'This field is required';
  if (!formData.city_id) formErrors.city_id = 'This field is required';
  if (!formData.state_id) formErrors.state_id  = 'This field is required';
  if (!formData.min_sub_members_allow) formErrors.min_sub_members_allow = 'This field is required';
  if (!formData.min_cars_allow ) formErrors.min_cars_allow = 'This field is required';
  if (!formData.min_bikes_allow) formErrors.min_bikes_allow = 'This field is required';
  if (!formData.min_house_helps_allow ) formErrors.min_house_helps_allow = 'This field is required';
  if (!formData.chairman_name) formErrors.chairman_name = 'This field is required';
  if (!formData.chairman_contact_no) formErrors.chairman_contact_no = 'This field is required';
  if (!formData.chairman_email) formErrors.chairman_email = 'This field is required';
  if (!formData.emergency_name) formErrors.emergency_name = 'This field is required';
  if (!formData.emergency_contact_no) formErrors.emergency_contact_no = 'This field is required';
  if (!formData.emergency_email) formErrors.emergency_email = 'This field is required';
  if (!formData.additional_parking_charges) formErrors.additional_parking_charges = 'This field is required';
  if (!formData.is_payment_gateway_visible) formErrors.is_payment_gateway_visible = 'This field is required';
  if (!formData.status) formErrors.status = 'This field is required';

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
    const response = await axiosInstance.post('/property',form,{
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

    navigate('/property/property-list');
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
     navigate('/property/property-list') 
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
              <span className="details">Property name</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
  <CInputGroupText><CIcon icon={cilHome} /></CInputGroupText>
  <CFormInput
    type="text"
    name="property_name"
    placeholder="Property Name"
    value={formData.property_name}
    onChange={handleChange}
  />
</CInputGroup>
{errors.property_name && <p className="error">{errors.property_name}</p>}
          </div>

        <div className="input-box">
              <span className="details">Logo</span>
          <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilImage} /></CInputGroupText>
           <CFormInput
                 type="file"
                 name="logo"
                 onChange={handleChange}
              />
          </CInputGroup>
          </div>
      
          <div className="input-box">
            <div className="details-container">
              <span className="details">Address</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
           <CFormInput
    type="text"
    name="address"
    placeholder="Address"
    value={formData.address}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.address && <p className="error">{errors.address}</p>}
          </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Country</span>
        <span className="required">*</span>
        </div>
         <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilGlobeAlt} /></CInputGroupText>
           <CFormInput
    type="text"
    name="country_id"
    value={formData.country_id}
    onChange={handleChange}
  />
</CInputGroup>
          
          {errors.country_id && <p className="error">{errors.country_id}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">City</span>
        <span className="required">*</span>
        </div>
<CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBuilding} /></CInputGroupText>
           <CFormInput
    type="text"
    name="city_id"
    value={formData.city_id}
    onChange={handleChange}
  />
</CInputGroup>
          
          {errors.city_id && <p className="error">{errors.city_id}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">State</span>
        <span className="required">*</span>
        </div>
<CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilMap} /></CInputGroupText>
           <CFormInput
    type="text"
    name="state_id"
    value={formData.state_id}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.state_id && <p className="error">{errors.state_id}</p>}
      </div>
      
      <div className="input-box">
        <span className="details">Google Location</span>
                 <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
           <CFormInput
    type="text"
    name="google_location"
    value={formData.google_location}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
          <div className="input-box">
              <span className="details">Latitude</span>
          <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilChartLine} /></CInputGroupText>
           <CFormInput
    type="text"
    name="latitude"
    value={formData.latitude}
    onChange={handleChange}
  />
</CInputGroup>
          </div>

          <div className="input-box">
              <span className="details">Longitude</span>
                  <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilChart} /></CInputGroupText>
           <CFormInput
    type="text"
    name="longitude"
    value={formData.longitude}
    onChange={handleChange}
  />
</CInputGroup>
          </div>
      <div className="input-box">
        <span className="details">GST number</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPaperPlane} /></CInputGroupText>
           <CFormInput
    type="text"
    name="gst_number"
    value={formData.gst_number}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
      <div className="input-box">
        <span className="details">Total sectors</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBuilding} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_sectors"
    value={formData.total_sectors}
    onChange={handleChange}
  />
</CInputGroup>
      </div>

      <div className="input-box">
        <span className="details">Total blocks</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilGrid} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_blocks"
    value={formData.total_blocks}
    onChange={handleChange}
  />
</CInputGroup>
      </div>

      <div className="input-box">
        <span className="details">Total units</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilViewModule} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_units"
    value={formData.total_units}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
      <div className="input-box">
        <span className="details">Total offices</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBriefcase} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_offices"
    value={formData.total_offices}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
      <div className="input-box">
        <span className="details">Total amenities</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPool} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_amenities"
    value={formData.total_amenities}
    onChange={handleChange}
  />
</CInputGroup>
      </div>

      <div className="input-box">
        <span className="details">Total gates</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilDoor} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_gates"
    value={formData.total_gates}
    onChange={handleChange}
  />
</CInputGroup>
      </div>

      <div className="input-box">
        <span className="details">Total parkings</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_parkings"
    value={formData.total_parkings}
    onChange={handleChange}
  />
</CInputGroup>
      </div>

      <div className="input-box">
        <span className="details">Total guest parking</span>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
           <CFormInput
    type="text"
    name="total_guest_parking"
    value={formData.total_guest_parking}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min sub members allow</span>
        <span className="required">*</span>
        </div>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilGroup} /></CInputGroupText>
           <CFormInput
    type="text"
    name="min_sub_members_allow"
    value={formData.min_sub_members_allow}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.min_sub_members_allow && <p className="error">{errors.min_sub_members_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min cars allow</span>
        <span className="required">*</span>
        </div>
          {errors.min_cars_allow && <p className="error">{errors.min_cars_allow}</p>}
          <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
           <CFormInput
    type="text"
    name="min_cars_allow"
    value={formData.min_cars_allow}
    onChange={handleChange}
  />
</CInputGroup>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min bikes allow</span>
        <span className="required">*</span>
        </div>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBike} /></CInputGroupText>
           <CFormInput
    type="text"
    name="min_bikes_allow"
    value={formData.min_bikes_allow}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.min_bikes_allow && <p className="error">{errors.min_bikes_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min house helps allow</span>
        <span className="required">*</span>
        </div>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUserFemale} /></CInputGroupText>
           <CFormInput
    type="text"
    name="min_house_helps_allow"
    value={formData.min_house_helps_allow}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.min_house_helps_allow && <p className="error">{errors.min_house_helps_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Chairman name</span>
        <span className="required">*</span>
        </div>
<CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPeople} /></CInputGroupText>
           <CFormInput
    type="text"
    name="chairman_name"
    value={formData.chairman_name}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.chairman_name && <p className="error">{errors.chairman_name}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Contact number</span>
        <span className="required">*</span>
        </div>
                 <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
           <CFormInput
    type="text"
    name="chairman_contact_no"
    value={formData.chairman_contact_no}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.chairman_contact_no && <p className="error">{errors.chairman_contact_no}</p>}
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
    name="chairman_email"
    value={formData.chairman_email}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.chairman_email && <p className="error">{errors.chairman_email}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency name</span>
        <span className="required">*</span>
        </div>
                  <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
           <CFormInput
    type="text"
    name="emergency_name"
    value={formData.emergency_name}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.emergency_name && <p className="error">{errors.emergency_name}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency contact number</span>
        <span className="required">*</span>
        </div>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
           <CFormInput
    type="text"
    name="emergency_contact_no"
    value={formData.emergency_contact_no}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.emergency_contact_no && <p className="error">{errors.emergency_contact_no}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency email</span>
        <span className="required">*</span>
        </div>
                   <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
           <CFormInput
    type="text"
    name="emergency_email"
    value={formData.emergency_email}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.emergency_email && <p className="error">{errors.emergency_email}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Additional parking charges</span>
        <span className="required">*</span>
        </div>
          <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilMoney} /></CInputGroupText>
           <CFormInput
    type="text"
    name="additional_parking_charges"
    value={formData.additional_parking_charges}
    onChange={handleChange}
  />
</CInputGroup>
          {errors.additional_parking_charges && <p className="error">{errors.additional_parking_charges}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Is payment gateway visible</span>
        <span className="required">*</span>
        </div>
     <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilToggleOff} />
    </CInputGroupText>
    <CFormSelect
      name="is_payment_gateway_visible"
      value={formData.is_payment_gateway_visible}
      onChange={handleChange}
    >
      <option value="">-Select-</option>
      <option value="yes">Yes</option>
    <option value="no">No</option>
    </CFormSelect>
      </CInputGroup>
       {errors.is_payment_gateway_visible && <p className="error">{errors.is_payment_gateway_visible}</p>}
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
export default AddProperty;