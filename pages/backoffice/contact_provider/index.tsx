import React from 'react';

// components

// layout for page

import BackOffice from 'layouts/BackOffice';
// import CardListRestaurantCategories from "components/BackOffice/Cards/CardListRestaurantCategories";
import CardListContactProvider from 'components/BackOffice/Cards/CardListContactProvider';

import { getSession } from 'next-auth/react';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { Session } from 'next-auth';
export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const session = (await getSession(context)) as Session & {
    tokenUser: string;
    fname: string;
    lname: string;
  };
  if (!session) {
    return { redirect: { destination: '/auth/backoffice' } };
  }

  const secretKey: string = process.env.JWT_SECRET;
  const user = verify(session.tokenUser, secretKey);
  const accountTypeId = await prisma.aCCOUNT_TYPE.findFirst({
    where: { NAME: process.env.TYPE_ADMIN_NAME },
  });
  await prisma.$disconnect();

  // เลือกทุก property
  const res = await prisma.aCCOUNT_PROFILE.findFirst({
    where: {
      ID: +user.id,
      ACCOUNT_TYPE_ID: accountTypeId.ID,
    },
  });

  await prisma.$disconnect();

  const dataRole = await JSON.parse(JSON.stringify(res));

  if (!dataRole) {
    return { redirect: { destination: '/' } };
  }

  const response = await prisma.cONTACT_PROVIDER.findMany({
    orderBy: [{ ID: 'asc' }],
  });
  await prisma.$disconnect();

  const result = await JSON.parse(JSON.stringify(response));

  return { props: { contactProvider: result } };
}

export function MusicStyle({ contactProvider }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full h-screen'>
          <CardListContactProvider list={contactProvider} />
        </div>
      </div>
    </>
  );
}

MusicStyle.layout = BackOffice;

export default MusicStyle;
