import api from "./api";

export const getMyVisitors = async () => {
  const response = await api.get("/Visitor/my");
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await api.get("/Complaint/my");
  return response.data;
};

export const getMyBills = async () => {
  const response = await api.get("/MaintenanceBill/my");
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/AmenityBooking/my");
  return response.data;
};