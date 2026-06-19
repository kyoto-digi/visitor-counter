function doGet() {
  // index.htmlという名前のファイルを出力して画面を表示します
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('AI入退場カウンター')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ----------------------------------------------------
// 変更点：シート名を固定して、意図しないシートへの書き込みを防ぐ
// ----------------------------------------------------
function logRecord(type, personId) {
  try {
    // 「シート1」の部分は、実際の書き込み先シート名に合わせて変更してください
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1"); 
    var timestamp = new Date();
    
    // A列: 記録日時, B列: 区分(入場 or 退場), C列: 追跡用ID
    sheet.appendRow([timestamp, type, "ID: " + personId]);
    return "SUCCESS";
  } catch(e) {
    return "ERROR: " + e.toString();
  }
}

// ----------------------------------------------------
// 追加機能：ローカルのHTMLファイルから通信（fetch）が来た場合にも記録する
// ----------------------------------------------------
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var res = logRecord(data.type, data.personId);
    
    return ContentService.createTextOutput(JSON.stringify({ status: res }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}