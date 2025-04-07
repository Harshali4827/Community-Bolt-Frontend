import React, { useEffect, useState } from "react";
import '../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";

function AddProperty() {
  const [formData, setFormData] = useState({
    property_name: '',
    logo: '',
    address: '',
    country_id: '',
    city_id: '',
    state_id: '',
    google_location: '',
    latitude: '',
    longitude: '',
    gst_number: '',
    total_sectors: '0',
    total_blocks: '0',
    total_units: '0',
    total_offices: '0',
    total_amenities: '0',
    total_gates: '0',
    total_parkings: '0',
    total_guest_parking: '0',
    min_sub_members_allow: '',
    min_cars_allow: '',
    min_bikes_allow: '',
    min_house_helps_allow: '',
    chairman_name: '',
    chairman_contact_no: '',
    chairman_email: '',
    emergency_name: '',
    emergency_contact_no: '',
    emergency_email: '',
    additional_parking_charges: '',
    is_payment_gateway_visible: '',
    status: 'active',
    ip_address: '',
    created_by: ''
  });

  const [sectors, setSectors] = useState([]);
  const [gates, setGates] = useState([]);
  const [assets, setAssets] = useState([]);
  const [banks, setBanks] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [amenityMasters, setAmenityMasters] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const addSector = () => {
    setSectors([...sectors, { 
      sector_name: '', 
      sector_description: '', 
      status: 'active',
      blocks: [] 
    }]);
  };

  const addBlock = (sectorIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].blocks.push({ 
      sector_name: updatedSectors[sectorIndex].sector_name,
      block_name: '', 
      total_units: '',
      unit_number_start_from: '',
      unit_number_end_to: '',
      status: 'active',
      units: [] 
    });
    setSectors(updatedSectors);
  };

  const addUnit = (sectorIndex, blockIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].blocks[blockIndex].units.push({ 
      block_name: updatedSectors[sectorIndex].blocks[blockIndex].block_name,
      floor_number: '', 
      unit_number: '' 
    });
    setSectors(updatedSectors);
  };

  const addGate = () => setGates([...gates, { 
    gate_name: '', 
    gate_description: '', 
    is_main_gate: '0',
    status: 'active'
  }]);

  const addAssets = () => setAssets([...assets, {asset_name:'',asset_description:'',status:'active'}]);
  
  const addBanks = () => setBanks([...banks,{bank_name:'',bank_branch:'',bank_ifsc:'',bank_account_number:'',bank_account_type:'',bank_account_name:'',bank_account_holder:'',is_primary:'',is_payment_gateway:'',payment_gateway_name:'',merchant_name:'',payment_gateway_mode:'',live_key_id:'',live_secret_key:'',live_account_number:'',test_key_id:'',test_secret_key:'',test_account_number:'',currency:'',payment_gateway_status:'',status:'active'
  }]);
  
  const addAmenity = () => setAmenities([...amenities,{property_sector_id:'',property_block_id:'',property_unit_id:'', amenity_id:'',amenity_details:''}])

  const addOffice = () => setOffices([...offices,{property_sector_id:'',property_block_id:'',property_unit_id:'',office_name:'',office_description:'',office_contact:''}])

  const handleInputChange = (e, indexes = {}) => {
    const { sectorIndex, blockIndex, unitIndex, gateIndex, assetIndex, bankIndex, amenityIndex, officeIndex} = indexes;
    const { name, value } = e.target;

    if (gateIndex !== undefined) {
      const updatedGates = [...gates];
      updatedGates[gateIndex][name] = value;
      setGates(updatedGates);
      return;
    }
    if (assetIndex !== undefined) {
      const updatedAssets = [...assets];
      updatedAssets[assetIndex][name] = value;
      setAssets(updatedAssets);
      return;
    }
   
    if (bankIndex !== undefined) {
      const updatedBanks = [...banks];
      updatedBanks[bankIndex][name] = value;
      setBanks(updatedBanks);
      return;
    } 
    
    if (officeIndex !== undefined) {
      const updatedOffices = [...offices];
      updatedOffices[officeIndex][name] = value;
      setOffices(updatedOffices);
      return;
    }
  
    if (amenityIndex !== undefined) {
      const updatedAmenities = [...amenities];
      updatedAmenities[amenityIndex][name] = value;
      setAmenities(updatedAmenities);
      return;
    }  
    const updatedSectors = [...sectors];
    if (unitIndex !== undefined) {
      updatedSectors[sectorIndex].blocks[blockIndex].units[unitIndex][name] = value;
    } else if (blockIndex !== undefined) {
      updatedSectors[sectorIndex].blocks[blockIndex][name] = value;
    } else if (sectorIndex !== undefined) {
      updatedSectors[sectorIndex][name] = value;
    }
    setSectors(updatedSectors);
  };
 
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
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const ip = await getIPAddress();
          
          setFormData(prev => ({
            ...prev,
            created_by: decodedToken.userId,
            ip_address: ip
          }));
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      }
    };
    fetchUserData();
  }, []);

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return '';
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const form = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    const sectorsData = sectors.map(s => ({
      sector_name: s.sector_name,
      sector_description: s.sector_description,
      status: s.status,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));

    const blocksData = [];
    const unitsData = [];
    
    sectors.forEach(sector => {
      sector.blocks.forEach(block => {
        blocksData.push({
          sector_name: sector.sector_name,
          block_name: block.block_name,
          total_units: block.total_units,
          unit_number_start_from: block.unit_number_start_from,
          unit_number_end_to: block.unit_number_end_to,
          status: block.status,
          ip_address: formData.ip_address,
          created_by: formData.created_by
        });

        block.units.forEach(unit => {
          unitsData.push({
            block_name: block.block_name,
            floor_number: unit.floor_number,
            unit_number: unit.unit_number,
            ip_address: formData.ip_address
          });
        });
      });
    });

    const gatesData = gates.map(gate => ({
      gate_name: gate.gate_name,
      gate_description: gate.gate_description,
      is_main_gate: gate.is_main_gate,
      status: gate.status,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));

    const assetsData = assets.map(asset => ({
      asset_name: asset.asset_name,
      asset_description: asset.description, 
      status: asset.status,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));

     const banksData = banks.map(bank => ({
      bank_name: bank.bank_name,
      bank_branch: bank.bank_branch,
      bank_ifsc: bank.bank_ifsc,
      bank_account_number: bank.bank_account_number,
      bank_account_type: bank.bank_account_type,
      bank_account_name: bank.bank_account_name,
      bank_account_holder: bank.bank_account_holder,
      is_primary: bank.is_primary,
      is_payment_gateway: bank.is_payment_gateway,
      payment_gateway_name: bank.payment_gateway_name,
      merchant_name: bank.merchant_name,
      payment_gateway_mode: bank.payment_gateway_mode,
      live_key_id: bank.live_key_id,
      live_secret_key: bank.live_secret_key,
      live_account_number: bank.live_account_number,
      test_key_id: bank.test_key_id,
      test_secret_key: bank.test_secret_key,
      test_account_number: bank.test_account_number,
      currency: bank.currency,
      payment_gateway_status: bank.payment_gateway_status,
      status:bank.status,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));
    const amenitiesData = amenities.map(amenity => ({
      amenity_id: amenity.amenity_id,
      amenity_details: amenity.amenity_details,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));
    const officesData = offices.map(office => ({
      office_name: office.office_name,
      office_description: office.office_description,
      office_contact: office.office_contact,
      ip_address: formData.ip_address,
      created_by: formData.created_by
    }));

    form.append('sectors', JSON.stringify(sectorsData));
    form.append('blocks', JSON.stringify(blocksData));
    form.append('units', JSON.stringify(unitsData));
    form.append('gates', JSON.stringify(gatesData));
    form.append('assets', JSON.stringify(assetsData));
    form.append('banks', JSON.stringify(banksData));
    form.append('amenities', JSON.stringify(amenitiesData));
    form.append('offices', JSON.stringify(officesData));

    try {
      const response = await axiosInstance.post('/add-all', form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Property and all related data saved successfully",
        showConfirmButton: false,
        timer: 2000
      });

      navigate('/property/property-list');
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to save property data",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.property_name) errors.property_name = 'Required';
    if (!formData.address) errors.address = 'Required';
    if (!formData.country_id) errors.country_id = 'Required';
    if (!formData.city_id) errors.city_id = 'Required';
    if (!formData.state_id) errors.state_id  = 'Required';
    if (!formData.min_sub_members_allow) errors.min_sub_members_allow = 'Required';
    if (!formData.min_cars_allow ) errors.min_cars_allow = 'Required';
    if (!formData.min_bikes_allow) errors.min_bikes_allow = 'Required';
    if (!formData.min_house_helps_allow ) errors.min_house_helps_allow = 'Required';
    if (!formData.chairman_name) errors.chairman_name = 'Required';
    if (!formData.chairman_contact_no) errors.chairman_contact_no = 'Required';
    if (!formData.chairman_email) errors.chairman_email = 'Required';
    if (!formData.emergency_name) errors.emergency_name = 'Required';
    if (!formData.emergency_contact_no) errors.emergency_contact_no = 'Required';
    if (!formData.emergency_email) errors.emergency_email = 'Required';
    if (!formData.additional_parking_charges) errors.additional_parking_charges = 'Required';
    if (!formData.is_payment_gateway_visible) errors.is_payment_gateway_visible = 'Required'
    return errors;
  };

  const handleCancel = () => navigate('/property/property-list');

  return (
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
            <input type="text" name="property_name" 
                 value={formData.property_name} onChange={handleChange}/>
          {errors.property_name && <p className="error">{errors.property_name}</p>}
          </div>

        <div className="input-box">
              <span className="details">Logo</span>
          <input type="file" name="logo" onChange={handleChange} />
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
        <span className="details">Country</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="country_id" 
                 value={formData.country_id} onChange={handleChange}/>
          {errors.country_id && <p className="error">{errors.country_id}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">City</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="city_id" 
                 value={formData.city_id} onChange={handleChange}/>
          {errors.city_id && <p className="error">{errors.city_id}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">State</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="state_id" 
                 value={formData.state_id} onChange={handleChange}/>
          {errors.state_id && <p className="error">{errors.state_id}</p>}
      </div>
      
      <div className="input-box">
        <span className="details">Google Location</span>
        <input type="text" name="google_location" 
                 value={formData.google_location} onChange={handleChange}/>
      </div>

          <div className="input-box">
              <span className="details">Latitude</span>
            <input type="text" name="latitude" 
                 value={formData.latitude} onChange={handleChange}/>
          </div>

          <div className="input-box">
              <span className="details">Longitude</span>
            <input type="text" name="longitude" 
                 value={formData.longitude} onChange={handleChange}/>
          </div>
          <div className="input-box">
        <span className="details">GST number</span>
        <input type="text" name="gst_number" 
                 value={formData.gst_number} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Total sectors</span>
        <input type="text" name="total_sectors" 
                 value={formData.total_sectors} onChange={handleChange}/>
      </div>

      <div className="input-box">
        <span className="details">Total blocks</span>
        <input type="text" name="total_blocks" 
                 value={formData.total_blocks} onChange={handleChange}/>
      </div>

      <div className="input-box">
        <span className="details">Total units</span>
        <input type="text" name="total_units" 
                 value={formData.total_units} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Total offices</span>
        <input type="text" name="total_offices" 
                 value={formData.total_offices} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Total amenities</span>
        <input type="text" name="total_amenities" 
                 value={formData.total_amenities} onChange={handleChange}/>
      </div>

      <div className="input-box">
        <span className="details">Total gates</span>
        <input type="text" name="total_gates" 
                 value={formData.total_gates} onChange={handleChange}/>
      </div>

      <div className="input-box">
        <span className="details">Total parkings</span>
        <input type="text" name="total_parkings" 
                 value={formData.total_parkings} onChange={handleChange}/>
      </div>

      <div className="input-box">
        <span className="details">Total guest parking</span>
        <input type="text" name="total_guest_parking" 
                 value={formData.total_guest_parking} onChange={handleChange}/>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min sub members allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_sub_members_allow" 
                 value={formData.min_sub_members_allow} onChange={handleChange}/>
          {errors.min_sub_members_allow && <p className="error">{errors.min_sub_members_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min cars allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_cars_allow" 
                 value={formData.min_cars_allow} onChange={handleChange}/>
          {errors.min_cars_allow && <p className="error">{errors.min_cars_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min bikes allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_bikes_allow" 
                 value={formData.min_bikes_allow} onChange={handleChange}/>
          {errors.min_bikes_allow && <p className="error">{errors.min_bikes_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Min house helps allow</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="min_house_helps_allow" 
                 value={formData.min_house_helps_allow} onChange={handleChange}/>
          {errors.min_house_helps_allow && <p className="error">{errors.min_house_helps_allow}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Chairman name</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="chairman_name" 
                 value={formData.chairman_name} onChange={handleChange}/>
          {errors.chairman_name && <p className="error">{errors.chairman_name}</p>}
      </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Contact number</span>
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
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency name</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_name" 
                 value={formData.emergency_name} onChange={handleChange}/>
          {errors.emergency_name && <p className="error">{errors.emergency_name}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency contact number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_contact_no" 
                 value={formData.emergency_contact_no} onChange={handleChange}/>
          {errors.emergency_contact_no && <p className="error">{errors.emergency_contact_no}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Emergency email</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="emergency_email" 
                 value={formData.emergency_email} onChange={handleChange}/>
          {errors.emergency_email && <p className="error">{errors.emergency_email}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Additional parking charges</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="additional_parking_charges" 
                 value={formData.additional_parking_charges} onChange={handleChange}/>
          {errors.additional_parking_charges && <p className="error">{errors.additional_parking_charges}</p>}
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Is payment gateway visible</span>
        <span className="required">*</span>
        </div>
       <select name="is_payment_gateway_visible" 
                 value={formData.is_payment_gateway_visible} onChange={handleChange}>
        <option value="">-Select-</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
       </select>
       {errors.is_payment_gateway_visible && <p className="error">{errors.is_payment_gateway_visible}</p>}
      </div>
            <div className="button-all">
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addSector}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Sector
              </button>
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addGate}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Gate
              </button>
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addAssets}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Assets
              </button>
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addBanks}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Bank
              </button>
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addAmenity}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Amenity
              </button>
              <button type="button" className="custom-button mb-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={addOffice}>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Add Office
              </button>
            </div>
          </div>
          <hr />
          {sectors.map((sector, sectorIndex) => (
            <div key={sectorIndex} className="mb-4 p-2 border rounded">
               <h4>Sector {sectorIndex + 1}</h4>
               <div className="user-details">
              <div className="input-box">
                <span className="details">Sector Name</span>
                <input type="text" name="sector_name" value={sector.sector_name} onChange={(e) => handleInputChange(e, {sectorIndex})} />
              </div>
              
              <div className="input-box">
                <span className="details">Description</span>
                <textarea name="sector_description" value={sector.sector_description} onChange={(e) => handleInputChange(e, {sectorIndex})} />
              </div>

              <button type="button" onClick={() => addBlock(sectorIndex)} className="mb-2 px-2 py-1 bg-blue-500 text-white rounded add-block-btn">
              <FontAwesomeIcon icon={faPlus} />&nbsp;Add Block
              </button>
              {sector.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="ml-4 p-2 border rounded">
                  <h4>Block {blockIndex + 1}</h4>
                  <div className="user-details">
                  <div className="input-box">
                    <span className="details">Block Name</span>
                    <input type="text" name="block_name" value={block.block_name} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex})} />
                  </div>
                  <div className="input-box">
                    <span className="details">Total Units</span>
                    <input type="text" name="total_units" value={block.total_units} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex})} />
                  </div>
                  <div className="input-box">
                    <span className="details">Unit number start from</span>
                    <input type="text" name="unit_number_start_from" value={block.unit_number_start_from} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex})} />
                  </div>
                  <div className="input-box">
                    <span className="details">Unit number end to</span>
                    <input type="text" name="unit_number_end_to" value={block.unit_number_end_to} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex})} />
                  </div>
                  <button type="button" onClick={() => addUnit(sectorIndex, blockIndex)} className="mb-2 px-2 py-1 bg-green-500 text-white rounded add-block-btn">
                  <FontAwesomeIcon icon={faPlus} />&nbsp; Add Unit
                  </button>
                  {block.units.map((unit, unitIndex) => (
                    <div key={unitIndex} className="ml-4 p-2 border rounded">
                      <h4>Unit {unitIndex + 1}</h4>
                      <div className="user-details">
                      <div className="input-box">
                        <span className="details">Floor number</span>
                        <input type="text" name="floor_number" value={unit.floor_number} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex, unitIndex})} />
                      </div>
                      <div className="input-box">
                        <span className="details">Unit number</span>
                        <input type="text" name="unit_number" value={unit.unit_number} onChange={(e) => handleInputChange(e, {sectorIndex, blockIndex, unitIndex})} />
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
                </div>
              ))}
            </div>
            </div>
          ))}

{gates.map((gate, index) => (
     <div key={index} className="mb-4 p-2 border rounded">
        <h4>Gate {index+1}</h4>
      <div className="user-details">
        <div className="input-box">
          <div className="details-container">
              <span className="details">Gate name</span>
              <span className="required">*</span>
        </div>
             <input type="text" name="gate_name" value={gate.gate_name} onChange={(e) => handleInputChange(e, { gateIndex: index })} />
             {errors.gate_name && <p className="error">{errors.gate_name}</p>}
        </div>
      
         <div className="input-box">
              <span className="details">Description</span>
              <textarea 
            name="gate_description"  value={gate.gate_description} onChange={(e) => handleInputChange(e, { gateIndex: index })}
            />
            {errors.gate_description && <p className="error">{errors.gate_description}</p>}
        </div>

    <div className="input-box">
       <div className="details-container">
        <span className="details">Is main gate</span>
        <span className="required">*</span>
        </div>
       <select name="is_main_gate" value={gate.is_main_gate} onChange={(e) => handleInputChange(e, { gateIndex: index })}
       >
          <option>-Select-</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
       </select>
       {errors.is_main_gate && <p className="error">{errors.is_main_gate}</p>}
      </div>
     </div>
     </div>
     ))} 

{assets.map ((asset,index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <h4>Asset {index+1}</h4>
            <div className="user-details">
         <div className="input-box">
           <div className="details-container">
              <span className="details">Asset name</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="asset_name" value={asset.asset_name} onChange={(e) => handleInputChange(e, { assetIndex: index })}
 />
        </div>
      
         <div className="input-box">
              <span className="details">Description</span>
            <textarea name="asset_description" value={asset.asset_description} onChange={(e) => handleInputChange(e, { assetIndex: index })}
 />
        </div>
     </div>
     </div>
     ))}

{banks.map((bank,i) =>(
  <div key={i} className="mb-4 p-2 border rounded">
    <h4>Bank{i+1}</h4>
              <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                        <span className="details">Bank name</span>
                        <span className="required">*</span>
                  </div>
                       <input type="text" name="bank_name" value={bank.bank_name} onChange={(e) => handleInputChange(e, { bankIndex: i })}
                       />
                       {errors.bank_name && <p className="error">{errors.bank_name}</p>}
                  </div>
                
                   <div className="input-box">
                      <div className="details-container">
                        <span className="details">Branch</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_branch"  value={bank.bank_branch}  onChange={(e) => handleInputChange(e, { bankIndex: i })} />
                      {errors.bank_branch && <p className="error">{errors.bank_branch}</p>}
                  </div> 
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">IFSC</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_ifsc" value={bank.bank_ifsc}  onChange={(e) => handleInputChange(e, { bankIndex: i })} />
                      {errors.bank_ifsc && <p className="error">{errors.bank_ifsc}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account number</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_number" value={bank.bank_account_number}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                      {errors.bank_account_number && <p className="error">{errors.bank_account_number}</p>}
                  </div>
          
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account type</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_type"  value={bank.bank_account_type}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                      {errors.bank_account_type && <p className="error">{errors.bank_account_type}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account name</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_name" value={bank.bank_account_name}  onChange={(e) => handleInputChange(e, { bankIndex: i })} />
                      {errors.bank_account_name && <p className="error">{errors.bank_account_name}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Account holder</span>
                        <span className="required">*</span>
                      </div>
                      <input type="text" name="bank_account_holder" value={bank.bank_account_holder}  onChange={(e) => handleInputChange(e, { bankIndex: i })} />
                      {errors.bank_account_holder && <p className="error">{errors.bank_account_holder}</p>}
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Is primary</span>
                        <span className="required">*</span>
                      </div>
                      <select name="is_primary" value={bank.is_primary}  onChange={(e) => handleInputChange(e, { bankIndex: i })} >
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
                      <select name="is_payment_gateway" value={bank.is_payment_gateway}  onChange={(e) => handleInputChange(e, { bankIndex: i })}>
                        <option value="">-Select-</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.is_payment_gateway && <p className="error">{errors.is_payment_gateway}</p>}
                    </div>
          
                  {bank.is_payment_gateway === "yes" && (
                      <>
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Payment gateway name</span>
                            <span className="required">*</span>
                          </div>
                          <input type="text" name="payment_gateway_name" value={bank.payment_gateway_name} onChange={(e) => handleInputChange(e, { bankIndex: i })} />
                          {errors.payment_gateway_name && <p className="error">{errors.payment_gateway_name}</p>}
                        </div>
          
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Merchant name</span>
                            <span className="required">*</span>
                          </div>
                          <input type="text" name="merchant_name" value={bank.merchant_name}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                          {errors.merchant_name && <p className="error">{errors.merchant_name}</p>}
                        </div>
          
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Payment gateway mode</span>
                            <span className="required">*</span>
                          </div>
                          <select name="payment_gateway_mode" value={bank.payment_gateway_mode}  onChange={(e) => handleInputChange(e, { bankIndex: i })}>
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
                      <input type="text" name="live_key_id"  value={bank.live_key_id}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
          
                  <div className="input-box">
                        <span className="details">Live secret key</span>
                      <input type="text" name="live_secret_key" value={bank.live_secret_key }  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
          
                  <div className="input-box">
                        <span className="details">Live account number</span>
                      <input type="text" name="live_account_number"  value={bank. live_account_number} onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
          
                  <div className="input-box">
                        <span className="details">Test key id</span>
                      <input type="text" name="test_key_id" value={bank.test_key_id} onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
          
                  <div className="input-box">
                        <span className="details">Test secret key</span>
                      <input type="text" name="test_secret_key"  value={bank.test_secret_key}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
                  <div className="input-box">
                        <span className="details">Test account number</span>
                      <input type="text" name="test_account_number" value={bank.test_account_number}  onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
                  <div className="input-box">
                        <span className="details">Currency</span>
                      <input type="text" name="currency"  value={bank.currency} onChange={(e) => handleInputChange(e, { bankIndex: i })}/>
                  </div>
                  <div className="input-box">
                      <div className="details-container">
                        <span className="details">Payment gateway status</span>
                        <span className="required">*</span>
                      </div>
                      <select name="payment_gateway_status" value={bank.payment_gateway_status}  onChange={(e) => handleInputChange(e, { bankIndex: i })}>
                   <option value="">-Select-</option>
                   <option value="enable">Enable</option>
                   <option value="disable">Disable</option>
                 </select>
                      {errors.payment_gateway_status && <p className="error">{errors.payment_gateway_status}</p>}
                  </div>
               </div>
               </div>
     ))}

{amenities.map((amenity,i) => (
  <div key={i} className="mb-4 p-2 border rounded">
    <h4>Amenity{i+1}</h4>
        <div className="user-details">
          <div className="input-box">
          <div className="details-container">
            <span className="details">Amenity id</span>
            <span className="required" >*</span>
            </div>
            <select name="amenity_id" value={amenity.amenity_id} onChange={(e) => handleInputChange(e, { amenityIndex: i })}
            >
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
            <input type="text"  name="amenity_details" value={amenity.amenity_details} onChange={(e) => handleInputChange(e, { amenityIndex: i })}
            />
          </div>
         </div>
         </div>
     ))}

     {offices.map((office,i) =>(
      <div key={i} className="mb-4 p-2 border rounded">
        <h4>Office{i+1}</h4>
      <div className="user-details">
     <div className="input-box">
     <div className="details-container">
       <span className="details">Office name</span>
       <span className="required">*</span>
       </div>
       <input type="text"  name="office_name" value={office.office_name} onChange={(e) => handleInputChange(e, { officeIndex: i })}
       />
       {errors.office_name && <p className="error">{errors.office_name}</p>}
     </div>

     <div className="input-box">
       <span className="details">Description</span>
       <textarea name="office_description" value={formData.office_description} onChange={(e) => handleInputChange(e, { officeIndex: i })}
       />
     </div>
     
     <div className="input-box">
     <div className="details-container">
       <span className="details">Contact</span>
       <span className="required">*</span>
       </div>
       <input type="tel" name="office_contact" value={formData.office_contact} onChange={(e) => handleInputChange(e, { officeIndex: i })}
       />
       {errors.office_contact && <p className="error">{errors.office_contact}</p>}
     </div>
    </div>
    </div>
     ))}
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

