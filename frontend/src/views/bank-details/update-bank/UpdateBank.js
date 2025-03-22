import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function UpdateBank(){
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
        status:''
      });
    
      const [errors, setErrors] = useState({});
      const [properties, setProperties] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();
      
      useEffect(() => {
        fetchBankData();
      }, [id])
    
       const fetchBankData = async () => {
          try {
            const response = await axiosInstance.get(`/bank-details/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching bank details:', error);
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

        if (!formData.bank_name) formErrors.bank_name = 'Bank name is required';

        if (!formData.bank_branch ) formErrors.bank_branch  = 'Sector Description is required';
        
        if (!formData.bank_ifsc) formErrors.bank_branch = 'This field is required';

        if (!formData.bank_account_number ) formErrors.bank_account_number  = 'This field is required';

        if (!formData.bank_account_type ) formErrors.bank_account_type = 'This field is required';

        if (!formData.bank_account_name ) formErrors.bank_account_name  = 'This field is required';

        if (!formData.bank_account_holder) formErrors.bank_account_holder = 'This field is required';

        if (!formData.is_primary) formErrors.is_primary = 'This field is required';

        if (!formData.is_payment_gateway) formErrors. is_payment_gateway = 'This field is required';

        if (!formData.payment_gateway_name) formErrors.payment_gateway_name = 'This field is required';

        if (!formData.merchant_name) formErrors.merchant_name = 'This field is required';

        if (!formData.payment_gateway_mode) formErrors.payment_gateway_mode = 'This field is required';

        if (!formData.live_key_id) formErrors.live_key_id = 'This field is required';

        if (!formData.live_secret_key) formErrors.live_secret_key = 'This field is required';

        if (!formData.live_account_number) formErrors.live_account_number  = 'This field is required';

        if (!formData.test_key_id) formErrors.test_key_id = 'This field is required';

        if (!formData.test_secret_key) formErrors.test_secret_key = 'This field is required';

        if (!formData.test_account_number) formErrors.test_account_number = 'This field is required';
        
        if (!formData.currency) formErrors.currency = 'This field is required';

        if (!formData.payment_gateway_status) formErrors.currency = 'This field is required';

        if (!formData.status) formErrors.status = 'Status is required';

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/bank-details/${id}`,formData);
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
              <span className="details">Bank Name</span>
              <span className="required">*</span>
        </div>
             <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} />
             {errors.bank_name && <p className="error">{errors.bank_name}</p>}
        </div>
      
         <div className="input-box">
            <div className="details-container">
              <span className="details">Branch</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_branch"  value={formData.bank_branch} onChange={handleChange} />
            {errors.bank_branch && <p className="error">{errors.bank_branch}</p>}
        </div> 
        <div className="input-box">
            <div className="details-container">
              <span className="details">IFSC</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_ifsc"  value={formData.bank_ifsc} onChange={handleChange} />
            {errors.bank_ifsc && <p className="error">{errors.bank_ifsc}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account Number</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_account_number"  value={formData.bank_account_number} onChange={handleChange} />
            {errors.bank_account_number && <p className="error">{errors.bank_account_number}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Account Type</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_account_type"  value={formData.bank_account_type} onChange={handleChange} />
            {errors.bank_account_type && <p className="error">{errors.bank_account_type}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account Name</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_account_name"  value={formData.bank_account_name} onChange={handleChange} />
            {errors.bank_account_name && <p className="error">{errors.bank_account_name}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Account Holder</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="bank_account_holder"  value={formData.bank_account_holder} onChange={handleChange} />
            {errors.bank_account_holder && <p className="error">{errors.bank_account_holder}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Is Primary</span>
              <span className="required">*</span>
            </div>
            <select name="status" value={formData.is_primary} onChange={handleChange} >
              <option value="">-Select-</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
          </select>
            {errors.is_primary && <p className="error">{errors.is_primary}</p>}
        </div>

       
        <div className="input-box">
            <div className="details-container">
              <span className="details">Is Payment Gateway</span>
              <span className="required">*</span>
            </div>
            <select name="is_payment_gateway" value={formData.is_payment_gateway} onChange={handleChange}>
              <option value="">-Select-</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.is_payment_gateway && <p className="error">{errors.is_payment_gateway}</p>}
          </div>

        {formData.is_payment_gateway === "yes" && (
            <>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment Gateway Name</span>
                  <span className="required">*</span>
                </div>
                <input type="text" name="payment_gateway_name" value={formData.payment_gateway_name} onChange={handleChange} />
                {errors.payment_gateway_name && <p className="error">{errors.payment_gateway_name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Merchant Name</span>
                  <span className="required">*</span>
                </div>
                <input type="text" name="merchant_name" value={formData.merchant_name} onChange={handleChange} />
                {errors.merchant_name && <p className="error">{errors.merchant_name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment Gateway Mode</span>
                  <span className="required">*</span>
                </div>
                <select name="payment_gateway_mode" value={formData.payment_gateway_mode} onChange={handleChange}>
                  <option value="">-Select-</option>
                  <option value="test">Test</option>
                  <option value="live">Live</option>
                </select>
                {errors.payment_gateway_mode && <p className="error">{errors.payment_gateway_mode}</p>}
              </div>
            </>
          )}
        <div className="input-box">
            <div className="details-container">
              <span className="details">Live Key ID</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="live_key_id"  value={formData.live_key_id} onChange={handleChange} />
            {errors.live_key_id && <p className="error">{errors.live_key_id}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Live Secret Key</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="live_secret_key "  value={formData.live_secret_key } onChange={handleChange} />
            {errors.live_secret_key && <p className="error">{errors.live_secret_key}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Live Account Number</span>
              <span className="required">*</span>
            </div>
            <input type="text" name=" live_account_number"  value={formData. live_account_number} onChange={handleChange} />
            {errors.live_account_number && <p className="error">{errors. live_account_number}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Test Key ID</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="test_key_id"  value={formData.test_key_id} onChange={handleChange} />
            {errors.test_key_id && <p className="error">{errors.test_key_id}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Test Secret Key</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="test_secret_key"  value={formData.test_secret_key} onChange={handleChange} />
            {errors.test_secret_key && <p className="error">{errors.test_secret_key}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Test Account Number</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="test_account_number"  value={formData.test_account_number} onChange={handleChange} />
            {errors.test_account_number && <p className="error">{errors.test_account_number}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Currency</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="currency"  value={formData.currency} onChange={handleChange} />
            {errors.currency && <p className="error">{errors.currency}</p>}
        </div>
        <div className="input-box">
            <div className="details-container">
              <span className="details">Payment Gateway Status</span>
              <span className="required">*</span>
            </div>
            <select name="payment_gateway_status" value={formData.payment_gateway_status} onChange={handleChange} >
         <option value="">-Select-</option>
         <option value="enable">Enable</option>
         <option value="disable">Disable</option>
       </select>
            {errors.payment_gateway_status && <p className="error">{errors.payment_gateway_status}</p>}
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
export default UpdateBank;