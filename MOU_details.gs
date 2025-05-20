

var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
  
  // Add Last Notified column if it doesn't exist
  var sheet = activeSpreadsheet.getSheetByName(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.indexOf('Last Notified') === -1) {
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, sheet.getLastColumn()).setValue('Last Notified');
  }
  
  // Set up daily trigger for reminders
  createDailyTrigger();
}

function createDailyTrigger() {
  // Remove any existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyRenewalReminders') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create new daily trigger (runs every morning at 9 AM)
  ScriptApp.newTrigger('sendDailyRenewalReminders')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Handle different POST endpoints
    if (e.postData && e.parameter && e.parameter.action === 'monthly-report') {
      return handleMonthlyReportRequest(JSON.parse(e.postData.contents));
    }
    
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    if (!sheet) throw new Error("Sheet not found: " + sheetName);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var fileUrl = '';
    var userEmail = e.parameter['User Email'] || '';
    
    // Handle base64 file
    if (e.parameter.file) {
      var fileInfo = JSON.parse(e.parameter.file);
      var base64 = fileInfo.base64;
      var fileName = fileInfo.name || "uploaded_file";
      var fileType = fileInfo.type || MimeType.PDF;

      var decoded = Utilities.base64Decode(base64);
      var blob = Utilities.newBlob(decoded, fileType, fileName);

      var folder = DriveApp.getFolderById('1qJywvMmX3VKb7wdH3CpRM5fCnPTqm_co');
      var uploadedFile = folder.createFile(blob);
      fileUrl = uploadedFile.getUrl();
    }

    var newRow = headers.map(function (header) {
      var key = header.trim().toLowerCase();
      if (key === 'timestamp') return new Date();
      if (key === 'signed agreement document') return fileUrl;
      return e.parameter[header.trim()] || "";
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Send confirmation email if user email exists
    if (userEmail) {
      var instituteName = e.parameter['Industry/Institute Name'];
      var startDate = e.parameter['Start Date'];
      var endDate = e.parameter['End Date'];
      
      sendConfirmationEmail(userEmail, instituteName, startDate, endDate);
      
      // Check if MOU duration is less than 1 month
      var startDateObj = new Date(startDate);
      var endDateObj = new Date(endDate);
      var today = new Date();
      
      // Calculate duration in milliseconds
      var durationMs = endDateObj - startDateObj;
      var oneMonthMs = 30 * 24 * 60 * 60 * 1000;
      
      // Check if duration is less than 1 month AND end date is in the future
      if (durationMs < oneMonthMs && endDateObj > today) {
        var subject = 'Immediate MOU Renewal Notice';
        var body = 'Dear User,\n\n' +
          'Your newly created MOU with ' + instituteName + ' has a duration of less than one month.\n\n' +
          'Important Dates:\n' +
          'Start Date: ' + startDate + '\n' +
          'End Date: ' + endDate + '\n\n' +
          'Please note this agreement will expire soon. Consider extending the duration if needed.\n\n' +
          'Thank you,\nMOU Management System';
        
        MailApp.sendEmail(userEmail, subject, body);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function handleMonthlyReportRequest(data) {
  try {
    var recipientEmail = data.email;
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    
    // Generate report content
    var reportContent = generateMonthlyReportContent(sheet);
    
    // Send email with report
    MailApp.sendEmail({
      to: recipientEmail,
      subject: 'Monthly MOU Report - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM yyyy"),
      htmlBody: reportContent.html,
      attachments: [reportContent.pdf]
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Monthly report sent successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function generateMonthlyReportContent(sheet) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  
  // Filter for current month's MOUs
  var monthlyData = data.filter(function(row, index) {
    if (index === 0) return false; // Skip header
    var date = new Date(row[headers.indexOf('Start Date')]);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  // Generate HTML content
  var html = `
    <h1>Monthly MOU Report</h1>
    <p>Generated on: ${Utilities.formatDate(now, Session.getScriptTimeZone(), "MMMM dd, yyyy")}</p>
    <p>Total MOUs this month: ${monthlyData.length}</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          ${headers.map(header => <th style="padding: 8px; text-align: left;">${header}</th>).join('')}
        </tr>
      </thead>
      <tbody>
        ${monthlyData.map(row => `
          <tr>
            ${row.map(cell => <td style="padding: 8px; border-bottom: 1px solid #ddd;">${cell}</td>).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p>This is an automated report. Please contact support if you have any questions.</p>
  `;
  
  // Generate PDF
  var blob = Utilities.newBlob(html, 'text/html', 'report.html');
  var pdf = blob.getAs('application/pdf').setName('MOU_Report_' + Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMM") + '.pdf');
  
  return {
    html: html,
    pdf: pdf
  };
}

function sendDailyRenewalReminders() {
  var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  var sheet = doc.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  // Find column indexes
  var emailIndex = headers.indexOf('User Email');
  var endDateIndex = headers.indexOf('End Date');
  var instituteIndex = headers.indexOf('Industry/Institute Name');
  var notifiedIndex = headers.indexOf('Last Notified');
  
  if (emailIndex === -1 || endDateIndex === -1 || instituteIndex === -1) {
    console.error("Required columns not found");
    return;
  }
  
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Process each row
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var email = row[emailIndex];
    var endDate = new Date(row[endDateIndex]);
    endDate.setHours(0, 0, 0, 0);
    var institute = row[instituteIndex];
    
    if (!email || !endDate || isNaN(endDate.getTime())) continue;
    
    var remainingTime = endDate - today;
    var oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    
    // Check if remaining time is less than 1 month and not expired
    if (remainingTime < oneMonthInMs && remainingTime > 0) {
      var remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
      
      // Determine notification frequency based on urgency
      var shouldNotify = false;
      var subject = '';
      
      if (remainingDays <= 7) {
        // Daily notifications in last week
        shouldNotify = true;
        subject = 'URGENT: MOU Expiring in ' + remainingDays + ' day' + (remainingDays !== 1 ? 's' : '');
      } else if (remainingDays <= 14) {
        // Every 3 days in second week
        var lastNotified = notifiedIndex !== -1 ? new Date(row[notifiedIndex]) : null;
        if (!lastNotified || (today - lastNotified) >= 3 * 24 * 60 * 60 * 1000) {
          shouldNotify = true;
          subject = 'MOU Expiring in ' + remainingDays + ' days';
        }
      } else {
        // Weekly until 2 weeks before
        var lastNotified = notifiedIndex !== -1 ? new Date(row[notifiedIndex]) : null;
        if (!lastNotified || (today - lastNotified) >= 7 * 24 * 60 * 60 * 1000) {
          shouldNotify = true;
          subject = 'MOU Expiring in ' + remainingDays + ' days';
        }
      }
      
      if (shouldNotify) {
        var body = 'Dear User,\n\n' +
          'Your MOU with ' + institute + ' has ' + remainingDays + ' day' + (remainingDays !== 1 ? 's' : '') + ' remaining.\n\n' +
          'Expiration Date: ' + endDate.toDateString() + '\n\n' +
          (remainingDays <= 7 ? 'URGENT: ' : '') + 'Please take necessary action to renew this agreement.\n\n' +
          'Thank you,\nMOU Management System';
        
        MailApp.sendEmail(email, subject, body);
        
        // Update last notified date if column exists
        if (notifiedIndex !== -1) {
          sheet.getRange(i + 1, notifiedIndex + 1).setValue(today);
        }
      }
    }
  }
}

function sendConfirmationEmail(email, instituteName, startDate, endDate) {
  var subject = 'MOU Submission Confirmation';
  var body = 'Dear User,\n\n' +
    'Your MOU with ' + instituteName + ' has been successfully submitted.\n\n' +
    'Details:\n' +
    'Start Date: ' + startDate + '\n' +
    'End Date: ' + endDate + '\n\n' +
    'Thank you for using our MOU management system.';
  
  MailApp.sendEmail(email, subject, body);
}

function sendMonthlyReminders() {
  var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  var sheet = doc.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  // Find column indexes
  var emailIndex = headers.indexOf('User Email');
  var endDateIndex = headers.indexOf('End Date');
  var instituteIndex = headers.indexOf('Industry/Institute Name');
  
  if (emailIndex === -1 || endDateIndex === -1 || instituteIndex === -1) return;
  
  var today = new Date();
  var oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  
  // Process each row
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var email = row[emailIndex];
    var endDate = new Date(row[endDateIndex]);
    var institute = row[instituteIndex];
    
    if (!email || !endDate || isNaN(endDate.getTime())) continue;
    
    // Check for renewals (expiring in 1 month)
    if (endDate <= oneMonthLater && endDate >= today) {
      var subject = 'MOU Renewal Reminder';
      var body = 'Dear User,\n\n' +
        'Your MOU with ' + institute + ' is expiring soon on ' + endDate.toDateString() + '.\n\n' +
        'Please consider renewing the agreement if needed.\n\n' +
        'Thank you,\nMOU Management System';
      
      MailApp.sendEmail(email, subject, body);
    }
    
    // Send monthly activity reminder (to all users)
    var activitySubject = 'Monthly MOU Activity Reminder';
    var activityBody = 'Dear User,\n\n' +
      'This is a reminder to submit your monthly activities related to your MOUs.\n\n' +
      'Please log in to the system and update your activities for this month.\n\n' +
      'Thank you,\nMOU Management System';
      
    MailApp.sendEmail(email, activitySubject, activityBody);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const jsonData = data.map(row => {
    const obj = {};
    headers.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify({ data: jsonData }))
    .setMimeType(ContentService.MimeType.JSON);
}
