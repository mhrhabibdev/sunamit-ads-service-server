import { AdService } from '@prisma/client';

import prisma from "../../shared/prisma";


const createServiceIntoDB = async (payload: AdService) => {
  const result = await prisma.adService.create({
    data: payload,
  });
  return result;
};

const getAllServicesFromDB = async () => {
  const result = await prisma.adService.findMany({
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getServiceByIdFromDB = async (id: string) => {
  const result = await prisma.adService.findUnique({
    where: { id },
  });
  return result;
};

const updateServiceIntoDB = async (id: string, payload: Partial<AdService>) => {
  try {
    const updatedService = await prisma.adService.update({
      where: { id },
      data: payload,
    });
    return updatedService;
  } catch (error) {
  
    throw new Error("Service not found or update failed");
  }
};
const deleteServiceFromDB = async (id: string) => {
  const result = await prisma.adService.delete({
    where: { id },
  });
  return result;
};

export const AdServices= {
  createServiceIntoDB,
  getAllServicesFromDB,
  getServiceByIdFromDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
};
