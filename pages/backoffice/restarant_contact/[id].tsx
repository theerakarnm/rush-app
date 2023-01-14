// const [contactProvider, setContactProvider] = useState([]);
import React from "react";

// components

// layout for page

import CardListRestarantContact from "components/Cards/CardListRestarantContact";


import { getSession } from "next-auth/react";
import BackOffice from "layouts/BackOffice";
import { verify } from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const session = await getSession(context)

  if (!session) {
    return { redirect: { destination: '/auth/backoffice' } }
  }

  const secretKey: string = process.env.JWT_SECRET;
  const user = verify(session.tokenUser, secretKey)
  const accountTypeId = await prisma.aCCOUNT_TYPE.findFirst({
    where: { NAME: process.env.TYPE_ADMIN_NAME }
  })
  await prisma.$disconnect()

  // เลือกทุก property
  const res = await prisma.aCCOUNT_PROFILE.findFirst({
    where: {
      ID: parseInt(user.ID),
      ACCOUNT_TYPE_ID: accountTypeId.ID
    },
  });

  await prisma.$disconnect()

  const dataRole = await JSON.parse(JSON.stringify(res))

  if (!dataRole) {
    return { redirect: { destination: '/' } }
  }

  const response = await prisma.rESTAURANT_CONTACT.findMany({
    where: {
      RESTAURANT_ID: parseInt(context.params.id),
    }, include: { CONTACT_PROVIDER: true }
  });
  await prisma.$disconnect()
  const result = await JSON.parse(JSON.stringify(response));


  return { props: { contactList: result, restaurantId: context.params.id } };
}

export function Area({ contactList, restaurantId, contactProviderList }) {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full h-screen">
          <CardListRestarantContact list={contactList} restaurantId={restaurantId} contactProviderList={contactProviderList} />
        </div>
      </div>
    </>
  );
}

Area.layout = BackOffice;

export default Area;
