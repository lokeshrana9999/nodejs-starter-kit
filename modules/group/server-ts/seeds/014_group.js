import { returnId, truncateTables } from '@gqlapp/database-server-ts';

const users = ['admin@example.com'];

for (let i = 1; i < 11; i++) {
  users.push(`user${i}@example.com`);
}

export async function seed(knex) {
  await truncateTables(knex, Promise, ['group_member', 'group']);

  await Promise.all(
    [...Array(30).keys()].map(async i => {
      return returnId(knex('group')).insert({
        title: `Group ${i + 1}`,
        avatar:
          'https://res.cloudinary.com/approxyma/image/upload/v1597239739/download_rph33w.jpg',
        group_type: `Type ${Math.floor(Math.random() * 10)}`,
        description: `Lorem Ipsum ${i + 1} is simply dummy text of the printing and typesetting industry.`
      });
    })
  );

  await Promise.all(
    [...Array(30).keys()].map(async i => {
      return returnId(knex('group_member')).insert({
        group_id: i + 1,
        email: users[Math.floor(Math.random() * 11)],
        type: 'MANAGER',
        status: 'ADDED'
      });
    })
  );
}
