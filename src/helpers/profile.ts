import namehash from '@ensdomains/eth-ens-namehash';
import getProvider from '@sunappushotto/sunappushotto.js/src/utils/provider';
import { call } from '@sunappushotto/sunappushotto.js/src/utils';

function ensReverseRecordRequest(addresses) {
  const network = '10000';
  const provider = getProvider(network);
  const abi = [
    {
      inputs: [
        { internalType: 'address[]', name: 'addresses', type: 'address[]' }
      ],
      name: 'getNames',
      outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
      stateMutability: 'view',
      type: 'function'
    }
  ];
  return call(
    provider,
    abi,
    ['0x67F0DD63065675830cba1f3CDb74390f4d5251E1', 'getNames', [addresses]],
    { blockTag: 'latest' }
  );
}

function lookupAddresses(addresses) {
  return new Promise((resolove, reject) => {
    ensReverseRecordRequest(addresses)
      .then(reverseRecords => {
        const validNames = reverseRecords.map(n =>
          namehash.normalize(n) === n ? n : ''
        );
        const ensNames = Object.fromEntries(
          addresses.map((address, index) => {
            return [address.toLowerCase(), validNames[index]];
          })
        );

        resolove(ensNames);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getProfiles(addresses) {
  addresses = addresses.slice(0, 250);
  let ensNames: any = {};
  try {
    ensNames = await lookupAddresses(addresses);
  } catch (e) {
    console.log(e);
  }

  const profiles = Object.fromEntries(addresses.map(address => [address, {}]));
  return Object.fromEntries(
    Object.entries(profiles).map(([address, profile]) => {
      profile = {};
      profile.ens = ensNames[address.toLowerCase()] || '';
      if (profile.ens) profile.name = profile.ens;
      return [address, profile];
    })
  );
}
