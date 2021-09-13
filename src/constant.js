export const URL = {
  startApp: "startapp",
  sendFilePath: "sendfilepath",
  getRuleBased: "getrulebased",
  getCaseInfo: "getcaseinfo",
  sendCaseResult: "sendcaseresult",
  patchCaseInfo: "patchcaseinfo",
};

export const DATA = {
  concurrencyLimit: 5,
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
  ["0", "Dispute"],
  ["1", "Accept"],
]);

export const TEXT = {
  brandName: "Nilan AI Claims",
  splash: "Initializing Nilan AI",

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
