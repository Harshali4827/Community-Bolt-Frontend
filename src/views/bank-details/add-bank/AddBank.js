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
import { cilBank, cilBarcode,cilCheckCircle,cilContact,cilCreditCard,cilDollar,cilHome,cilList, cilListRich, cilLockLocked,cilShieldAlt,cilToggleOn, cilTransfer, cilUser, cilUserFollow, cilWallet } from '@coreui/icons';
function AddBank(){
const [formData, setFormData] = useState({
        property_id: '',
        bank_name: '',
        bank_branch: '',
        bank_ifsc:'',
        bank_account_number: '',
        bank_account_type: '',
        bank_account_name:'',
        bank_account_holder:'',
        is_primary:'',
        is_payment_gateway:'',
        payment_gateway_name:'',
        merchant_name:'',
        payment_gateway_mode:'',
        live_key_id:'',
        live_secret_key:'',
        live_account_number:'',
        test_key_id:'',
        test_secret_key:'',
        test_account_number:'',
        currency:'',
        payment_gateway_status:'',
        status:'',
        ip_address:'',
        created_by:'',

      });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
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

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';

        if (!formData.bank_name) formErrors.bank_name = 'Bank name is required';

        if (!formData.bank_branch ) formErrors.bank_branch  = 'Sector Description is required';
        
        if (!formData.bank_ifsc) formErrors.bank_ifsc = 'This field is required';

        if (!formData.bank_account_number ) formErrors.bank_account_number  = 'This field is required';

        if (!formData.bank_account_type ) formErrors.bank_account_type = 'This field is required';

        if (!formData.bank_account_name ) formErrors.bank_account_name  = 'This field is required';

        if (!formData.bank_account_holder) formErrors.bank_account_holder = 'This field is required';

        if (!formData.is_primary) formErrors.is_primary = 'This field is required';

        if (!formData.is_payment_gateway) formErrors. is_payment_gateway = 'This field is required';

        if (!formData.payment_gateway_name) formErrors.payment_gateway_name = 'This field is required';

        if (!formData.merchant_name) formErrors.merchant_name = 'This field is required';

        if (!formData.payment_gateway_mode) formErrors.payment_gateway_mode = 'This field is required';
        if (!formData.payment_gateway_status) formErrors.payment_gateway_status = 'This field is required';
        
        if (!formData.status) formErrors.status = 'Status is required';

        if (!formData.ip_address) formErrors.ip_address = 'IP address is required';

        if (!formData.created_by) formErrors.created_by = 'Created by is required';

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.post('/banks',formData);
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
      
          navigate('/bank-details/bank-list');
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
           navigate('/bank-details/bank-list') 
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
              <span className="details">Bank name</span>
              <span className="required">*</span>
        </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBank} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_name"
               value={formData.bank_name}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.bank_name && <p className="error">{errors.bank_name}</p>}
        </div>
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Branch</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilListRich} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_branch"
               value={formData.bank_branch}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_branch && <p className="error">{errors.bank_branch}</p>}
        </div> 
        <div className="input-box">
            <div className="details-container">
              <span className="details">IFSC</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBarcode} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_ifsc"
               value={formData.bank_ifsc}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_ifsc && <p className="error">{errors.bank_ifsc}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account number</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilWallet} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_account_number"
               value={formData.bank_account_number}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_account_number && <p className="error">{errors.bank_account_number}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Account type</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilList} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_account_type"
               value={formData.bank_account_type}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_account_type && <p className="error">{errors.bank_account_type}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account name</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_account_name"
               value={formData.bank_account_name}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_account_name && <p className="error">{errors.bank_account_name}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account holder</span>
              <span className="required">*</span>
            </div>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilContact} /></CInputGroupText>
           <CFormInput
               type="text"
               name="bank_account_holder"
               value={formData.bank_account_holder}
               onChange={handleChange}
             />
             </CInputGroup>
            {errors.bank_account_holder && <p className="error">{errors.bank_account_holder}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Is primary</span>
              <span className="required">*</span>
            </div>
          <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilCheckCircle} />
    </CInputGroupText>
    <CFormSelect
      name="is_primary"
      value={formData.is_primary}
      onChange={handleChange}
    >
              <option value="">-Select-</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
    </CFormSelect>
      </CInputGroup>
            {errors.is_primary && <p className="error">{errors.is_primary}</p>}
        </div>

       
        <div className="input-box">
            <div className="details-container">
              <span className="details">Is payment gateway</span>
              <span className="required">*</span>
            </div>
            <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilCreditCard} />
    </CInputGroupText>
    <CFormSelect
      name="is_payment_gateway"
      value={formData.is_payment_gateway}
      onChange={handleChange}
    >
              <option value="">-Select-</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
    </CFormSelect>
      </CInputGroup>
            {errors.is_payment_gateway && <p className="error">{errors.is_payment_gateway}</p>}
          </div>

        {formData.is_payment_gateway === "yes" && (
            <>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment gateway name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCreditCard} /></CInputGroupText>
           <CFormInput
               type="text"
               name="payment_gateway_name"
               value={formData.payment_gateway_name}
               onChange={handleChange}
             />
             </CInputGroup>
                {errors.payment_gateway_name && <p className="error">{errors.payment_gateway_name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Merchant name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup className="input-icon">
             <CInputGroupText><CIcon icon={cilUserFollow} /></CInputGroupText>
             <CFormInput
               type="text"
               name="merchant_name"
               value={formData.merchant_name}
               onChange={handleChange}
             />
             </CInputGroup>
                {errors.merchant_name && <p className="error">{errors.merchant_name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment gateway mode</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                 <CInputGroupText className="input-icon">
                    <CIcon icon={cilTransfer} />
                  </CInputGroupText>
                 <CFormSelect
                   name="is_primary"
                   value={formData.payment_gateway_mode} onChange={handleChange}>
                            <option value="">-Select-</option>
                            <option value="test">Test</option>
                            <option value="live">Live</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.payment_gateway_mode && <p className="error">{errors.payment_gateway_mode}</p>}
              </div>
            </>
          )}
        <div className="input-box">
            <span className="details">Live key id</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
           <CFormInput
               type="text"
               name="live_key_id"
               value={formData.live_key_id}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>

        <div className="input-box">
              <span className="details">Live secret key</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilShieldAlt} /></CInputGroupText>
           <CFormInput
               type="text"
               name="live_secret_key"
               value={formData.live_secret_key}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>

        <div className="input-box">
              <span className="details">Live account number</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilWallet} /></CInputGroupText>
           <CFormInput
               type="text"
               name="live_account_number"
               value={formData.live_account_number}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>

        <div className="input-box">
              <span className="details">Test key id</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
           <CFormInput
               type="text"
               name="test_key_id"
               value={formData.test_key_id}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>

        <div className="input-box">
              <span className="details">Test secret key</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
           <CFormInput
               type="text"
               name="test_secret_key"
               value={formData.test_secret_key}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>
        <div className="input-box">
              <span className="details">Test account number</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilShieldAlt} /></CInputGroupText>
           <CFormInput
               type="text"
               name="test_account_number"
               value={formData.test_account_number}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>
        <div className="input-box">
              <span className="details">Currency</span>
            <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilDollar} /></CInputGroupText>
           <CFormInput
               type="text"
               name="currency"
               value={formData.currency}
               onChange={handleChange}
             />
             </CInputGroup>
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Payment gateway status</span>
              <span className="required">*</span>
            </div>
       <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilToggleOn} />
    </CInputGroupText>
    <CFormSelect
      name="payment_gateway_status"
      value={formData.payment_gateway_status}
      onChange={handleChange}
    >
        <option value="">-Select-</option>
         <option value="enable">Enable</option>
         <option value="disable">Disable</option>
    </CFormSelect>
      </CInputGroup>
            {errors.payment_gateway_status && <p className="error">{errors.payment_gateway_status}</p>}
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
export default AddBank;