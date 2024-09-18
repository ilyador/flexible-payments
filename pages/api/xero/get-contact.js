import { getContact } from './index'


export default async function handler (req, res) {
  try {
    const contact = await getContact(req.body.contact)
    res.status(200).json(contact)
  }

  catch (error) {
    res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || error.message)
  }
}
