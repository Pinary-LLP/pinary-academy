const SPREADSHEET_ID = "PASTE_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Leads";

function doGet() {
  return jsonResponse({
    ok: true,
    message: "Pinary lead endpoint is active.",
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const params = e.parameter || {};

    if (params.company) {
      return jsonResponse({ ok: true, skipped: true });
    }

    const sheet = getLeadSheet();
    ensureHeaders(sheet);

    sheet.appendRow([
      new Date(),
      params.name || "",
      params.whatsapp || "",
      params.current_status || "",
      params.qualification || "",
      params.goal || "",
      params.commitment || "",
      params.seriousness || "",
      params.source || "Pinary website",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message,
    });
  } finally {
    lock.releaseLock();
  }
}

function getLeadSheet() {
  const spreadsheet =
    SPREADSHEET_ID === "PASTE_SPREADSHEET_ID_HERE"
      ? SpreadsheetApp.getActiveSpreadsheet()
      : SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    "Timestamp",
    "Name",
    "WhatsApp Number",
    "Current Status",
    "Qualification",
    "Goal",
    "Commitment (6 months)",
    "Seriousness",
    "Source",
  ]);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
