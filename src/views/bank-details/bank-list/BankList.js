import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { faCopy, faFileExcel, faFilePdf, faPrint, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../../css/table.css';
import Swal from 'sweetalert2';
import axiosInstance from 'src/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const BankList = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [filterRecords, setFilterRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const printableRef = useRef();
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
      String(row.property_name || "").toLowerCase().includes(searchValue) ||
      String(row.sector_name || "").toLowerCase().includes(searchValue) ||
      String(row.sector_description || "").toLowerCase().includes(searchValue) ||
      String(row.status || "").toLowerCase().includes(searchValue) ||
      String(row.ip_address || "").toLowerCase().includes(searchValue) ||
      String(row.created_by || "").toLowerCase().includes(searchValue)
    );
  
    setFilterRecords(filteredData);
    setCurrentPage(1);
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Details");
    XLSX.writeFile(workbook, "Property.xlsx");
  };
  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    autoTable(doc, {
      head: [["Property name", "Bank name", "Branch", "IFSC", "Account no", "Account type","Account name","Account holder","Is primary","Is payment gateway","Payment gateway name","Merchant name","Payment gateway mode","Live key id","Live secret key","Live account number","Teat key id","Test secret key","Test account number","Currency","Payment gateway status"]],
      body: data.map(item => [
        item.property_name,
        item.bank_name,
        item.bank_branch,
        item.bank_ifsc,
        item.bank_account_number,
        item.bank_account_type,
        item.bank_account_name,
        item.bank_account_holder,
        item.is_primary,
        item.is_payment_gateway,
        item.payment_gateway_name,
        item.merchant_name,
        item.payment_gateway_mode,
        item.live_key_id,
        item.live_secret_key,
        item.live_account_number,
        item.test_key_id,
        item.test_secret_key,
        item.test_account_number,
        item.currency,
        item.payment_gateway_status
       ]),
    });
  
    doc.save("BankDetails.pdf");
  };

  // Print
  const handlePrint = () => {
    const printContent = printableRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
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
        <div className="buttons">
          <CopyToClipboard
            text={JSON.stringify(data, null, 2)}
            onCopy={() => {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });

              Toast.fire({
                icon: "success",
                title: "Data Copied Successfully!"
              });
            }}>
            <button className="btn2" title="Copy"><FontAwesomeIcon icon={faCopy} /></button>
          </CopyToClipboard>
          <button className="btn2" title="Excel" onClick={exportExcel}><FontAwesomeIcon icon={faFileExcel} /></button>
          <button className="btn2" title="PDF" onClick={exportPdf}><FontAwesomeIcon icon={faFilePdf} /></button>
          <button className="btn2" title="Print" onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
          <button className="btn2"><CSVLink data={data} filename="BankDetails.csv" title="CSV" className="csv-link"><FontAwesomeIcon icon={faFileCsv} />
          </CSVLink>
          </button>
        </div>
        <Link to='/bank-details/add-bank'>
          <button className="new-user-btn" >+ New Bank</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Property name</th>
            <th>Bank name</th>
            <th>Bank branch</th>
            <th>IFSC</th>
            <th>Account number</th>
            <th>Type</th>
            <th>Account name</th>
            <th>Account holder</th>
            <th>Payment gateway name</th>
            <th>Merchant name</th>
            <th>Payment gateway mode</th>
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
                  <td>{bank.property_name}</td>
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
