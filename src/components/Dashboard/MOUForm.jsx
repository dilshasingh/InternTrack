// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const MOUForm = () => {
//   const [formData, setFormData] = useState({
//     instituteName: '',
//     duration: '',
//     facultyName: '',
//     facultyDetails: '',
//     academicYear: '',
//     purpose: '',
//     outcomes: '',
//     agreementFile: null
//   });
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       agreementFile: e.target.files[0]
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // In a real app, you would send this data to your backend
//     // For demo purposes, we'll simulate a successful submission
//     console.log('MOU Data:', formData);
//     setSuccess(true);
//     setTimeout(() => {
//       navigate('/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="mou-form">
//       <h1>Add New MOU</h1>
//       {success && <div className="success-message">MOU added successfully!</div>}
      
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Industry/Institute Name:</label>
//           <input
//             type="text"
//             name="instituteName"
//             value={formData.instituteName}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Duration of MOU:</label>
//           <input
//             type="text"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Signed Agreement Document:</label>
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={handleFileChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Faculty Name who signed the MOU:</label>
//           <input
//             type="text"
//             name="facultyName"
//             value={formData.facultyName}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Faculty Details:</label>
//           <textarea
//             name="facultyDetails"
//             value={formData.facultyDetails}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Academic Year:</label>
//           <input
//             type="text"
//             name="academicYear"
//             value={formData.academicYear}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Purpose of MOU:</label>
//           <textarea
//             name="purpose"
//             value={formData.purpose}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Outcomes of MOU:</label>
//           <textarea
//             name="outcomes"
//             value={formData.outcomes}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <button type="submit" className="btn btn-primary">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default MOUForm;

import React, { useState,useEffect} from 'react';
import './moustyle.css';
import './MOUForm.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MOUForm = () => {
  const [userEmail, setUserEmail] = useState('');


  const [formData, setFormData] = useState({
    'Industry/Institute Name': '',
    'Start Date': '',
    'End Date': '',
    'Faculty Name': '',
    'Faculty Details': '',
    'Academic Year': '',
    'Purpose of MOU': '',
    'Outcomes of MOU': '',
    'User Email': ''
  });
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      setFormData(prev => ({
        ...prev,
        'User Email':email
      }));
    }
  }, []);

  const [fileData, setFileData] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

    if (uploadedFile && allowedTypes.includes(uploadedFile.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setFileData({
          base64,
          name: uploadedFile.name,
          type: uploadedFile.type
        });
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      alert('Invalid file type. Please upload a PDF, DOC, DOCX, PNG, or JPG file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const submissionData = {
        ...formData,
        'User Email': userEmail // Ensure email is included
      };

    const form = new FormData();
    Object.keys(submissionData).forEach((key) => {
      form.append(key, submissionData[key]);
    });

    if (fileData) {
      form.append('file', JSON.stringify(fileData));
    }

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzRifE_Q5P91CIhJ4j-tRqqgx4SD9j-sJIOcz6sMxdIZfmFKbrlquQvCNrqIKw5yi4Y7w/exec', {
        method: 'POST',
        body: form
      });

      const result = await response.json();

      if (result.result === 'success') {
        setStatus('✅ MOU submitted successfully!');
        setFormData({
          'Industry/Institute Name': '',
          'Start Date': '',
          'End Date': '',
          'Faculty Name': '',
          'Faculty Details': '',
          'Academic Year': '',
          'Purpose of MOU': '',
          'Outcomes of MOU': ''
        });
        setFileData(null);
      } else {
        setStatus('❌ Error: ' + result.error);
      }
    } catch (err) {
      setStatus('❌ Network error. Try again later.');
      console.error(err);
    }
  };

  return (
    <><Header/>
    <div className="form-container">
      <h2>MOU Submission Form</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Industry/Institute Name</label>
        <input type="text" name="Industry/Institute Name" value={formData['Industry/Institute Name']} onChange={handleChange} required />

        <label>Start Date of MOU</label>
        <input type="date" name="Start Date" value={formData['Start Date']} onChange={handleChange} required />

        <label>End Date of MOU</label>
        <input type="date" name="End Date" value={formData['End Date']} onChange={handleChange} required />

        <label>Upload Signed Agreement Document</label>
        <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleFileChange} required />

        <label>Faculty Name</label>
        <input type="text" name="Faculty Name" value={formData['Faculty Name']} onChange={handleChange} required />

        <label>Faculty Details</label>
        <input type="text" name="Faculty Details" value={formData['Faculty Details']} onChange={handleChange} required />

        <label>Academic Year</label>
        <select name="Academic Year" value={formData['Academic Year']} onChange={handleChange} required>
          <option value="">Select Academic Year</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>

        <label>Purpose of MOU</label>
        <input type="text" name="Purpose of MOU" value={formData['Purpose of MOU']} onChange={handleChange} required />

        <label>Outcomes of MOU</label>
        <textarea name="Outcomes of MOU" value={formData['Outcomes of MOU']} onChange={handleChange} required />

        <button type="submit">Submit MOU</button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default MOUForm;
