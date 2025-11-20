// Utility function to format dates to dd/mm/yyyy
export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Convert dd/mm/yyyy to ISO format (yyyy-mm-dd) for date inputs
export function toISODate(ddmmyyyy) {
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
}

// Get today's date in dd/mm/yyyy format
export function getTodayFormatted() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

// Get today's date in ISO format
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}
