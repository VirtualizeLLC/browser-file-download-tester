/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express'
import { readFile } from 'fs/promises'
import * as path from 'path'

const app = express()

// // ALLOW CORS HEADERS
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next?.()
})

const assetPath = path.join(__dirname, 'assets')
app.use('/assets', express.static(assetPath))

app.get('/assets/base64/:name', async (req, res) => {
  const { name } = req.params
  const filePath = path.resolve(__dirname, './assets', name)

  try {
    const base64Read = await readFile(filePath, { encoding: 'base64' })
    return res.send(encodeURI(base64Read))
  } catch (e) {
    console.error('base64 read failure: ', e)
    res.sendStatus(500)
  }
})

app.get('/assets/blob/:name', (req, res) => {
  const { name } = req.params
  const filePath = path.resolve(__dirname, './assets', name)

  return res.sendFile(filePath)
})

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to file-api!' })
})

const port = process.env.PORT || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
