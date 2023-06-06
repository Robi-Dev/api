import mongoose from 'mongoose'
// @ts-ignore
import config from 'config'

import logger from '../utils/logger'

const DB_URI =
  (config.get('db_uri') as string) || (process.env.DB_URI as string)

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI)
    logger.info('Database is connected..!!')
  } catch (err) {
    process.exit(1)
  }
}

export default connectDB
