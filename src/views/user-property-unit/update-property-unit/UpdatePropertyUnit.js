import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAddressBook,cilBadge, cilBank, cilBike, cilBuilding, cilCalendar, cilCarAlt, cilChartPie, cilCheckCircle,cilChild,cilElevator,cilGrid,cilGroup,cilHome,cilLayers, cilPhone, cilSettings, cilUser, cilUserFemale, cilWallet } from '@coreui/icons';
function UpdatePropertyUnit(){
  const location = useLocation();
  const userId = location.state?.userId;
const [formData, setFormData] = useState({
        user_id: userId || '',
        property_id: '',
        property_sector_id: '',
        property_block_id: '',
        property_unit_id:'',
        floor_number: '0',
        unit_number:'',
        unit_status_id:'',
        unit_combination:'',
        membership_no:'',
        user_role_id:'',
        share_holding_no:'',
        share_certificate_nos:'',
        share_certificate_bank_name:'',
        kids_count:'0',
        senior_citizen_count:'0',
        male_count:'0',
        female_count:'0',
        total_people_count:'0',
        alloted_four_wheel_parking_count:'0',
        alloted_two_wheel_parking_count:'0',
        nominee_names_and_per:'',
        club_due_date:'',
        four_sos_number: ''
      });
    
      const [errors, setErrors] = useState({});
      const [sectors, setSectors] = useState([]);
      const [blocks, setBlocks] = useState([]);
      const [units, setUnits] = useState([]);
      const [usersRole, setUsersRole] = useState([])
      const [properties, setProperties] = useState([]);
      const [amenityMasters, setAmenityMasters] = useState([]);
      const [users, setUsers] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();

      useEffect(() => {
        fetchPropertyUnitData();
      }, [id])
      
      const fetchPropertyUnitData = async () => {
          try {
            const response = await axiosInstance.get(`/user-property-units/unit/${id}`);
            console.log('Fetched data:', response.data);
            if (response.data) {
                setFormData(response.data);
              }
          } catch (error) {
            console.error('Error fetching property unit data:', error);
          }
        };
      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axiosInstance.get('/users');
            setUsers(response.data);
          } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to load users',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        };
    
        fetchUsers ();
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

     useEffect(() => {
        if (formData.property_id) {
          const fetchSectorsByProperty = async () => {
            try {
              const response = await axiosInstance.get(`/sectors/property/${formData.property_id}`);
              setSectors(response.data);
              setFormData(prev => ({ ...prev, property_sector_id: "", property_block_id: "" })); 
            } catch (error) {
              console.error("Error fetching sectors:", error);
            }
          };
          fetchSectorsByProperty();
        }
      }, [formData.property_id]);
      

       useEffect(() => {
        if (formData.property_sector_id) {
          const fetchBlocksBySector = async () => {
            try {
              const response = await axiosInstance.get(`/blocks/sectors/${formData.property_sector_id}`);
              setBlocks(response.data);
              setFormData(prev => ({ ...prev, property_block_id: "" }));
            } catch (error) {
              console.error("Error fetching blocks:", error);
            }
          };
          fetchBlocksBySector();
        }
      }, [formData.property_sector_id]);
    

      useEffect(() => {
        if (formData.property_block_id) {
          const fetchUnitsByBlock = async () => {
            try {
              const response = await axiosInstance.get(`/units/blocks/${formData.property_block_id}`);
              setUnits(response.data);
              setFormData(prev => ({ ...prev, property_unit_id: "" }));
            } catch (error) {
              console.error("Error fetching units:", error);
            }
          };
          fetchUnitsByBlock();
        }
      }, [formData.property_block_id]);
    
    
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

      useEffect(() => {
        const fetchUsersRole = async () => {
          try {
            const response = await axiosInstance.get('/users-role');
            setUsersRole(response.data);
          } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to load users',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        };
    
        fetchUsersRole ();
      }, []);
        

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
         if (name === "property_id") {
          setSectors([]);
          setBlocks([]);
          setUnits([]);
        }
        if (name === "property_sector_id") {
          setBlocks([]);
          setUnits([]);
        }
        if (name === "property_block_id") {
          setUnits([]);
        }
        if (name === "property_unit_id") {
          const selectedUnit = units.find((unit) => unit.id === parseInt(value));
          if (selectedUnit) {
            setFormData((prevData) => ({ ...prevData, unit_number: selectedUnit.unit_number }));
          } else {
            setFormData((prevData) => ({ ...prevData, unit_number: '' }));
          }
        }

        let sectorName = formData.sector_name || "";
        let blockName = formData.block_name || "";
        let unitNumber = formData.unit_number || "";
      
        if (name === "property_sector_id") {
          const selectedSector = sectors.find((sector) => sector.id === parseInt(value));
          sectorName = selectedSector ? selectedSector.sector_name : "";
        }
      
        if (name === "property_block_id") {
          const selectedBlock = blocks.find((block) => block.id === parseInt(value));
          blockName = selectedBlock ? selectedBlock.block_name : "";
        }
      
        if (name === "property_unit_id") {
          const selectedUnit = units.find((unit) => unit.id === parseInt(value));
          unitNumber = selectedUnit ? selectedUnit.unit_number : "";
        }
        const unitCombination = `${sectorName}${blockName}${unitNumber}`;
      
        setFormData((prevData) => ({
          ...prevData,
          sector_name: sectorName,
          block_name: blockName,
          unit_number: unitNumber,
          unit_combination: unitCombination,
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property name is required';
        if (!formData.property_sector_id) formErrors.property_sector_id = 'sectord name is required';
        if (!formData.property_block_id ) formErrors.property_block_id  = 'Block name is required';

        if (!formData.property_unit_id) formErrors.property_unit_id = 'Unit number is required';
        
       if (!formData.floor_number) formErrors.floor_number = 'This field is required'
        
        if (!formData.unit_number) formErrors.unit_number = 'This field is required';

        if (!formData.user_role_id) formErrors.user_role_id = 'This field is required';

        if (!formData.kids_count) formErrors.kids_count = 'This field is required';

        if (!formData.senior_citizen_count) formErrors.senior_citizen_count = 'This field is required'

        if (!formData.male_count) formErrors.male_count = 'This field is required'

        if (!formData.female_count) formErrors.female_count = 'This field is required'

        if (!formData.total_people_count) formErrors.total_people_count = 'This field is required'

        if (!formData.alloted_four_wheel_parking_count) formErrors.alloted_four_wheel_parking_count = 'This field is required'

        if (!formData.alloted_two_wheel_parking_count) formErrors.alloted_two_wheel_parking_count = 'This field is required'

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/user-property-units/${id}`,formData);
          Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
         navigate('/user-property-unit');
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
      
    const handleCancel = () => {
      navigate('/user-property-unit')
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
                <span className="details">User name</span>
                <span className="required">*</span>
              </div>
              <input type="text" name='user_id' value={formData.user_id} onChange={handleChange}/>
              {errors.user_id && <p className="error">{errors.user_id}</p>}
            </div>
          <div className="input-box">
              <div className="details-container">
                <span className="details">Property</span>
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
                <span className="details">Property sector</span>
                <span className="required">*</span>
              </div>

      <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilBuilding} />
    </CInputGroupText>
    <CFormSelect
      name="property_sector_id"
      value={formData.property_sector_id}
      onChange={handleChange}
    >
      <option value="">-Select Sector-</option>
                    {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.sector_name}
                    </option>
      ))}
    </CFormSelect>
  </CInputGroup>

              {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
            </div>
              <div className="input-box">
              <div className="details-container">
                <span className="details">Property block</span>
                <span className="required">*</span>
              </div>
        <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilGrid} />
    </CInputGroupText>
    <CFormSelect
      name="property_block_id"
      value={formData.property_block_id}
      onChange={handleChange}
    >
       <option value="">-Select Block-</option>
                    {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                           {block.block_name}
                    </option>
      ))}
    </CFormSelect>
  </CInputGroup>
              {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
            </div>

            <div className="input-box">
              <div className="details-container">
                <span className="details">Property unit</span>
                <span className="required">*</span>
              </div>
              <CInputGroup>
               <CInputGroupText className="input-icon">
                  <CIcon icon={cilLayers} />
                   </CInputGroupText>
           <CFormSelect
      name="property_unit_id"
      value={formData.property_unit_id}
      onChange={handleChange}
    >
        <option value="">-Select Unit-</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                   {unit.unit_number}
                  </option>
      ))}
    </CFormSelect>
  </CInputGroup>
              {errors.property_unit_id && <p className="error">{errors.property_unit_id}</p>}
            </div>


      <div className="input-box">
      <div className="details-container">
        <span className="details">Floor number</span>
        <span className="required">*</span>
        </div>
        <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilElevator} /></CInputGroupText>
           <CFormInput
               type="text"
               name="floor_number"
               value={formData.floor_number}
               onChange={handleChange}
             />
             </CInputGroup>
      </div>
     
      <div className="input-box">
        <span className="details">Unit status</span>
        <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCheckCircle} /></CInputGroupText>
           <CFormInput
               type="text"
               name="unit_status_id"
               value={formData.unit_status_id}
               onChange={handleChange}
             />
             </CInputGroup>
      </div>
      <div className="input-box">
        <span className="details">Unit combination</span>
        <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilSettings} /></CInputGroupText>
           <CFormInput
               type="text"
               name="unit_combination"
               value={formData.unit_combination}
               onChange={handleChange}
             />
             </CInputGroup>
      </div>

      <div className="input-box">
    <span className="details">Membership no</span>
       <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBadge} /></CInputGroupText>
           <CFormInput
               type="text"
               name="membership_no"
               value={formData.membership_no}
               onChange={handleChange}
             />
             </CInputGroup>
</div>

      <div className="input-box">
              <div className="details-container">
                <span className="details">User role</span>
                <span className="required">*</span>
              </div>
              <select name="user_role_id" value={formData.user_role_id} onChange={handleChange}>
                <option value="">-Select role-</option>
                {usersRole.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.role_name}
                  </option>
                ))}
              </select>
              {errors.user_role_id && <p className="error">{errors.user_role_id}</p>}
            </div>
      <div className="input-box">
        <span className="details">Share holding no</span>
        <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilWallet} /></CInputGroupText>
           <CFormInput
               type="text"
               name="share_holding_no"
               value={formData.share_holding_no}
               onChange={handleChange}
             />
             </CInputGroup>
      </div>
          <div className="input-box">
              <span className="details">Share certificate nos</span>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilAddressBook} /></CInputGroupText>
           <CFormInput
               type="text"
               name="share_certificate_nos"
               value={formData.share_certificate_nos}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.share_certificate_nos && <p className="error">{errors.share_certificate_nos}</p>}
          </div>
          <div className="input-box">
              <span className="details">Share certificate bank name</span>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBank} /></CInputGroupText>
           <CFormInput
               type="text"
               name="share_certificate_bank_name"
               value={formData.share_certificate_bank_name}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.share_certificate_bank_name && <p className="error">{errors.share_certificate_bank_name}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Kids count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilChild} /></CInputGroupText>
           <CFormInput
               type="text"
               name="kids_count"
               value={formData.kids_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.kids_count && <p className="error">{errors.kids_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Senior citizen count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilGroup} /></CInputGroupText>
           <CFormInput
               type="text"
               name="senior_citizen_count"
               value={formData.floorsenior_citizen_count_number}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.senior_citizen_count && <p className="error">{errors. senior_citizen_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Male count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
           <CFormInput
               type="text"
               name="male_count"
               value={formData.male_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.male_count && <p className="error">{errors.male_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Femele count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilUserFemale} /></CInputGroupText>
           <CFormInput
               type="text"
               name="female_count"
               value={formData.female_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.female_count && <p className="error">{errors.female_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Total people count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilChartPie} /></CInputGroupText>
           <CFormInput
               type="text"
               name="total_people_count"
               value={formData.total_people_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.total_people_count && <p className="error">{errors.total_people_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Alloted 4 wheel parking count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
           <CFormInput
               type="text"
               name="alloted_four_wheel_parking_count"
               value={formData.alloted_four_wheel_parking_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.alloted_four_wheel_parking_count  && <p className="error">{errors.alloted_four_wheel_parking_count }</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Alloted 2 wheel parking count</span>
              <span className="required">*</span>
           </div>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilBike} /></CInputGroupText>
           <CFormInput
               type="text"
               name="alloted_two_wheel_parking_count"
               value={formData.alloted_two_wheel_parking_count}
               onChange={handleChange}
             />
             </CInputGroup>
             {errors.alloted_two_wheel_parking_count && <p className="error">{errors.alloted_two_wheel_parking_count}</p>}
          </div>
          <div className="input-box">
              <span className="details">Club due date</span>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
           <CFormInput
               type="text"
               name="club_due_date"
               value={formData.club_due_date}
               onChange={handleChange}
             />
             </CInputGroup>
          </div>
          <div className="input-box">
              <span className="details">Four sos number</span>
             <CInputGroup className="input-icon">
          <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
           <CFormInput
               type="text"
               name="four_sos_number"
               value={formData.four_sos_number}
               onChange={handleChange}
             />
             </CInputGroup>
          </div>
          <div className="input-box">
    <span className="details">Nominee names and per</span>
  <textarea
    type="text"
    name="nominee_names_and_per"
    value={formData.nominee_names_and_per}
    onChange={handleChange}
  />
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
export default UpdatePropertyUnit;