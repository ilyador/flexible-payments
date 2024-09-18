import axios from 'axios'
import fs from 'fs'
import clientPromise from '../../../utils/mongodb'


const xeroAPI = {
  client_id: process.env.XERO_CLIENT_ID,
  tenant_id: process.env.XERO_TENANT_ID,
  client_secret: process.env.XERO_CLIENT_SECRET
}


async function getToken () {
  try {
    const client = await clientPromise
    const db = client.db('invoice-connect')
    const collection = db.collection('xero')
    return collection.find({ token: 'true' }).toArray()
  }

  catch (error) {
    console.log(error)
  }
}


async function saveToken (token) {
  try {
    const client = await clientPromise
    const db = client.db('invoice-connect')
    const collection = db.collection('xero')
    const insertResult = collection.insertOne({
      token: 'true',
      value: token
    })
  }

  catch (error) {
    console.log(error)
  }
}


async function updateToken (token) {
  try {
    const client = await clientPromise
    const db = client.db('invoice-connect')
    const collection = db.collection('xero')
    const updateResult = await collection.updateOne({ token: 'true' }, { '$set': { value: token } })
  }

  catch (error) {
    console.log(error)
  }
}


export default async function getHeaders () {
  const refresh_token = await getToken()

  if (!refresh_token.length) {
    throw new Error('No token in DB')
  }


  const authToken = Buffer
    .from(xeroAPI.client_id + ':' + xeroAPI.client_secret)
    .toString('base64')

  try {
    const response = await axios.post('https://identity.xero.com/connect/token', {
      grant_type: 'refresh_token',
      refresh_token: refresh_token[0].value
    }, {
      headers: {
        'Authorization': 'Basic ' + authToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    await updateToken(response.data.refresh_token)

    return {
      'Authorization': 'Bearer ' + response.data.access_token,
      'Xero-Tenant-Id': xeroAPI.tenant_id,
      'Accept': 'application/json'
    }
  }

  catch (error) {
    console.log('token request failed', error)
    return null
  }
}
