// import React, { useState, useEffect } from 'react';
// // import * as XLSX from 'xlsx';
// // import { saveAs } from 'file-saver';

// const MOUDownload = () => {
//   // Sample MOU data (in a real app, this would come from an API or Excel file)
//   const sampleData = [
//     {
//       id: 1,
//       instituteName: 'Tech University',
//       duration: '2 years',
//       facultyName: 'Dr. Smith',
//       academicYear: '2023-2024',
//       purpose: 'Research Collaboration',
//       outcomes: 'Joint publications',
//       signedDate: '2023-01-15',
//       expiryDate: '2025-01-15'
//     },
//     {
//       id: 2,
//       instituteName: 'Design Institute',
//       duration: '3 years',
//       facultyName: 'Prof. Johnson',
//       academicYear: '2022-2023',
//       purpose: 'Student Internships',
//       outcomes: '20 internship placements',
//       signedDate: '2022-09-10',
//       expiryDate: '2025-09-10'
//     },
//     {
//       id: 3,
//       instituteName: 'Business School',
//       duration: '1 year',
//       facultyName: 'Dr. Williams',
//       academicYear: '2023-2024',
//       purpose: 'Executive Education',
//       outcomes: 'Custom training programs',
//       signedDate: '2023-03-05',
//       expiryDate: '2024-03-05'
//     }
//   ];

//   const [mouData, setMouData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     academicYear: '',
//     institute: '',
//     duration: '',
//     facultyName: ''
//   });

//   // Load data (simulating API call)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMouData(sampleData);
//       setFilteredData(sampleData);
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   // Apply filters whenever filters or data changes
//   useEffect(() => {
//     const filtered = mouData.filter(item => {
//       return (
//         (!filters.academicYear || item.academicYear.includes(filters.academicYear)) &&
//         (!filters.institute || item.instituteName.toLowerCase().includes(filters.institute.toLowerCase())) &&
//         (!filters.duration || item.duration.includes(filters.duration)) &&
//         (!filters.facultyName || item.facultyName.toLowerCase().includes(filters.facultyName.toLowerCase()))
//       );
//     });
//     setFilteredData(filtered);
//   }, [filters, mouData]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       academicYear: '',
//       institute: '',
//       duration: '',
//       facultyName: ''
//     });
//   };

//   const downloadExcel = () => {
//     // Prepare data for Excel export
//     const exportData = filteredData.map(item => ({
//       'Institute Name': item.instituteName,
//       'Duration': item.duration,
//       'Faculty Name': item.facultyName,
//       'Academic Year': item.academicYear,
//       'Purpose': item.purpose,
//       'Outcomes': item.outcomes,
//       'Signed Date': item.signedDate,
//       'Expiry Date': item.expiryDate
//     }));

//     // Create worksheet and workbook
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "MOU Data");

//     // Generate Excel file
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(data, `MOU_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const downloadCSV = () => {
//     const headers = [
//       'Institute Name',
//       'Duration',
//       'Faculty Name',
//       'Academic Year',
//       'Purpose',
//       'Outcomes',
//       'Signed Date',
//       'Expiry Date'
//     ].join(',');

//     const csvContent = filteredData.map(item => 
//       `"${item.instituteName}","${item.duration}","${item.facultyName}","${item.academicYear}","${item.purpose}","${item.outcomes}","${item.signedDate}","${item.expiryDate}"`
//     ).join('\n');

//     const csv = `${headers}\n${csvContent}`;
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, `MOU_Data_${new Date().toISOString().split('T')[0]}.csv`);
//   };

//   return (
//     <div className="mou-download-container">
//       <h1>Download MOU Data</h1>
//       <p className="subtitle">Filter and export MOU records to Excel or CSV format</p>

//       {/* Filter Section */}
//       <div className="filter-section">
//         <h2>Filter Options</h2>
//         <div className="filter-grid">
//           <div className="filter-group">
//             <label htmlFor="academicYear">Academic Year:</label>
//             <input
//               type="text"
//               id="academicYear"
//               name="academicYear"
//               value={filters.academicYear}
//               onChange={handleFilterChange}
//               placeholder="e.g. 2023"
//             />
//           </div>

//           <div className="filter-group">
//             <label htmlFor="institute">Institute Name:</label>
//             <input
//               type="text"
//               id="institute"
//               name="institute"
//               value={filters.institute}
//               onChange={handleFilterChange}
//               placeholder="Filter by institute"
//             />
//           </div>

//           <div className="filter-group">
//             <label htmlFor="duration">Duration:</label>
//             <select
//               id="duration"
//               name="duration"
//               value={filters.duration}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Durations</option>
//               <option value="1 year">1 year</option>
//               <option value="2 years">2 years</option>
//               <option value="3 years">3 years</option>
//               <option value="5 years">5 years</option>
//             </select>
//           </div>

//           <div className="filter-group">
//             <label htmlFor="facultyName">Faculty Name:</label>
//             <input
//               type="text"
//               id="facultyName"
//               name="facultyName"
//               value={filters.facultyName}
//               onChange={handleFilterChange}
//               placeholder="Filter by faculty"
//             />
//           </div>
//         </div>

//         <div className="filter-actions">
//           <button 
//             onClick={resetFilters} 
//             className="btn btn-secondary"
//           >
//             Reset Filters
//           </button>
//           <span className="results-count">
//             Showing {filteredData.length} of {mouData.length} records
//           </span>
//         </div>
//       </div>

//       {/* Download Buttons */}
//       <div className="download-options">
//         <h2>Export Options</h2>
//         <div className="button-group">
//           <button 
//             onClick={downloadExcel} 
//             className="btn btn-primary"
//             disabled={isLoading || filteredData.length === 0}
//           >
//             Download as Excel
//           </button>
//           <button 
//             onClick={downloadCSV} 
//             className="btn btn-primary"
//             disabled={isLoading || filteredData.length === 0}
//           >
//             Download as CSV
//           </button>
//         </div>
//       </div>

//       {/* Data Preview Table */}
//       {!isLoading && (
//         <div className="data-preview">
//           <h2>Data Preview</h2>
//           {filteredData.length > 0 ? (
//             <div className="table-responsive">
//               <table className="mou-table">
//                 <thead>
//                   <tr>
//                     <th>Institute</th>
//                     <th>Duration</th>
//                     <th>Faculty</th>
//                     <th>Academic Year</th>
//                     <th>Purpose</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.slice(0, 5).map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.instituteName}</td>
//                       <td>{item.duration}</td>
//                       <td>{item.facultyName}</td>
//                       <td>{item.academicYear}</td>
//                       <td>{item.purpose.substring(0, 30)}{item.purpose.length > 30 ? '...' : ''}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {filteredData.length > 5 && (
//                 <p className="preview-note">
//                   Showing first 5 of {filteredData.length} records. Export to view all data.
//                 </p>
//               )}
//             </div>
//           ) : (
//             <p className="no-results">No MOU records match your filters.</p>
//           )}
//         </div>
//       )}

//       {isLoading && <div className="loading">Loading MOU data...</div>}
//     </div>
//   );
// };

// export default MOUDownload;

import React, { useState, useEffect } from 'react';
import './MOUFilterDownload.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MOUFilterDownload = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    academicYear: '',
    industry: '',
    duration: '',
    faculty: ''
  });

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbzRifE_Q5P91CIhJ4j-tRqqgx4SD9j-sJIOcz6sMxdIZfmFKbrlquQvCNrqIKw5yi4Y7w/exec')
    
      .then(res => res.json())
      .then(result => {
        setData(result.data || []);
        setFilteredData(result.data || []);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = data.filter(entry => {
      const entryDuration = getDuration(entry['Start Date'], entry['End Date']);
      return (
        (newFilters.academicYear === '' || entry['Academic Year'] === newFilters.academicYear) &&
        (newFilters.industry === '' || (entry['Industry/Institute Name'] || '').toLowerCase().includes(newFilters.industry.toLowerCase())) &&
        (newFilters.faculty === '' || (entry['Faculty Name'] || '').toLowerCase().includes(newFilters.faculty.toLowerCase())) &&
        (newFilters.duration === '' || entryDuration === newFilters.duration)
      );
    });

    setFilteredData(filtered);
  };

  const getDuration = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e)) return '';
    const diff = e.getFullYear() - s.getFullYear();
    return `${diff} year${diff !== 1 ? 's' : ''}`;
  };

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert('No data to download!');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const rows = filteredData.map(row =>
      headers.map(field => `"${row[field] || ''}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered_mou_data.csv';
    link.click();
  };

  return (
    <><Header/>
    <div className="filter-download-container">
      <h3>📄 Filter & Download MOU Data</h3>
      <div className="filters">
        <label>
          Academic Year:
          <select name="academicYear" onChange={handleChange}>
            <option value="">All</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </label>

        <label>
          Industry/Institute:
          <input name="industry" type="text" onChange={handleChange} placeholder="Search..." />
        </label>

        <label>
          Faculty Name:
          <input name="faculty" type="text" onChange={handleChange} placeholder="Search..." />
        </label>

        <label>
          Duration:
          <select name="duration" onChange={handleChange}>
            <option value="">All</option>
            <option value="0 years">0 years</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="3 years">3 years</option>
            <option value="4 years">4 years</option>
          </select>
        </label>
      </div>

      <button onClick={downloadCSV}>⬇️ Download CSV</button>
      <p>{filteredData.length} entries found.</p>
    </div>
    <Footer/>
    </>
  );
};

export default MOUFilterDownload;
