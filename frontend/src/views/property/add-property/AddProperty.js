import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
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
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
  setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  let formErrors = {};

  if (!formData.property_id) formErrors.property_id = 'Property id is required';

  if (!formData.sector_name) formErrors.sector_name = 'Sector name is required';

  if (!formData.sector_description ) formErrors.sector_description  = 'Sector Description is required';

  if (!formData.status) formErrors.status = 'Status is required';

  if (!formData.ip_address) formErrors.ip_address = 'IP address is required';

  if (!formData.created_by) formErrors.created_by = 'Created by is required';
  
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    const response = await axiosInstance.post('/sectors',formData);
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

    navigate('/sectors/sectors-list');
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
     navigate('/sectors/sectors-list') 
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
          <input type="text" required />
        </div>

        <div className="input-box">
          <div className="details-container">
              <span className="details">Logo</span>
              <span className="required">*</span>
                          </div>
             <input type="file" />
          </div>
      
          <div className="input-box">
            <div className="details-container">
              <span className="details">Address</span>
              <span className="required">*</span>
            </div>
            <input type="text" value={address} readOnly />
          </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Country ID</span>
        <span className="required">*</span>
        </div>
        <input type="text" readOnly required />
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">City ID</span>
        <span className="required">*</span>
        </div>
        <input type="text"readOnly required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">State ID</span>
        <span className="required">*</span>
        </div>
        <input type="text" readOnly required />
      </div>
      
      {/* <div className="input-box">
      <div className="details-container">
        <span className="details">Google Location</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div> */}

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
          </div>

          <div className="input-box">
            <div className="details-container">
              <span className="details">Latitude</span>
              <span className="required">*</span>
            </div>
            <input type="text" value={latitude} readOnly />
          </div>

          <div className="input-box">
            <div className="details-container">
              <span className="details">Longitude</span>
              <span className="required">*</span>
            </div>
            <input type="text" value={longitude} readOnly />
          </div>
     </div>
     <hr/>
     <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">GST Number</span>
        <span className="required">*</span>
        </div>
        <input type="number" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Sectors</span>
        <span className="required">*</span>
        </div>
        <input type="text"  required />
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Blocks</span>
        <span className="required">*</span>
        </div>
        <input type="text" />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Units</span>
        <span className="required">*</span>
        </div>
        <input type="number" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Offices</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Amenities</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Gates</span>
        <span className="required">*</span>
        </div>
        <textarea required/>
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Parkings</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Total Guest Parking</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Sub Members Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Cars Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min Bikes Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min House Helps Allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
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
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Chairman Contact Number</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Chairman Email</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
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
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency Contact Number</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency Email</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>

     </div>
      <hr/>
     <div className="user-details">
      <div className="input-box">
      <div className="details-container">
        <span className="details">Additional Parking Charges</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Is Payment Gateway Visible</span>
        <span className="required">*</span>
        </div>
       <select required>
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
       <select>
         <option value="">-Select-</option>
         <option value="active">Active</option>
         <option value="inactive">Inactive</option>
       </select>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">IP Address</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Created by</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Is Delete</span>
        <span className="required">*</span>
        </div>
        <input type="text" required />
      </div>
    </div>
    
    <div className="button-row">
      <button type="submit" className="simple-button primary-button">Save</button>
      <button type="button" className="simple-button secondary-button" >Cancel</button>
     </div>
  </form>
</div>
</div>
  )
};
export default AddProperty;