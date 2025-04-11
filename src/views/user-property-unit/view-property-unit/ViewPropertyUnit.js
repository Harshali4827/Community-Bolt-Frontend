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
import PropTypes from 'prop-types'; 
const ViewPropertyunits = ({ open, onClose, units }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Member Property Unit Details</DialogTitle>
      <DialogContent>
        {units && (
          <div className="gate-details">
             <div className="detail-row">
              <span className="detail-label">User name</span>
              <span className="detail-value">{units.user_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Property name</span>
              <span className="detail-value">{units.property_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Sector name</span>
              <span className="detail-value">{units.sector_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Block name</span>
              <span className="detail-value">{units.block_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Unit </span>
              <span className="detail-value">{units.unit_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label"> Floor number</span>
              <span className="detail-value">{units.floor_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Unit status</span>
              <span className="detail-value">{units.unit_status_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Unit combination</span>
              <span className="detail-value">{units.unit_combination}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Membership no </span>
              <span className="detail-value">{units.membership_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">User role</span>
              <span className="detail-value">{units.role_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Share holding no</span>
              <span className="detail-value">{units.share_holding_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Share certificate nos</span>
              <span className="detail-value">{units.share_certificate_nos}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Share certificate bank name </span>
              <span className="detail-value">{units.share_certificate_bank_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Kids count</span>
              <span className="detail-value">{units.kids_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Senior citizen count</span>
              <span className="detail-value">{units.senior_citizen_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Male count</span>
              <span className="detail-value">{units.male_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Female count</span>
              <span className="detail-value">{units.female_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total people count</span>
              <span className="detail-value">{units.total_people_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Alloted 4 wheel parking count</span>
              <span className="detail-value">{units. alloted_four_wheel_parking_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Alloted 2 wheel parking count</span>
              <span className="detail-value">{units.alloted_two_wheel_parking_count}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nominee names and per </span>
              <span className="detail-value">{units. nominee_names_and_per}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Club due date</span>
              <span className="detail-value">{units.club_due_date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Four sos number</span>
              <span className="detail-value">{units.four_sos_number}</span>
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
ViewPropertyunits.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    units: PropTypes.shape({
      user_name: PropTypes.string,
      property_name: PropTypes.string,
      sector_name: PropTypes.string,
      block_name: PropTypes.string,
      unit_number: PropTypes.string,
      floor_number:PropTypes.string,
      unit_status_id: PropTypes.string,
      unit_combination: PropTypes.string,
      membership_no: PropTypes.string,
      role_name: PropTypes.string,
      share_holding_no: PropTypes.string,
      share_certificate_nos: PropTypes.string,
      share_certificate_bank_name: PropTypes.string,
      kids_count: PropTypes.string,
      senior_citizen_count: PropTypes.string,
      male_count: PropTypes.string,
      female_count: PropTypes.string,
      total_people_count: PropTypes.string,
      alloted_four_wheel_parking_count: PropTypes.string,
      alloted_two_wheel_parking_count: PropTypes.string,
      nominee_names_and_per: PropTypes.string,
      club_due_date: PropTypes.string,
      four_sos_number: PropTypes.string,
    })
  };

export default ViewPropertyunits;
