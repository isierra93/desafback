import { faker } from '@faker-js/faker'
faker.locale = 'es'

export const fakeProds = () => ({
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.avatar()
});

/* https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1010.jpg */