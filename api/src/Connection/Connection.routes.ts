import { Request, Response } from 'express';

import {
  alreadyExistsResponse,
  createdResponse,
  missingParamResponse,
  unknownErrorResponse
} from '../responses';
const Connection = require('./Connection.model');

export const add = async (request: Request, response: Response): Promise<Response> => {
  if (!request.body.userId) {
    return missingParamResponse(response, 'userId');
  }

  if (!request.body.serviceId) {
    return missingParamResponse(response, 'serviceId');
  }

  const existingConnection = await Connection.find({
    service: request.body.serviceId,
    user: request.body.userId
  }).exec();

  if (existingConnection && existingConnection.length > 0) {
    return alreadyExistsResponse(response, 'Connection');
  }

  return Connection.create({ service: request.body.serviceId, user: request.body.userId })
    .then((connection: any) => createdResponse(response, connection))
    .catch((error: any) => unknownErrorResponse(response, error.message));
};

export const getForUser = async (request: Request, response: Response): Promise<Response> => {
  return Connection.find({ user: request.query.userId })
    .exec()
    .then((connections: any[]) => response.status(200).json(connections))
    .catch((error: any) => response.status(500).json({ message: error.message }));
};
