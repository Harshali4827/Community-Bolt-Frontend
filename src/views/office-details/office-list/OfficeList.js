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


const OfficeList = () => {
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
      const response = await axiosInstance.get(`/offices`);
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
      String(row.block_name || "").toLowerCase().includes(searchValue) ||
      String(row.unit_number || "").toLowerCase().includes(searchValue) ||
      String(row.office_name || "").toLowerCase().includes(searchValue) ||

      String(row.office_description || "").toLowerCase().includes(searchValue) ||

      String(row.office_contact || "").toLowerCase().includes(searchValue) ||

      String(row.status || "").toLowerCase().includes(searchValue) 
    );
  
    setFilterRecords(filteredData);
    setCurrentPage(1);
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "user Data");
    XLSX.writeFile(workbook, "OfficeData.xlsx");
  };
  const exportPdf = () => {
  const doc = new jsPDF({ orientation: 'landscape' });
  autoTable(doc, {
    head: [["Property Name", "Sector Name", "Block Name", "Unit Name", "Office Name", "Description", "Contact", "Status"]],
    body: data.map(item => [
      item?.property_name || "N/A",
      item?.sector_name || "N/A",
      item?.block_name || "N/A",
      item?.unit_number || "N/A",
      item?.office_name || "N/A",
      item?.office_description || "N/A",
      item?.office_contact || "N/A",
      item?.status || "N/A"
    ]),
  });

  doc.save("OfficeDetails.pdf");
};

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
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#f1b255",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/offices/${id}`);
          setData(data.filter((office) => office.id !== id));
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
          <button className="btn2"><CSVLink data={data} filename="OfficeData.csv" title="CSV" className="csv-link"><FontAwesomeIcon icon={faFileCsv} />
          </CSVLink>
          </button>
        </div>
        <Link to='/office-details/add-office'>
          <button className="new-user-btn" >+ New Office</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Property name</th>
            <th>Sector name</th>
            <th>Block name</th>
            <th>Unit number</th>
            <th>Office name</th>
            <th>Description</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentRecords.length === 0 ? (
              <tr>
                <td colSpan='4'>No office details available</td>
              </tr>
            ) : (
              currentRecords.map((office, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{office.property_name}</td>
                  <td>{office.sector_name}</td>
                  <td>{office.block_name}</td>
                  <td>{office.unit_number}</td>
                  <td>{office.office_name}</td>
                  <td>{office.office_description}</td>
                  <td>{office.office_contact}</td>
                  <td>
                 <span className={`status-text ${office.status}`}>{office.status}</span>
                </td>
                   <td>
                    <button
                    className="action-button"
                    onClick={(event) => handleClick(event, office.id)}>
                    Action
                  </button>
                  <Menu
                    id={`action-menu-${office.id}`}
                    anchorEl={anchorEl}
                    open={menuId === office.id}
                    onClose={handleClose}>
                     <Link to={`/office-details/update-office/${office.id}`}>
                         <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                     </Link>
                     
                    <MenuItem onClick={() => handleDelete(office.id)}>Delete</MenuItem>
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
           <option value={5}>5</option>
           <option value={10}>10</option>
           <option value={15}>15</option>
           <option value={15}>20</option>
           <option value={25}>25</option>
           <option value={50}>50</option>
           <option value={100}>100</option>
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

export default OfficeList;
