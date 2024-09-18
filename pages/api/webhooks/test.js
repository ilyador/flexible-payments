import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  });

  console.log(req.body)

  res.json({ message: 'Hello NextJs Cors!' });
}
