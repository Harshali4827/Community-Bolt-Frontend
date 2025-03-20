import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import '../../../css/table.css';
import Swal from 'sweetalert2';
import axiosInstance from 'src/axiosInstance';


const GateList = () => {
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
      const response = await axiosInstance.get(`/gates`);
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

      String(row.gate_name || "").toLowerCase().includes(searchValue) ||

      String(row.gate_description || "").toLowerCase().includes(searchValue) ||

      String(row.is_main_gate || "").toLowerCase().includes(searchValue) ||

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
          await axiosInstance.delete(`/gates/${id}`);
          setData(data.filter((gate) => gate.id !== id));
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
        <Link to='/gates/add-gate'>
          <button className="new-user-btn" >+ New Gate</button>
        </Link>
      </div>
      <div className="table-responsive">
      <table className="responsive-table" style={{overflow:'auto'}}>
        <thead>
          <tr>
            <th>SR.NO</th>
            <th>Property ID</th>
            <th>Gate Name</th>
            <th>Description</th>
            <th>Is Main Gate</th>
            <th>Created by</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentRecords.length === 0 ? (
              <tr>
                <td colSpan='4'>No gates available</td>
              </tr>
            ) : (
              currentRecords.map((gate, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{gate.property_id}</td>
                  <td>{gate.gate_name}</td>
                  <td>{gate.gate_description}</td>
                  <td>{gate.is_main_gate}</td>
                  <td>{gate.created_by}</td>
                  <td>
                 <span className={`status-text ${gate.status}`}>{gate.status}</span>
                </td>
                   <td>
                    <button
                    className="action-button"
                    onClick={(event) => handleClick(event, gate.id)}>
                    Action
                  </button>
                  <Menu
                    id={`action-menu-${gate.id}`}
                    anchorEl={anchorEl}
                    open={menuId === gate.id}
                    onClose={handleClose}>
                     <Link to={`/gates/update-gate/${gate.id}`}>
                         <MenuItem style={{ color: 'black'}}>Edit</MenuItem>
                     </Link>
                    <MenuItem onClick={() => handleDelete(gate.id)}>Delete</MenuItem>
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

export default GateList;
