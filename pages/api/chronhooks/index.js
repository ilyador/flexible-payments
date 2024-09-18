import axios from 'axios'

const cronhooks_key = process.env.CHRONOHOOK_API_KEY
const cronhooks_group = process.env.CHRONOHOOK_GROUP
const webhook_url = process.env.WEBHOOKS_URL
const api_url = 'https://api.cronhooks.io/schedules/'

export default async function addChronhook (title, path, payload, runAt) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cronhooks_key}`
  }

  const data = {
    group: cronhooks_group,
    title,
    url: webhook_url + path,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    method: 'POST',
    payload,
    contentType: 'application/json; charset=utf-8',
    isRecurring: false,
    runAt: runAt + 'T10:00:00.000Z',
    sendCronhookObject: true,
    sendFailureAlert: true,
    startsAt: new Date().toISOString(),
    retryCount: 3,
    retryIntervalSeconds: 5
  }

  return axios.post(api_url, data, { headers })
}
