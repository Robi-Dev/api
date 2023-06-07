import { Request, Response } from 'express';
import { updateStatus } from '../service/section.service';
import {
  createTheme,
  getThemeById,
  getAllThemes,
  getAllPublicThemes,
  updateTheme,
  deleteTheme,
  updateThemeStatus,
} from '../service/theme.service';

export async function createThemeHandler(req: Request, res: Response) {
  try {
    const theme = await createTheme(req.body);
    res.status(200).json({
      message: 'Successfully created theme',
      data: theme,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// get a theme by id controller function
export async function getThemeByIdHandler(req: Request, res: Response) {
  try {
    const theme = await getThemeById(req.params.id);
    res.status(200).json({
      message: 'Successfully fetched theme',
      data: theme,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// get all themes private controller function
export async function getAllThemesHandler(req: Request, res: Response) {
  const { type } = req.params;
  try {
    const themes = await getAllThemes(type);
    res.status(200).json({
      message: 'Successfully fetched themes',
      data: themes,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// get al themes public controller function
export async function getAllPublicThemesHandler(req: Request, res: Response) {
  const type = req.params.type;

  try {
    const themes = await getAllPublicThemes(type);
    res.status(200).json({
      message: 'Successfully fetched themes',
      data: themes,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// update theme controller function
export async function updateThemeHandler(req: Request, res: Response) {
  try {
    const theme = await updateTheme(req.params.id, req.body);
    res.status(200).json({
      message: 'Successfully updated theme',
      data: theme,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// delete theme controller function
export async function deleteThemeHandler(req: Request, res: Response) {
  try {
    const theme = await deleteTheme(req.params.id);
    res.status(200).json({
      message: 'Successfully deleted theme',
      data: theme,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}

// status update section controller function
export async function updateThemeStatusHandler(req: Request, res: Response) {
  const themeId = req.params.themeId;
  const status = req.params.status;
  try {
    const theme = await updateThemeStatus(themeId, status);
    res.status(200).json({
      message: 'Successfully updated theme status',
      data: theme,
    });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
}
