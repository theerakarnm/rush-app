import React, { useContext } from "react";

// components
import CardListPackage from "components/Cards/CardListPackage";

// layout for page

import Admin from "layouts/Admin";
import { GetStaticProps } from "next";
import CardListStore from "components/Cards/CardListStore";

import { getSession } from "next-auth/react";
import { verify } from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const session = await getSession(context)

  if (!session) {
    return { redirect: { destination: '/auth/admin' } }
  }

  const secretKey: string = process.env.JWT_SECRET;
  const user = verify(session.tokenUser, secretKey)
  const adminType = await prisma.aCCOUNT_TYPE.findFirst({
    where: { NAME: process.env.TYPE_ADMIN_NAME }
  })
  await prisma.$disconnect()
  const ownerType = await prisma.aCCOUNT_TYPE.findFirst({
    where: { NAME: process.env.TYPE_OWNER_NAME }
  })
  await prisma.$disconnect()
  // เลือกทุก property
  const res = await prisma.aCCOUNT_PROFILE.findFirst({
    where: {
      ID: parseInt(user.ID),
      OR: [
        { ACCOUNT_TYPE_ID: adminType.ID },
        { ACCOUNT_TYPE_ID: ownerType.ID }
      ]
    },
  });
  await prisma.$disconnect()

  const dataRole = await JSON.parse(JSON.stringify(res))

  if (!dataRole) {
    return { redirect: { destination: '/' } }
  }

  let result
  try {
    const secretKey: string = process.env.JWT_SECRET;
    const user = await verify(session.tokenUser, secretKey);
    const response = await prisma.rESTAURANT_MEMBERS.findMany({
      where: { ACCOUNT_PROFILE_ID: parseInt(user.ID), IS_ACTIVE: true, RESTAURANT: { IS_ACTIVE: true } },
      include: {
        RESTAURANT: true
      },
      orderBy: [{ ID: "asc" }],
    });

    await prisma.$disconnect()
    result = JSON.parse(JSON.stringify(response))
  } catch (error) {
    console.log(error);

  }
  return { props: { StoreList: result } };
}

export function Settings(props) {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full h-screen">
          <CardListStore list={props.StoreList} />
        </div>
      </div>
    </>
  );
}

Settings.layout = Admin;

export default Settings;
