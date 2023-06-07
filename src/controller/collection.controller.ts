import { Request, Response } from 'express';
import {
  createCollection,
  deleteCollection,
  findCollectionsByType,
} from '../service/collection.service';

// create a collection controller function
export async function createCollectionHandler(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user._id;
  try {
    const collection = await createCollection(req.body, userId);
    return res.status(201).json({
      message: 'Successfully created collection',
      data: collection,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t create collection',
      error: e.message,
    });
  }
}

// find all collections controller function
export async function findCollectionsByTypeHandler(
  req: Request,
  res: Response,
) {
  const { type } = req.params;
  // user id
  //@ts-ignore
  const userId = await req.user._id;
  try {
    const collections = await findCollectionsByType(type, userId, req.body);
    return res.status(200).json({
      message: 'Successfully fetched collections',
      data: collections,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// delete collection controller function
export async function deleteCollectionHandler(req: Request, res: Response) {
  const { id } = req.params;
  //@ts-ignore
  const userId = req.user._id;
  try {
    const collection = await deleteCollection(id, userId, req.body);
    return res.status(200).json({
      message: 'Successfully deleted collection',
      data: collection,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}
