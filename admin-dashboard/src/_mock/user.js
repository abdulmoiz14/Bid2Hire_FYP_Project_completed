import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  rating: Math.floor(Math.random() * 3) + 3,
  name: faker.name.fullName(),
  phoneNo: faker.phone.number('+92 3## #######'),
  dt: faker.date.recent({ days: 20, refDate: '2023-06-13T00:00:00.000Z' }),
  category: sample([
    'Electrician',
    'Carpanter',
    'Cleaner',
    'Labor',
    'Motor Mechanic',
    'Gardener',
    'Help Shifting',
    'Painter',
    'Plumber',
  ]),
}));

export default users;
