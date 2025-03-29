import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function AddPropertyUnit(){
const [formData, setFormData] = useState({
        user_id:'',
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
      const [properties, setProperties] = useState([]);
      const [amenityMasters, setAmenityMasters] = useState([]);
      const navigate = useNavigate();
    
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
          const response = await axiosInstance.post('/amenity',formData);
          Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
         navigate('/amenity/amenity-list');
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
      navigate('/amenity/amenity-list')
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
               <select name="property_id" value={formData.property_id} onChange={handleChange}>
                    <option value="">-Select Property-</option>
                    {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                        {property.property_name}
                    </option>
                    ))}
              </select>
              {errors.property_id && <p className="error">{errors.property_id}</p>}
            </div>
    <div className="input-box">
              <div className="details-container">
                <span className="details">Property</span>
                <span className="required">*</span>
              </div>
               <select name="property_id" value={formData.property_id} onChange={handleChange}>
                    <option value="">-Select Property-</option>
                    {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                        {property.property_name}
                    </option>
                    ))}
              </select>
              {errors.property_id && <p className="error">{errors.property_id}</p>}
            </div>

        <div className="input-box">
              <div className="details-container">
                <span className="details">Property sector</span>
                <span className="required">*</span>
              </div>
              <select name="property_sector_id" value={formData.property_sector_id} onChange=        {handleChange}>
                 <option value="">-Select Sector-</option>
                    {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.sector_name}
                    </option>
                    ))}
                 </select>
              {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
            </div>

          <div className="input-box">
              <div className="details-container">
                <span className="details">Property block</span>
                <span className="required">*</span>
              </div>
             <select name="property_block_id" value={formData.property_block_id} onChange={handleChange}>
                    <option value="">-Select Block-</option>
                    {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                           {block.block_name}
                    </option>
                    ))}
                 </select>
              {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
            </div>

            <div className="input-box">
              <div className="details-container">
                <span className="details">Property unit</span>
                <span className="required">*</span>
              </div>
              <select name="property_unit_id" value={formData.property_unit_id} onChange={handleChange}>
                <option value="">-Select Unit-</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                   {unit.unit_number}
                  </option>
                ))}
              </select>
              {errors.property_unit_id && <p className="error">{errors.property_unit_id}</p>}
            </div>

      <div className="input-box">
      <div className="details-container">
        <span className="details">Floor number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="floor_number" value={formData.floor_number} onChange={handleChange}/>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">Unit number</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="unit_number" value={formData.unit_number} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Unit status</span>
        <input type="text" name="unit_status_id" value={formData.unit_status_id} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Unit combination</span>
        <input type="text" name="unit_combination" value={formData.unit_combination} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Membership no</span>
        <input type="text" name="membership_no " value={formData.membership_no} onChange={handleChange}/>
      </div>
      <div className="input-box">
      <div className="details-container">
        <span className="details">User role</span>
        <span className="required">*</span>
        </div>
        <input type="text" name="user_role_id" value={formData.user_role_id} onChange={handleChange}/>
      </div>
      <div className="input-box">
        <span className="details">Share holding no</span>
        <input type="text" name="share_holding_no" value={formData.share_holding_no} onChange={handleChange}/>
      </div>
          <div className="input-box">
              <span className="details">Share certificate nos</span>
             <input type="text" name="share_certificate_nos" value={formData.share_certificate_nos} onChange={handleChange} />
             {errors.share_certificate_nos && <p className="error">{errors.share_certificate_nos}</p>}
          </div>
          <div className="input-box">
              <span className="details">Share certificate bank name</span>
             <input type="text" name="share_certificate_bank_name" value={formData.share_certificate_bank_name} onChange={handleChange} />
             {errors.share_certificate_bank_name && <p className="error">{errors.share_certificate_bank_name}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Kids count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="kids_count" value={formData.kids_count} onChange={handleChange} />
             {errors.kids_count && <p className="error">{errors.kids_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Senior citizen count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name=" senior_citizen_count" value={formData. senior_citizen_count} onChange={handleChange} />
             {errors.senior_citizen_count && <p className="error">{errors. senior_citizen_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Male count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="male_count" value={formData.male_count} onChange={handleChange} />
             {errors.male_count && <p className="error">{errors.male_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Femele count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="female_count" value={formData.female_count} onChange={handleChange} />
             {errors.female_count && <p className="error">{errors.female_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Total people count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="total_people_count" value={formData.total_people_count} onChange={handleChange} />
             {errors.total_people_count && <p className="error">{errors.total_people_count}</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Alloted 4 wheel parking count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="alloted_four_wheel_parking_count " value={formData.alloted_four_wheel_parking_count } onChange={handleChange} />
             {errors.alloted_four_wheel_parking_count  && <p className="error">{errors.alloted_four_wheel_parking_count }</p>}
          </div>
          <div className="input-box">
          <div className="details-container">
              <span className="details">Alloted 2 wheel parking count</span>
              <span className="required">*</span>
           </div>
             <input type="text" name="alloted_two_wheel_parking_count " value={formData.alloted_two_wheel_parking_count} onChange={handleChange} />
             {errors.alloted_two_wheel_parking_count && <p className="error">{errors.alloted_two_wheel_parking_count}</p>}
          </div>
          <div className="input-box">
              <span className="details">Nominee names and per</span>
             <textarea name="nominee_names_and_per " value={formData.nominee_names_and_per } onChange={handleChange} />
             {errors.nominee_names_and_per  && <p className="error">{errors.nominee_names_and_per }</p>}
          </div>
          <div className="input-box">
              <span className="details">Club due date</span>
             <input type="date" name="club_due_date" value={formData.club_due_date  } onChange={handleChange} />
          </div>
          <div className="input-box">
              <span className="details">Four sos number</span>
             <input type="text" name="four_sos_number" value={formData.four_sos_number} onChange={handleChange} />
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
export default AddPropertyUnit;