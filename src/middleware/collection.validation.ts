import { NextFunction, Request, Response } from "express";
import CollectionModel from "../models/collection.model";
import {
  collectionGetSchema,
  collectionSchema,
} from "../schema/collection.schema";

export const validationCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await collectionSchema.validateAsync(req.body);
    next();
  } catch (e: any) {
    res.status(400).send({
      message: "Invalid request",
      error: e.message,
    });
  }
};

export const isExistsCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collection = await CollectionModel.findOne({
      // section or template or category
      $or: [
        { section: req.body.collectionId },
        { template: req.body.collectionId },
        { category: req.body.collectionId },
      ],
    });
    if (collection) {
      return res.status(400).send({
        message: "Collection already exists",
      });
    }
    next();
  } catch (e: any) {
    res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const validationGetCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await collectionGetSchema.validateAsync(req.body);
    next();
  } catch (e: any) {
    res.status(400).send({
      message: "Invalid request",
      error: e.message,
    });
  }
};

export const deleteCollectionValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await collectionSchema.validateAsync(req.body);
    next();
  } catch (e: any) {
    res.status(400).send({
      message: "Invalid request",
      error: e.message,
    });
  }
};
