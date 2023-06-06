import { Request, Response } from 'express'
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  getAllTemplatesPublic,
  getTemplateById,
  getTemplateBySlug,
  getTemplateDetailsById,
  updateTemplate,
  updateTemplateStatus,
} from '../service/template.service'

// create template controller function
export async function createTemplateHandler(req: Request, res: Response) {
  // get the preview image
  const previewImg = req.file?.path

  //@ts-ignore
  const userId = req.user._id
  const fromData = req.body
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
  }

  try {
    const template = await createTemplate(newData, previewImg)
    return res.status(200).json({
      message: 'Successfully created template',
      template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// find all Private templates controller function
export async function getAllTemplatesHandler(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user._id
  const { role } = req.user as any
  const isAdmin = role.isAdmin

  try {
    const templates = await getAllTemplates({ user: userId }, isAdmin)
    return res.status(200).json({
      message: 'Successfully fetched templates',
      data: templates,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// get templates by slug controller function
export async function getTemplateBySlugHandler(req: Request, res: Response) {
  const { slug } = req.params
  try {
    const template = await getTemplateBySlug(slug)
    return res.status(200).json({
      message: 'Successfully fetched template',
      data: template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// get templates by id controller function
export async function getTemplateByIdHandler(req: Request, res: Response) {
  const { id } = req.params
  try {
    const template = await getTemplateById(id)
    return res.status(200).json({
      message: 'Successfully fetched template',
      data: template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// get templates details by id controller function
export async function getTemplateDetailsByIdHandler(
  req: Request,
  res: Response
) {
  const { id } = req.params
  try {
    const template = await getTemplateDetailsById(id)
    return res.status(200).json({
      message: 'Successfully fetched template',
      data: template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// find all Public templates controller function
export async function getAllPublicTemplatesHandler(
  req: Request,
  res: Response
) {
  try {
    const templates = await getAllTemplatesPublic()
    return res.status(200).json({
      message: 'Successfully fetched templates',
      data: templates,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// update template controller function
export async function updateTemplateHandler(req: Request, res: Response) {
  const { id } = req.params
  // get the preview image
  const previewImg = req.file?.path
  try {
    const template = await updateTemplate(id, previewImg, req.body)
    return res.status(200).json({
      message: 'Successfully update section component',
      template,
    })
  } catch (e: any) {
    return res.status(500).send({
      message: "Couldn't update section component",
      error: e.message,
    })
  }
}

// patch the template status controller function
export async function updateTemplateStatusHandler(req: Request, res: Response) {
  const { templateId, status } = req.params
  try {
    const template = await updateTemplateStatus(templateId, status)
    return res.status(200).json({
      message: 'Successfully updated template status',
      template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// delete a template controller function
export async function deleteTemplateHandler(req: Request, res: Response) {
  const templateId = req.params.templateId

  try {
    const template = await deleteTemplate(templateId)
    return res.status(200).json({
      message: 'Successfully deleted template',
      template,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    })
  }
}
