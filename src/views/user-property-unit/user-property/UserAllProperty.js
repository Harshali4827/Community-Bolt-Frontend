import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const UserAllProperty = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [filterRecords, setFilterRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const printableRef = useRef();
  const {id} = useParams();
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/user-property-units/${id}`);
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
      String(row.user_name || "").toLowerCase().includes(searchValue) ||
      String(row.property_name || "").toLowerCase().includes(searchValue) ||
      String(row.sector_name  || "").toLowerCase().includes(searchValue) ||
      String(row.block_name || "").toLowerCase().includes(searchValue) ||
      String(row.property_unit_id || "").toLowerCase().includes(searchValue) ||
      String(row.floor_number || "").toLowerCase().includes(searchValue) ||
      String(row.unit_number || "").toLowerCase().includes(searchValue) ||
      String(row.unit_combination  || "").toLowerCase().includes(searchValue) ||
      String(row.membership_no  || "").toLowerCase().includes(searchValue) ||
      String(row.role_name  || "").toLowerCase().includes(searchValue) ||
      String(row.share_holding_no  || "").toLowerCase().includes(searchValue) ||
      String(row.share_certificate_nos || "").toLowerCase().includes(searchValue) ||
      String(row.share_certificate_bank_name  || "").toLowerCase().includes(searchValue) ||
      String(row.kids_count || "").toLowerCase().includes(searchValue) ||
      String(row.senior_citizen_count || "").toLowerCase().includes(searchValue) ||
      String(row.male_count || "").toLowerCase().includes(searchValue) ||
      String(row.female_count || "").toLowerCase().includes(searchValue) ||
      String(row.total_people_count || "").toLowerCase().includes(searchValue) ||
      String(row.alloted_four_wheel_parking_count || "").toLowerCase().includes(searchValue) ||
      String(row.alloted_two_wheel_parking_count || "").toLowerCase().includes(searchValue) ||
      String(row.nominee_names_and_per || "").toLowerCase().includes(searchValue) 
    );
  
    setFilterRecords(filteredData);
    setCurrentPage(1);
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "user Data");
    XLSX.writeFile(workbook, "UsersPropertyUnit.xlsx");
  };
  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    autoTable(doc, {
      head: [["User", "Property", "Sector", "Block", "Unit", "Unit number","Unit combination","Membership no","User role","Share holding no","Share certificate no","Share certificate bank name","Total people count","Alloted 4 wheel parking","Alloted 2 wheel parking","Nominee name"]],
      body: data.map(item => [
        item.user_name,
        item.property_name,
        item.sector_name,
        item.block_name,
        item.property_unit_id,
        item.unit_number,
        item.unit_combination,
        item.membership_no,
        item.role_name,
        item.share_holding_no,
        item.share_certificate_nos,
        item.share_certificate_bank_name,
        item.total_people_count,
        item.alloted_four_wheel_parking_count,
        item.alloted_two_wheel_parking_count,
        item.nominee_names_and_per
      ]),
    });
  
    doc.save("UserPropertyUnit.pdf");
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
      confirmButtonColor: "#006cb5",
      cancelButtonColor: "#f1b255",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/user-property-units/${id}`);
          setData(data.filter((unit) => unit.id !== id));
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
          <button className="btn2"><CSVLink data={data} filename="UserPropertyUnit.csv" title="CSV" className="csv-link"><FontAwesomeIcon icon={faFileCsv} />
          </CSVLink>
          </button>
        </div>
        <Link to='/sectors/add-sector'>
          <button className="new-user-btn" >+ New Property</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>SR.NO</th>
            <th>User</th>
            <th>Property</th>
            <th>Sector</th>
            <th>Block</th>
            <th>Unit number</th>
            <th>Unit combination</th>
            <th>Membership no</th>
            <th>User role</th>
            <th>Share holding no</th>
            <th>Share certificate nos</th>
            <th>Bank name</th>
            <th>Kids</th>
            <th>Senior citizen</th>
            <th>Male</th>
            <th>Female</th>
            <th>Total</th>
            <th>Alloted 4 wheeler parking</th>
            <th>Alloted 2 wheeler parking</th>
            <th>Nominee Names</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentRecords.length === 0 ? (
              <tr>
                <td colSpan='4'>No user property units</td>
              </tr>
            ) : (
              currentRecords.map((units, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{units.user_name}</td>
                  <td>{units.property_name}</td>
                  <td>{units.sector_name}</td>
                  <td>{units.block_name}</td>
                  <td>{units.unit_number}</td>
                  <td>{units.unit_combination}</td>
                  <td>{units.membership_no}</td>
                  <td>{units.role_name}</td>
                  <td>{units.share_holding_no}</td>
                  <td>{units.share_certificate_nos}</td>
                  <td>{units.share_certificate_bank_name}</td>
                  <td>{units.kids_count}</td>
                  <td>{units.senior_citizen_count}</td>
                  <td>{units.male_count}</td>
                  <td>{units.female_count}</td>
                  <td>{units.total_people_count}</td>
                  <td>{units.alloted_four_wheel_parking_count}</td>
                  <td>{units.alloted_two_wheel_parking_count}</td>
                  <td>{units.nominee_names_and_per}</td>
                   <td>
                    <button
                    className="action-button"
                    onClick={(event) => handleClick(event, units.id)}>
                    Action
                  </button>
                  <Menu
                    id={`action-menu-${units.id}`}
                    anchorEl={anchorEl}
                    open={menuId === units.id}
                    onClose={handleClose}>
                    <MenuItem onClick={() => handleDelete(units.id)}>Delete</MenuItem>
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

export default UserAllProperty;
