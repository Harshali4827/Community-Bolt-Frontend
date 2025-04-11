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
const ViewBank = ({ open, onClose, bank }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bank Details</DialogTitle>
      <DialogContent>
        {bank && (
          <div className="gate-details">
            <div className="detail-row">
              <span className="detail-label">Property Name:</span>
              <span className="detail-value">{bank.property_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Bank Name:</span>
              <span className="detail-value">{bank.bank_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Branch </span>
              <span className="detail-value">{bank.bank_branch}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">IFSC </span>
              <span className="detail-value">{bank.bank_ifsc}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label"> Account Number </span>
              <span className="detail-value">{bank.bank_account_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Type </span>
              <span className="detail-value">{bank.bank_account_type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Name </span>
              <span className="detail-value">{bank.bank_account_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Holder</span>
              <span className="detail-value">{bank.bank_account_holder}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Is Primary </span>
              <span className="detail-value">{bank.is_primary}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Is payment gateway </span>
              <span className="detail-value">{bank.bank_branch}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment gateway name </span>
              <span className="detail-value">{bank.payment_gateway_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Merchant name </span>
              <span className="detail-value">{bank.merchant_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment gateway mode </span>
              <span className="detail-value">{bank.payment_gateway_mode}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Live key id </span>
              <span className="detail-value">{bank.live_key_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Live secret key </span>
              <span className="detail-value">{bank.live_secret_key}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Live account number </span>
              <span className="detail-value">{bank.live_account_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Test key id </span>
              <span className="detail-value">{bank.test_key_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Test secret key </span>
              <span className="detail-value">{bank.test_secret_key}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Test account number </span>
              <span className="detail-value">{bank.test_account_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Currency </span>
              <span className="detail-value">{bank.currency}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Branch </span>
              <span className="detail-value">{bank.payment_gateway_status}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created by </span>
              <span className="detail-value">{bank.created_by}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {bank.status === 'active' ? (
                  <FaCheckCircle className="status-icon active-icon" />
                ) : (
                  <FaTimesCircle className="status-icon inactive-icon" />
                )}
                {bank.status}
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
ViewBank.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    bank: PropTypes.shape({
      property_name: PropTypes.string,
      bank_name: PropTypes.string,
      bank_branch: PropTypes.string,
      bank_ifsc: PropTypes.string,
      bank_account_number:PropTypes.string,
      bank_account_type: PropTypes.string,
      bank_account_name: PropTypes.string,
      bank_account_holder: PropTypes.string,
      is_primary: PropTypes.string,
      is_payment_gateway: PropTypes.string,
      payment_gateway_name: PropTypes.string,
      merchant_name: PropTypes.string,
      payment_gateway_mode: PropTypes.string,
      merchant_name: PropTypes.string,
      payment_gateway_mode: PropTypes.string,
      live_key_id: PropTypes.string,
      live_secret_key: PropTypes.string,
      live_account_number: PropTypes.string,
      test_key_id: PropTypes.string,
      test_secret_key: PropTypes.string,
      test_account_number: PropTypes.string,
      currency: PropTypes.string,
      payment_gateway_status: PropTypes.string,
      created_by: PropTypes.string,
      status: PropTypes.string
    })
  };

export default ViewBank;
