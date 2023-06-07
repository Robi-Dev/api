import app from './app'
import themeRoute from './routes/theme.route'
import logger from './utils/logger'
import connectDB from './utils/connect'
import userRoute from './routes/user.route'
import categoryRoute from './routes/category.route'
import sectionRoute from './routes/section.route'
import templateRouter from './routes/template.route'
import collectionRoute from './routes/collection.route'

const port = process.env.PORT || 4000
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`)
  logger.info('Server is running on port ' + port)

  // connection to databaseName
  connectDB()

  // User route
  userRoute(app)
  // theme Route
  themeRoute(app)

  // category route
  categoryRoute(app)

  // Section  Routes
  sectionRoute(app)

  // Template Routes
  templateRouter(app)

  // Collection Routes
  collectionRoute(app)
  /* eslint-enable no-console */
})

