import { Request, Response, NextFunction } from 'express';
import { stat } from 'fs';
import {
  createSection,
  deleteSection,
  findSection,
  findSectionPublic,
  getSection,
  getSectionById,
  updateSection,
  updateStatus,
} from '../service/section.service';

// create section component controller function
export async function createSectionHandler(req: Request, res: Response) {
  // get the preview image
  const previewImg = req.file?.path;

  //@ts-ignore
  const userId = req.user._id;
  const fromData = req.body;
  const newData = {
    ...fromData,
    code: {
      html: {
        html: fromData.htmlHtml,
      },
      react: {
        html: fromData.reactHtml,
      },
      vue: {
        html: fromData.vueHtml,
      },
      angular: {
        html: fromData.angularHtml,
      },
    },
    user: userId,
  };

  try {
    const section = await createSection(newData, previewImg);
    return res.status(200).json({
      message: 'Successfully created section component',
      section,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t create section component',
      error: e.message,
    });
  }
}

// get section component controller function
export async function getSectionHandler(req: Request, res: Response) {
  const sectionId = req.params.sectionId;

  try {
    const section = await getSection(sectionId);
    return res.status(200).json({
      message: 'Successfully fetched section component',
      data: section,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t get section component',
      error: e.message,
    });
  }
}

// get section by id controller function
export async function getSectionByIdHandler(req: Request, res: Response) {
  const sectionId = req.params.sectionId;
  try {
    const section = await getSectionById(sectionId);

    return res.status(200).json({
      message: 'Successfully fetched section component',
      data: section,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t get section component',

      error: e.message,
    });
  }
}

// find section component controller function
export async function findSectionHandler(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user._id;
  const { role } = req.user as any;
  const isAdmin = role.isAdmin;

  try {
    const section = await findSection({ user: userId }, isAdmin);
    return res.status(200).json({
      message: 'Successfully found section component',
      data: section,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t find section component',
      error: e.message,
    });
  }
}

// find all public section controller function
export async function findSectionPublicHandler(req: Request, res: Response) {
  try {
    const section = await findSectionPublic();
    return res.status(200).json({
      message: 'Successfully found public section component',
      data: section,
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t find public section component',
      error: e.message,
    });
  }
}

// update section component controller function
export async function updateSectionHandler(req: Request, res: Response) {
  const sectionId = req.params.sectionId;
  // get the preview image
  const previewImg = req.file?.path;

  const fromData = req.body;
  const newData = {
    ...fromData,
    code: {
      html: {
        html: fromData.htmlHtml,
      },
      react: {
        html: fromData.reactHtml,
      },
      vue: {
        html: fromData.vueHtml,
      },
      angular: {
        html: fromData.angularHtml,
      },
    },
  };

  try {
    await updateSection(sectionId, previewImg, newData);
    return res.status(200).json({
      message: 'Successfully update section component',
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t update section component',
      error: e.message,
    });
  }
}

// delete section component controller function
export async function deleteSectionHandler(req: Request, res: Response) {
  const sectionId = req.params.sectionId;
  try {
    await deleteSection(sectionId);
    return res.status(200).json({
      message: 'Successfully deleted section component',
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t delete section component',
      error: e.message,
    });
  }
}

// status update section controller function

export async function updateSectionStatusHandler(req: Request, res: Response) {
  const sectionId = req.params.sectionId;
  const status = req.params.status;

  try {
    const section = await updateStatus(sectionId, status);
    return res.status(200).json({
      message: 'Successfully updated section component',
    });
  } catch (e: any) {
    return res.status(500).send({
      message: 'Couldn\'t update section component',
      error: e.message,
    });
  }
}
