import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getFindoneContactProvider(req, res) {
  const data = req.body;


  const response = await prisma.rESTAURANT_CONTACT.findMany({
    where: {
      RESTAURANT_ID: parseInt(data.restaurantId),
    }, include: { CONTACT_PROVIDER: true }
  });
  await prisma.$disconnect();


    if (response) {
      res.status(200).json(response);
    } else res.status(400).json({});
}
// http://localhost:3000/api/restaurant_gallery/findmany

export default getFindoneContactProvider;
