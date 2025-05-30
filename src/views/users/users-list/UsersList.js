import React, { useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faFileExcel, faFilePdf, faPrint, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../../css/table.css';
import Swal from 'sweetalert2';
import axiosInstance from 'src/axiosInstance';
import config from 'src/config';


const UsersList = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [filterRecords, setFilterRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const printableRef = useRef();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/users`);
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
      String(row.title || "").toLowerCase().includes(searchValue) ||
      String(row.full_name || "").toLowerCase().includes(searchValue) ||
      String(row.mobile_number || "").toLowerCase().includes(searchValue) ||
      String(row.email || "").toLowerCase().includes(searchValue) ||
      String(row.pan_number || "").toLowerCase().includes(searchValue) ||
      String(row.aadhar_number || "").toLowerCase().includes(searchValue) ||
      String(row.blood_group || "").toLowerCase().includes(searchValue)
    );
  
    setFilterRecords(filteredData);
    setCurrentPage(1);
  };

  // Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "user Data");
    XLSX.writeFile(workbook, "UsersData.xlsx");
  };

  // PDF
  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    autoTable(doc, {
      head: [["Title", "Full Name", "Contact Number", "Email", "Pan Number", "Aadhar Number"]],
      body: data.map(item => [
        item.title,
        item.full_name,
        item.mobile_number,
        item.email,
        item.pan_number,
        item.aadhar_number
      ]),
    });
  
    doc.save("UserDetails.pdf");
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
          await axiosInstance.delete(`/user/${id}`);
          setData(data.filter((user) => user.id !== id));
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
  

  // Print
  const handlePrint = () => {
    const printContent = printableRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
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
          <button className="btn2"><CSVLink data={data} filename="UserData.csv" title="CSV" className="csv-link"><FontAwesomeIcon icon={faFileCsv} />
          </CSVLink>
          </button>
        </div>
        <Link to='/users/add-user'>
          <button className="new-user-btn" >+ New Member</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Title</th>
            <th>Full name</th>
            <th>Mobile number</th>
            <th>Email</th>
            <th>Pan number</th>
            <th>Aadhar number</th>
            <th>Profile photo</th>
            <th>Blood group</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentRecords.length === 0 ? (
              <tr>
                <td colSpan='4'>No users available</td>
              </tr>
            ) : (
              currentRecords.map((user, index) => (
                 <tr key={index}>
                  <td>{index+1}</td>
                  <td>{user.title}</td>
                  <td>{user.full_name}</td>
                  <td>{user.mobile_number}</td>
                  <td>{user.email}</td>
                  <td>{user.pan_number}</td>
                  <td>{user.aadhar_number}</td>
                  <td>
                       {user.profile_photo ? (
                          <img
                            src={`${config.baseURL}/uploads/${user.profile_photo}`}
                            alt="Profile Photo"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                        'No Photo'
                       )}
                   </td>
                  <td>{user.blood_group}</td>
                   <td>
                    <button
                    className="action-button"
                    onClick={(event) => handleClick(event,user.id)}>
                    Action
                  </button>
                  <Menu
                    id={`action-menu-${user.id}`}
                    anchorEl={anchorEl}
                    open={menuId === user.id}
                    onClose={handleClose}>
                     <Link className='Link' to={`/user-property-unit/user-property/${user.id}`}>
                         <MenuItem>Property</MenuItem>
                     </Link> 
                     <Link className='Link' 
                           to={`/user-property-unit/add-user-property-unit`}
                           state={{ userId: user.id }}
                           >
                         <MenuItem>Add property</MenuItem>
                     </Link> 
                     <Link className='Link' to={`/users/update-user/${user.id}`}>
                       <MenuItem>Edit</MenuItem>
                     </Link>
                    <MenuItem onClick={() => handleDelete(user.id)}>Delete</MenuItem>
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

     <div id="printableTable" ref={printableRef} style={{ display: 'none',border:'1 px solid black' }}>
        <h3>Users List</h3>
        <table>
          <thead>
            <tr>
            <th>SR.NO</th>
            <th>Title</th>
            <th>Full name</th>
            <th>Mobile number</th>
            <th>Email</th>
            <th>Pan number</th>
            <th>Aadhar number</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user,index) => (
              <tr key={index}>
                <td>{index+1}</td>
                  <td>{user.title}</td>
                  <td>{user.full_name}</td>
                  <td>{user.mobile_number}</td>
                  <td>{user.email}</td>
                  <td>{user.pan_number}</td>
                  <td>{user.aadhar_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default UsersList;
