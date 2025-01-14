import Client from '@sunappushotto/sunappushotto.js/src/client';

const hubUrl = import.meta.env.VITE_HUB_URL || 'https://testnet.snapshot.org';
const client = new Client(hubUrl);

export default client;
