import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdServices } from "./adservice.service";


const createAdService = catchAsync(async (req, res) => {
  const result = await AdServices.createServiceIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getAdAllServices = catchAsync(async (_req, res) => {
  const result = await AdServices.getAllServicesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All services fetched successfully",
    data: result,
  });
});

const getAdServiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdServices.getServiceByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Service fetched by ID successfully",
    data: result,
  });
});

const updateAdService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await AdServices.updateServiceIntoDB(id, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteAdService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdServices.deleteServiceFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Service deleted successfully",
    data: result,
  });
});

export const AdServiceController = {
  createAdService,
  getAdAllServices,
  getAdServiceById,
  updateAdService,
  deleteAdService,
};
