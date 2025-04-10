import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../../../css/view.css'
const ViewProperty = ({ open, onClose, property }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Property Details</DialogTitle>
      <DialogContent>
        {property && (
          <div className="gate-details">
            <div className="detail-row">
              <span className="detail-label">Property Name:</span>
              <span className="detail-value">{property.property_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{property.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Country </span>
              <span className="detail-value">{property.country_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">City</span>
              <span className="detail-value">{property.city_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">State</span>
              <span className="detail-value">{property.state_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Google Location</span>
              <span className="detail-value">{property.google_location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lattitude</span>
              <span className="detail-value">{property.lattitude}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Longitude</span>
              <span className="detail-value">{property.longitude}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">GST Number</span>
              <span className="detail-value">{property.gst_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Sectors</span>
              <span className="detail-value">{property.total_sectors}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total blocks</span>
              <span className="detail-value">{property.total_blocks}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total units</span>
              <span className="detail-value">{property.total_offices}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total amenities</span>
              <span className="detail-value">{property.total_amenities}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total gates</span>
              <span className="detail-value">{property.total_gates}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Parkings</span>
              <span className="detail-value">{property.total_parkings}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Guest Parking</span>
              <span className="detail-value">{property.total_guest_parking}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Min sub members allow</span>
              <span className="detail-value">{property.min_sub_members_allow}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Min cars allow</span>
              <span className="detail-value">{property.min_cars_allow}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Min bikes allow</span>
              <span className="detail-value">{property.min_bikes_allow}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Min house helps allow</span>
              <span className="detail-value">{property.min_house_helps_allow}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Chairman name</span>
              <span className="detail-value">{property.chairman_name }</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Chairman contact no:</span>
              <span className="detail-value">{property.chairman_contact_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Chairman email</span>
              <span className="detail-value">{property.chairman_email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Emergency name</span>
              <span className="detail-value">{property.emergency_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Emergency contact no</span>
              <span className="detail-value">{property.emergency_contact_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Emergency email</span>
              <span className="detail-value">{property.emergency_email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Additional parking charges</span>
              <span className="detail-value">{property.additional_parking_charges}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Is payment gateway visible</span>
              <span className="detail-value">{property.is_payment_gateway_visible}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Emergency contact no</span>
              <span className="detail-value">{property.emergency_contact_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {property.status === 'active' ? (
                  <FaCheckCircle className="status-icon active-icon" />
                ) : (
                  <FaTimesCircle className="status-icon inactive-icon" />
                )}
                {property.status}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProperty;
