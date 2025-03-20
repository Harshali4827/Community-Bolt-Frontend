import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import '../../../css/table.css';
import Swal from 'sweetalert2';
import axiosInstance from 'src/axiosInstance';


const BankList = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [filterRecords, setFilterRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bank-details`);
      setData(response.data);
      setFilterRecords(response.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };
  
  const totalPages = Math.ceil(filterRecords.length / rowsPerPage);
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filterRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleFilter = (event) => {
    const searchValue = event.target.value.toLowerCase();
  
    const filteredData = data.filter((row) =>
      String(row.property_id || "").toLowerCase().includes(searchValue) ||
      String(row.sector_name || "").toLowerCase().includes(searchValue) ||
      String(row.sector_description || "").toLowerCase().includes(searchValue) ||
      String(row.status || "").toLowerCase().includes(searchValue) ||
      String(row.ip_address || "").toLowerCase().includes(searchValue) ||
      String(row.created_by || "").toLowerCase().includes(searchValue)
    );
  
    setFilterRecords(filteredData);
    setCurrentPage(1);
  };
  
const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006cb5",
      cancelButtonColor: "#f1b255",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/bank-details/${id}`);
          setData(data.filter((bank) => bank.id !== id));
          fetchData(); 
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error"
          });
        }
      }
    });
  };

  const renderPagination = () => {
    return (
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="page-icon"
          disabled={currentPage === 1}
          title="Previous Page">
          <ChevronLeft />
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="page-icon"
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          <ChevronRight />
        </button>
      </div>
    );
  };  

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search..." onChange={handleFilter}/>
          <SearchOutlinedIcon />
        </div>
        <Link to='/bank-details/add-bank'>
          <button className="new-user-btn" >+ New Bank</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>SR.NO</th>
            <th>Property ID</th>
            <th>Bank Name</th>
            <th>Bank Branch</th>
            <th>IFSC</th>
            <th>Account Number</th>
            <th>Type</th>
            <th>Account Name</th>
            <th>Account Holder</th>
            <th>Payment Gateway Name</th>
            <th>Merchant Name</th>
            <th>Payment Gateway Mode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentRecords.length === 0 ? (
              <tr>
                <td colSpan='4'>No Bank Details available</td>
              </tr>
            ) : (
              currentRecords.map((bank, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{bank.property_id}</td>
                  <td>{bank.bank_name}</td>
                  <td>{bank.bank_branch}</td>
                  <td>{bank.bank_ifsc}</td>
                  <td>{bank.bank_account_number}</td>
                  <td>{bank.bank_account_type}</td>
                  <td>{bank.bank_account_name}</td>
                  <td>{bank.bank_account_holder}</td>
                  <td>{bank.payment_gateway_name}</td>
                  <td>{bank.merchant_name}</td>
                  <td>{bank.payment_gateway_mode}</td>
                  <td>
                 <span className={`status-text ${bank.status}`}>{bank.status}</span>
                </td>
                   <td>
                    <button
                    className="action-button"
                    onClick={(event) => handleClick(event, bank.id)}>
                    Action
                  </button>
                  <Menu
                    id={`action-menu-${bank.id}`}
                    anchorEl={anchorEl}
                    open={menuId === bank.id}
                    onClose={handleClose}>
                     <Link to={`/bank-details/update-bank/${bank.id}`}>
                         <MenuItem style={{ color: 'black'}}>Edit</MenuItem>
                     </Link>
                    <MenuItem onClick={() => handleDelete(bank.id)}>Delete</MenuItem>
                  </Menu>
                </td>
                </tr>
              ))
            )
          }
        </tbody>
      </table>
      </div>
      <div className="pagination-options-container">
          <div className="rows-per-page">
         <label htmlFor="rows-per-page">Rows per page:</label>
        <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}>
           <option value={7}>7</option>
           <option value={5}>5</option>
           <option value={10}>10</option>
           <option value={15}>15</option>
           <option value={15}>20</option>
           <option value={25}>25</option>
           <option value={50}>50</option>
           <option value={100}>100</option>
           <option value={150}>150</option>
           <option value={200}>200</option>
       </select>
      </div>
       <div className="pagination-buttons">
          {renderPagination()}
        </div>
     </div>
    </div>
  );
};

export default BankList;
