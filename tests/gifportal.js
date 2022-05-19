const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log('Starting tests...');
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Gifportal;

  const baseAccount = anchor.web3.Keypair.generate();

  console.log('Account Public Key: ', baseAccount.publicKey.toString());
  console.log('Wallet Public Key: ', provider.wallet.publicKey.toString());
  console.log('System Program Id: ', anchor.web3.SystemProgram.programId.toString());

  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    },
    signers: [baseAccount]
  });
  console.log('Your transaction signature ', tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF count: ', account.totalGifs.toString());

  await program.rpc.addGif('https://educacion30.b-cdn.net/wp-content/uploads/2019/06/homer.gif',
  {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey
    }
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF count: ', account.totalGifs.toString());
  console.log('GIF List: ', account.gifList);
};

const runMain = async() => {
  try {
    await main();
    process.exit(0);
  }
  catch(error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();