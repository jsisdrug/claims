export const URL = {
  startApp: "",
  sendFilePath: "GET_FILEPATH",
  getRuleBased: "GET_RULEFILTERS",
  getCaseInfo: "GET_CASEINFO",
  sendCaseResult: "sendcaseresult",
  patchCaseInfo: "patchcaseinfo",
};

export const DATA = {
  concurrencyLimit: 1,
};

export const STYLE = {
  drawerWidth: 380,
};

export const CodeMap = new Map([
  ["0", "VIN Number Mismatch"],
  ["1", "Claim is out of warranty period"],
  ["2", "Mileage out of range"],
  ["3", "Material cost lower"],
  ["4", "Erroneous Record"],
]);

export const StatusMap = new Map([
  ["0", "Accept"],
  ["1", "Dispute"],
]);

export const FieldNameMap = new Map([
  ["uniqueId", "id"],
  ["vin", "VIN"],
  ["mileage", "Mileage"],
  ["cost", "MaterialCost"],
  ["startDate", "WarrantyStartDate"],
  ["repairDate", "RepairDate"],
  ["countryRepaired", "CountryRepaired"],
  ["technicianComment", "TechnicianComment"],
  ["AISuggestion", "AI-Suggestion"],
  ["AIDisputeComment", "AI-DisputeComment"],
  ["comment", "comment"],
  ["status", "status"],
  ["action", ""],
])

function createColumn(name, order, width, sort, show) {
  return { name, order, width, sort, show };
}

export const columns = [
  createColumn("uniqueId", 1, "100px", false, false),
  createColumn("vin", 2, "100px", false, true),
  createColumn("mileage", 3, "100px", true, true),
  createColumn("cost", 4, "100px", true, true),
  createColumn("startDate", 5, "150px", false, false),
  createColumn("repairDate", 6, "150px", false, false),
  createColumn("countryRepaired", 7, "100px", false, false),
  createColumn("technicianComment", 8, "400px", false, false),
  createColumn("AISuggestion", 9, "100px", false, true),
  createColumn("AIDisputeComment", 10, "100px", false, true),
  createColumn("comment", 11, "200px", false, true),
  createColumn("action", 12, "100px", false, true),
];

export const TEXT = {
  brandName: "Warranty AI Claims",
  splash: "Initializing Warranty Claims",

  inputForm: {
    title: "Enter file path",
    button: "Submit",
  },

  error: {
    serviceDown: "Service Unavailable!",
    tryAgain: "Please try again after some time.",
  },

  tab1: "Rule Based",
  tab2: "AI Based",

  uniqueId: "ID",
  vin: "VIN",
  mileage: "Mileage",
  cost: "Material Cost",
  startDate: "Warranty Start Date",
  repairDate: "Repair Date",
  countryRepaired: "Country Repaired",
  ruleCode: "Rule Code",
  technicianComment: "Technician Comment",
  AISuggestion: "AI-Suggestion",
  AIDisputeComment: "AI-DisputeComment",
  comment: "Comment",
  status: "Status",
  commentPlaceholder: "Please type your comment",

  action: "Action",
  modify: "Modify",
  saveAll: "Save All",

  panelTitle: "Claim Details",
  panelBtn1: "Accept",
  panelBtn2: "Dispute",
  panelBtn3: "Accepted",
  panelBtn4: "Disputed",
};
