

// Updated with proper CORS handling and data validation
var scriptProp = PropertiesService.getScriptProperties();
var sheetName = 'Sheet1';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function doOptions() {
  return buildCorsResponse();
}

function handleRequest(e) {
  console.log('Incoming request:', JSON.stringify(e));
  try {
    const data = e.postData ? JSON.parse(e.postData.contents) : {};
    const ss = SpreadsheetApp.openById(scriptProp.getProperty('spreadsheetId'));
    const sheet = ss.getSheetByName(sheetName);
    const rows = sheet.getDataRange().getValues();

    let response;
    switch(data.action) {
      case 'register':
        response = handleRegisteration(data, rows, sheet);
        break;
      case 'login':
        response = handleLogin(data, rows);
        break;
      default:
        response = { success: false, message: 'Invalid action' };
    }

    return buildCorsResponse(response);
  } catch (error) {
    return buildCorsResponse({ 
      success: false, 
      message: 'Server error: ' + error.message 
    }, 500);
  }
}

function handleRegisteration(data, rows, sheet) {
  const cleanEmail = data.email.toLowerCase().trim();
  const cleanName = data.name.trim();
  const cleanPassword = data.password.trim();

  // Debug: Log what we're checking
  console.log(Checking registration for: ${cleanEmail});
  console.log('First 3 rows:', rows.slice(0, 3));

  const existingUser = rows.slice(1).find(row => {
    const storedEmail = row[1]?.toString().toLowerCase().trim();
    return storedEmail === cleanEmail;
  });

  if (existingUser) {
    return { 
      success: false, 
      message: 'Email already registered',
      debug: {
        input: { email: cleanEmail, name: cleanName },
        existing: { email: existingUser[1], name: existingUser[0] }
      }
    };
  }

  sheet.appendRow([cleanName, cleanEmail, cleanPassword]);

  return { 
    success: true, 
    message: 'Registration successful',
    debug: {
      input: { email: cleanEmail, name: cleanName },
      registered: true
    }
  };
}

function handleLogin(data, rows) {
  const cleanEmail = data.email.toLowerCase().trim();
  const cleanPassword = data.password.trim();
  
  // Debug: Log what we're comparing
  console.log(Comparing: ${cleanEmail} | ${cleanPassword});
  console.log('First 3 rows:', rows.slice(0, 3));
  
  const user = rows.slice(1).find(row => {
    const storedEmail = row[1]?.toString().toLowerCase().trim();
    const storedPassword = row[2]?.toString().trim();
    
    console.log(Stored: ${storedEmail} | ${storedPassword});
    return storedEmail === cleanEmail && storedPassword === cleanPassword;
  });

  return { 
    success: !!user,
    message: user ? 'Login successful' : 'Invalid credentials',
    debug: {
      input: { email: cleanEmail, password: cleanPassword },
      found: user ? { email: user[1], password: user[2] } : null
    }
  };
}

// function buildCorsResponse(data = {}, statusCode = 200) {
//   return HtmlService.createHtmlOutput(JSON.stringify(data))
//     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
//     .setContent(JSON.stringify(data))
//     .setStatusCode(statusCode);
// }
function buildCorsResponse(data = {}, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  
  return output;
}
