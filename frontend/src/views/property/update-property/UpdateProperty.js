import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
const GOOGLE_MAPS_API_KEY = "AIzaSyAyufpVzzQOm5-z0H___ZEG9pN-P-aAA8M";

function UpdateProperty(){
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
    total_sectors:'',
    total_blocks:'',
    total_units:'',
    total_offices:'',
    total_amenities:'',
    total_gates:'',
    total_parkings:'',
    total_guest_parking:'',
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

  if (!formData.google_location) formErrors.google_location = 'This field is required';

  if (!formData.latitude) formErrors.latitude = 'This field is required';

  if (!formData.longitude) formErrors.longitude = 'This field is required';

  if (!formData.gst_number) formErrors.gst_number = 'This field is required';

  if (!formData.total_sectors) formErrors.total_sectors = 'This field is required';

  if (!formData.total_blocks) formErrors.total_blocks = 'This field is required';

  if (!formData.total_units) formErrors.total_units = 'This field is required';

  if (!formData.total_offices) formErrors.total_offices = 'This field is required';

  if (!formData.total_amenities) formErrors.total_amenities = 'This field is required';

  if (!formData.total_gates) formErrors.total_gates = 'This field is required';

  if (!formData.total_parkings) formErrors.total_parkings = 'This field is required';

  if (!formData.total_guest_parking) formErrors.total_guest_parking = 'This field is required';

  if (!formData.total_guest_parking) formErrors.total_guest_parking = 'This field is required';

  if (!formData.min_sub_members_allow) formErrors.min_sub_members_allow = 'This field is required';

  if (!formData.min_cars_allow ) formErrors.min_cars_allow = 'This field is required';

  if (!formData.min_bikes_allow) formErrors.min_bikes_allow = 'This field is required';

  if (!formData.min_house_helps_allow ) formErrors.min_house_helps_allow = 'This field is required';

  if (!formData.chairman_name) formErrors.chairman_name = 'This field is required';

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
              <span className="details">Property Name</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="property_name" 
                 value={formData.property_name} onChange={handleChange}/>
          {errors.property_name && <p className="error">{errors.property_name}</p>}
          </div>

        <div className="input-box">
          <div className="details-container">
              <span className="details">Logo</span>
              <span className="required">*</span>
                          </div>
          <input type="file" name="logo" onChange={handleChange} />

          {errors.logo && <p className="error">{errors.logo}</p>}
          </div>
      
          <div className="input-box">
            <div className="details-container">
              <span className="details">Address</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="address" 
                 value={formData.address} onChange={handleChange}/>
          {errors.address && <p className="error">{errors.address}</p>}
          </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Country ID</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="country_id" 
                 value={formData.country_id} onChange={handleChange}/>
          {errors.country_id && <p className="error">{errors.country_id}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">City ID</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="city_id" 
                 value={formData.city_id} onChange={handleChange}/>
          {errors.city_id && <p className="error">{errors.city_id}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">State ID</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="state_id" 
                 value={formData.state_id} onChange={handleChange}/>
          {errors.property_id && <p className="error">{errors.property_id}</p>}
      </div>
      
      <div className="input-box">
      <div className="details-container">
        <span className="details">Google Location</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="google_location" 
                 value={formData.google_location} onChange={handleChange}/>
          {errors.google_location && <p className="error">{errors.google_location}</p>}
      </div>
{/* 
           <div className="input-box">
            <div className="details-container">
              <span className="details">Google Location</span>
              <span className="required">*</span>
            </div>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
              <StandaloneSearchBox onLoad={(ref) => setSearchBox(ref)} onPlacesChanged={onPlacesChanged}>
                <input type="text" placeholder="Search location..." required />
              </StandaloneSearchBox>
            </LoadScript>
          </div> */}

          <div className="input-box">
            <div className="details-container">
              <span className="details">Latitude</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="latitude" 
                 value={formData.latitude} onChange={handleChange}/>
          {errors.latitude && <p className="error">{errors.latitude}</p>}
          </div>

          <div className="input-box">
            <div className="details-container">
              <span className="details">Longitude</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="longitude" 
                 value={formData.longitude} onChange={handleChange}/>
          {errors.longitude && <p className="error">{errors.longitude}</p>}
          </div>
     </div>
     <hr/>
     <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">GST Number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="gst_number" 
                 value={formData.gst_number} onChange={handleChange}/>
          {errors.gst_number && <p className="error">{errors.gst_number}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Sectors</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_sectors" 
                 value={formData.total_sectors} onChange={handleChange}/>
          {errors.total_sectors && <p className="error">{errors.total_sectors}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Blocks</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_blocks" 
                 value={formData.total_blocks} onChange={handleChange}/>
          {errors.total_blocks && <p className="error">{errors.total_blocks}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Units</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_units" 
                 value={formData.total_units} onChange={handleChange}/>
          {errors.total_units && <p className="error">{errors.total_units}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Offices</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_offices" 
                 value={formData.total_offices} onChange={handleChange}/>
          {errors.total_offices && <p className="error">{errors.total_offices}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Amenities</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_amenities" 
                 value={formData.total_amenities} onChange={handleChange}/>
          {errors.total_amenities && <p className="error">{errors.total_amenities}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Gates</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_gates" 
                 value={formData.total_gates} onChange={handleChange}/>
          {errors.total_gates && <p className="error">{errors.total_gates}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Parkings</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_parkings" 
                 value={formData.total_parkings} onChange={handleChange}/>
          {errors.total_parkings && <p className="error">{errors.total_parkings}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Guest Parking</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="total_guest_parking" 
                 value={formData.total_guest_parking} onChange={handleChange}/>
          {errors.total_guest_parking && <p className="error">{errors.total_guest_parking}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Sub Members Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_sub_members_allow" 
                 value={formData.min_sub_members_allow} onChange={handleChange}/>
          {errors.min_sub_members_allow && <p className="error">{errors.min_sub_members_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Cars Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_cars_allow" 
                 value={formData.min_cars_allow} onChange={handleChange}/>
          {errors.min_cars_allow && <p className="error">{errors.min_cars_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Bikes Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_bikes_allow" 
                 value={formData.min_bikes_allow} onChange={handleChange}/>
          {errors.min_bikes_allow && <p className="error">{errors.min_bikes_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min House Helps Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_house_helps_allow" 
                 value={formData.min_house_helps_allow} onChange={handleChange}/>
          {errors.min_house_helps_allow && <p className="error">{errors.min_house_helps_allow}</p>}
      </div>
      </div>

       <h2>Chairman Details</h2>
      <hr/>
      <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">Chairman Name</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="chairman_name" 
                 value={formData.chairman_name} onChange={handleChange}/>
          {errors.chairman_name && <p className="error">{errors.chairman_name}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Contact Number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="chairman_contact_no" 
                 value={formData.chairman_contact_no} onChange={handleChange}/>
          {errors.chairman_contact_no && <p className="error">{errors.chairman_contact_no}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Email</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="chairman_email" 
                 value={formData.chairman_email} onChange={handleChange}/>
          {errors.chairman_email && <p className="error">{errors.chairman_email}</p>}
      </div>
      </div>
      
      <h2>Emergency  Details</h2>
      <hr/>
      <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency Name</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_name" 
                 value={formData.emergency_name} onChange={handleChange}/>
          {errors.emergency_name && <p className="error">{errors.emergency_name}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency Contact Number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_contact_no" 
                 value={formData.emergency_contact_no} onChange={handleChange}/>
          {errors.emergency_contact_no && <p className="error">{errors.emergency_contact_no}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency Email</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_email" 
                 value={formData.emergency_email} onChange={handleChange}/>
          {errors.emergency_email && <p className="error">{errors.emergency_email}</p>}
      </div>

     </div>
      <hr/>
     <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">Additional Parking Charges</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="additional_parking_charges" 
                 value={formData.additional_parking_charges} onChange={handleChange}/>
          {errors.additional_parking_charges && <p className="error">{errors.additional_parking_charges}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Is Payment Gateway Visible</span>
        <span className="required">*</span>
        </div>
       <select name="is_payment_gateway_visible" 
                 value={formData.is_payment_gateway_visible} onChange={handleChange}>
       {errors.is_payment_gateway_visible && <p className="error">{errors.is_payment_gateway_visible}</p>}
        <option value="">-Select-</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
       </select>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Status</span>
        <span className="required">*</span>
        </div>
       <select name="status" value={formData.status} onChange={handleChange}>
       {errors.status && <p className="error">{errors.status}</p>}
         <option value="">-Select-</option>
         <option value="active">Active</option>
         <option value="inactive">Inactive</option>
       </select>
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
export default UpdateProperty;