var SPL = require("@solana/spl-token");
var web3 = require("@solana/web3.js");
var json = require("./splTokenAddresses.json")

// 1. Go to magic eden with the candy machine ID which produced the NFTs: https://magiceden.io/mintlist-tool
// 2. Insert the list of token addresses into splTokenAddresses
// 

async function run() {
    setTimeout(async () => {
        for (let i = 0; i < json.length; i++) {

            const element = json[i];
            console.log(`SPL token mint: ${element}`);
            
            // Find the token account for each nft mint
            const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");

            const accounts = await connection.getParsedProgramAccounts(
                SPL.TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
                {
                filters: [
                    {
                    dataSize: 165, // number of bytes
                    },
                    {
                    memcmp: {
                        offset: 0, // number of bytes
                        bytes: element, // base58 encoded string
                    },
                    },
                ],
                }
            );
            // Just one token account for the nft
            const account = accounts[0];

            // Now lets find the owner
            const owner = account.account.data["parsed"]["info"]["owner"];
            console.log(`wallet owner of ${element} is WALLET: ${owner}`)
        }
        // Wait 5 seconds
    }, 5000);
};


run();