import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const profile = [...Array(6)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  rating: Math.floor(Math.random() * 3) + 3,
  name: faker.name.fullName(),
  price: faker.number.int({ min: 800, max: 5000 }),
}));

export default profile;