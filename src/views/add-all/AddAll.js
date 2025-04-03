import React, { useEffect, useState } from "react";
import '../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function AddProperty() {
  const [formData, setFormData] = useState({
    property_name: '',
    logo: '',
    address: '',
    country_id: '',
    city_id: ''
  });

  const [sectors, setSectors] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [showGateFields, setShowGateFields] = useState(false);
  const [showAssetsFields, setShowAssetsFields] = useState(false);
  const [showBankFields, setShowBankFields] = useState(false);
  const [showAmenityFields, setshowAmenityFields] = useState(false);
  const [showOfficeFields, setShowOfficeFields] = useState(false);
  const [amenityMasters, setAmenityMasters] = useState(false);
  const addSector = () => {
    setSectors([...sectors, { name: '', description: '', blocks: [] }]);
  };
  const addBlock = (sectorIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].blocks.push({ name: '', total_units: '', units: [] });
    setSectors(updatedSectors);
  };
  const addUnit = (sectorIndex, blockIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].blocks[blockIndex].units.push({ name: '', floor_number: '' });
    setSectors(updatedSectors);
  };
  const handleInputChange = (e, sectorIndex, blockIndex, unitIndex) => {
    const { name, value } = e.target;
    const updatedSectors = [...sectors];

    if (unitIndex !== undefined) {
      updatedSectors[sectorIndex].blocks[blockIndex].units[unitIndex][name] = value;
    } else if (blockIndex !== undefined) {
      updatedSectors[sectorIndex].blocks[blockIndex][name] = value;
    } else {
      updatedSectors[sectorIndex][name] = value;
    }

    setSectors(updatedSectors);
  };


  const handleAddGateClick = () => {
    setShowGateFields(true)
  }
  const handleAddAssetsClick = () => {
    setShowAssetsFields(true);
  }
  const handleAddBankClick = () => {
    setShowBankFields(true);
  }
  const handleAddAmenities = () => {
    setshowAmenityFields(true)
  }
  const handleAddOfficeClick = () => {
    setShowOfficeFields(true);
  }

  useEffect(() => {
    const fetchAmenityMasters = async () => {
      try {
        const response = await axiosInstance.get('/amenity-masters');
        setAmenityMasters(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load blocks',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };
    fetchAmenityMasters();
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
    if (!formData.address) formErrors.address = 'Address is required';
    if (!formData.country_id) formErrors.country_id = 'This field is required';
    if (!formData.city_id) formErrors.city_id = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axiosInstance.post('/property', form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire({
        icon: "success",
        title: "Data Saved Successfully!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
      });

      navigate('/property/property-list');
    } catch (error) {
      console.error("Error details:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCancel = () => {
    navigate('/property/property-list');
  };

  return (
    <div className="form-container">
      <div className="page-header">
        <div className="form-note" style={{ textAlign: "right", marginBottom: "10px" }}>
          <span className="required">*</span> Field is mandatory
        </div>
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">Property Name <span className="required">*</span></span>
              <input type="text" name="property_name" value={formData.property_name} onChange={handleChange} />
              {errors.property_name && <p className="error">{errors.property_name}</p>}
            </div>

            <div className="input-box">
              <span className="details">Logo</span>
              <input type="file" name="logo" onChange={handleChange} />
            </div>

            <div className="input-box">
              <span className="details">Address <span className="required">*</span></span>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>

            <div className="button-all">
              <button type="button" className="custom-button " onClick={addSector}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Sector
              </button>
              <button type="button" className="custom-button " onClick={handleAddGateClick}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Gate
              </button>
              <button type="button" className="custom-button " onClick={handleAddAssetsClick}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Assets
              </button>
              <button type="button" className="custom-button " onClick={handleAddBankClick}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Bank
              </button>
              <button type="button" className="custom-button " onClick={handleAddAmenities}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Amenity
              </button>
              <button type="button" className="custom-button " onClick={handleAddOfficeClick}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Office
              </button>
            </div>
          </div>
          <hr />
          {sectors.map((sector, sectorIndex) => (
            <div key={sectorIndex} className="user-details mb-4 p-2 border rounded">
              <div className="input-box">
                <span className="details">Sector Name</span>
                <input type="text" name="name" value={sector.name} onChange={(e) => handleInputChange(e, sectorIndex)} />
              </div>
              
              <div className="input-box">
                <span className="details">Description</span>
                <textarea name="description" value={sector.description} onChange={(e) => handleInputChange(e, sectorIndex)} />
              </div>

              <button type="button" onClick={() => addBlock(sectorIndex)} className="mb-2 px-2 py-1 bg-blue-500 text-white rounded add-block-btn">
                Add Block
              </button>
              {sector.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="user-details ml-4 p-2 border rounded">
                  <div className="input-box">
                    <span className="details">Block Name</span>
                    <input type="text" name="name" value={block.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex)} />
                  </div>
                  <div className="input-box">
                    <span className="details">Total Units</span>
                    <input type="text" name="name" value={block.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex)} />
                  </div>
                  <div className="input-box">
                    <span className="details">Unit number start from</span>
                    <input type="text" name="name" value={block.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex)} />
                  </div>
                  <div className="input-box">
                    <span className="details">Unit number end to</span>
                    <input type="text" name="name" value={block.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex)} />
                  </div>
                  <button type="button" onClick={() => addUnit(sectorIndex, blockIndex)} className="mb-2 px-2 py-1 bg-green-500 text-white rounded add-block-btn">
                    Add Unit
                  </button>
                  {block.units.map((unit, unitIndex) => (
                    <div key={unitIndex} className="user-details ml-4 p-2 border rounded">
                      <div className="input-box">
                        <span className="details">Floor number</span>
                        <input type="text" name="name" value={unit.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex, unitIndex)} />
                      </div>
                      <div className="input-box">
                        <span className="details">Unit number</span>
                        <input type="text" name="name" value={unit.name} onChange={(e) => handleInputChange(e, sectorIndex, blockIndex, unitIndex)} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

{showGateFields && (
     <div className="user-details">
        <div className="input-box">
          <div className="details-container">
              <span className="details">Gate name</span>
              <span className="required">*</span>
        </div>
             <input type="text" name="gate_name" value={formData.gate_name} onChange={handleChange} />
             {errors.gate_name && <p className="error">{errors.gate_name}</p>}
        </div>
      
         <div className="input-box">
              <span className="details">Description</span>
              <textarea 
            name="gate_description"  value={formData.gate_description} onChange={handleChange} />
            {errors.gate_description && <p className="error">{errors.gate_description}</p>}
        </div>

    <div className="input-box">
       <div className="details-container">
        <span className="details">Is main gate</span>
        <span className="required">*</span>
        </div>
       <select name="is_main_gate" value={formData.is_main_gate} onChange={handleChange}>
          <option>-Select-</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
       </select>
       {errors.is_main_gate && <p className="error">{errors.is_main_gate}</p>}
      </div>
     </div>
     )} 
{showAssetsFields && (
          <div className="user-details">
         <div className="input-box">
           <div className="details-container">
              <span className="details">Asset name</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="asset_name" value={formData.asset_name} onChange={handleChange} />
             {errors.asset_name && <p className="error">{errors.asset_name}</p>}
        </div>
      
         <div className="input-box">
              <span className="details">Description</span>
            <textarea name="asset_description"  value={formData.asset_description} onChange={handleChange} />
        </div>
     </div>
     )}

{showBankFields && (
              <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                        <span className="details">Bank name</span>
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
                        <span className="details">Account number</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_number"  value={formData.bank_account_number} onChange={handleChange} />
                      {errors.bank_account_number && <p className="error">{errors.bank_account_number}</p>}
                  </div>
          
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account type</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_type"  value={formData.bank_account_type} onChange={handleChange} />
                      {errors.bank_account_type && <p className="error">{errors.bank_account_type}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account name</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_name"  value={formData.bank_account_name} onChange={handleChange} />
                      {errors.bank_account_name && <p className="error">{errors.bank_account_name}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account holder</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_holder"  value={formData.bank_account_holder} onChange={handleChange} />
                      {errors.bank_account_holder && <p className="error">{errors.bank_account_holder}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Is primary</span>
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
                        <span className="details">Is payment gateway</span>
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
                            <span className="details">Payment gateway name</span>
                            <span className="required">*</span>
                          </div>
                          <input type="text" name="payment_gateway_name" value={formData.payment_gateway_name} onChange={handleChange} />
                          {errors.payment_gateway_name && <p className="error">{errors.payment_gateway_name}</p>}
                        </div>
          
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Merchant name</span>
                            <span className="required">*</span>
                          </div>
                          <input type="text" name="merchant_name" value={formData.merchant_name} onChange={handleChange} />
                          {errors.merchant_name && <p className="error">{errors.merchant_name}</p>}
                        </div>
          
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Payment gateway mode</span>
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
                      <span className="details">Live key id</span>
                      <input type="text" name="live_key_id"  value={formData.live_key_id} onChange={handleChange} />
                  </div>
          
                  <div className="input-box">
                        <span className="details">Live secret key</span>
                      <input type="text" name="live_secret_key "  value={formData.live_secret_key } onChange={handleChange} />
                  </div>
          
                  <div className="input-box">
                        <span className="details">Live account number</span>
                      <input type="text" name=" live_account_number"  value={formData. live_account_number} onChange={handleChange} />
                  </div>
          
                  <div className="input-box">
                        <span className="details">Test key id</span>
                      <input type="text" name="test_key_id"  value={formData.test_key_id} onChange={handleChange} />
                  </div>
          
                  <div className="input-box">
                        <span className="details">Test secret key</span>
                      <input type="text" name="test_secret_key"  value={formData.test_secret_key} onChange={handleChange} />
                  </div>
                  <div className="input-box">
                        <span className="details">Test account number</span>
                      <input type="text" name="test_account_number"  value={formData.test_account_number} onChange={handleChange} />
                  </div>
                  <div className="input-box">
                        <span className="details">Currency</span>
                      <input type="text" name="currency"  value={formData.currency} onChange={handleChange} />
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Payment gateway status</span>
                        <span className="required">*</span>
                      </div>
                      <select name="payment_gateway_status" value={formData.payment_gateway_status} onChange={handleChange} >
                   <option value="">-Select-</option>
                   <option value="enable">Enable</option>
                   <option value="disable">Disable</option>
                 </select>
                      {errors.payment_gateway_status && <p className="error">{errors.payment_gateway_status}</p>}
                  </div>
               </div>
     )}

{showAmenityFields && (
        <div className="user-details">
            <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property sector</span>
                    <span className="required">*</span>
                  </div>
                  <input type="text"  name="property_sector_id" value={formData.property_sector_id} onChange={handleChange}/>
                  {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
                </div>
    
              <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property block</span>
                    <span className="required">*</span>
                  </div>
                  <input type="text" name="property_block_id" value={formData.property_block_id} onChange={handleChange}/>
                  {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
                </div>
    
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property unit</span>
                    <span className="required">*</span>
                  </div>
                   <input type="text"  name="property_unit_id" value={formData.property_unit_id} onChange={handleChange}/>
                  {errors.property_unit_id && <p className="error">{errors.property_unit_id}</p>}
                </div>
    
          <div className="input-box">
          <div className="details-container">
            <span className="details">Amenity id</span>
            <span className="required" >*</span>
            </div>
            <select name="amenity_id" value={formData.amenity_id} onChange={handleChange}>
                    <option value="">-Select Amenity-</option>
                    {amenityMasters.map((amenity) => (
                      <option key={amenity.id} value={amenity.id}>
                       {amenity.amenity_name}
                      </option>
                    ))}
                  </select>
                  {errors.amenity_id && <p className="error">{errors.amenity_id}</p>}
          </div>
          
          <div className="input-box">
            <span className="details">Amenity details</span>
            <input type="text"  name="amenity_details" value={formData.amenity_details} onChange={handleChange}/>
          </div>
         </div>
     )}

     {showOfficeFields && (
      <div className="user-details">
          <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property sector</span>
                    <span className="required">*</span>
                  </div>
                  <input type="text"  name="property_sector_id" value={formData.property_sector_id} onChange={handleChange}/>
                  {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
                </div>
    
              <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property block</span>
                    <span className="required">*</span>
                  </div>
                  <input type="text" name="property_block_id" value={formData.property_block_id} onChange={handleChange}/>
                  {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
                </div>
    
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Property unit</span>
                    <span className="required">*</span>
                  </div>
                   <input type="text"  name="property_unit_id" value={formData.property_unit_id} onChange={handleChange}/>
                  {errors.property_unit_id && <p className="error">{errors.property_unit_id}</p>}
                </div>
     <div className="input-box">
     <div className="details-container">
       <span className="details">Office name</span>
       <span className="required">*</span>
       </div>
       <input type="text"  name="office_name" value={formData.office_name} onChange={handleChange}/>
       {errors.office_name && <p className="error">{errors.office_name}</p>}
     </div>

     <div className="input-box">
       <span className="details">Description</span>
       <textarea name="office_description" value={formData.office_description} onChange={handleChange}  />
     </div>
     
     <div className="input-box">
     <div className="details-container">
       <span className="details">Contact</span>
       <span className="required">*</span>
       </div>
       <input type="tel" name="office_contact" value={formData.office_contact} onChange={handleChange}  />
       {errors.office_contact && <p className="error">{errors.office_contact}</p>}
     </div>
    </div>
     )}
<div className="button-row">
      <button type="submit" className="simple-button primary-button">Save</button>
      <button type="button" className="simple-button secondary-button" onClick={handleCancel} >Cancel</button>
     </div>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
