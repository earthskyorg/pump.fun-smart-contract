import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pump } from "../target/types/pump"
import { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, ComputeBudgetProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { BN } from "bn.js";
import keys from '../keys/users.json'
import key2 from '../keys/user2.json'
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const connection = new Connection("http://localhost:8899")
const curveSeed = "CurveConfiguration"
const POOL_SEED_PREFIX = "liquidity_pool"

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("pump", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Pump as Program<Pump>;


  // custom setting 
  const user = Keypair.fromSecretKey(new Uint8Array(keys))
  const user2 = Keypair.fromSecretKey(new Uint8Array(key2))
  const tokenDecimal = 6
  const amount = new BN(1000000000).mul(new BN(10 ** tokenDecimal))
  console.log(BigInt(amount.toString()))
  console.log(BigInt(amount.toString()).toString())
  console.log("🚀 ~ describe ~ amount:", amount.toString())

  let mint1: PublicKey
  let tokenAta1: PublicKey

  // let mint2: PublicKey
  // let tokenAta2: PublicKey

  console.log("Admin's wallet address is : ", user.publicKey.toBase58())

  it("Swap token", async () => {
    try {
      const [curveConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from(curveSeed)],
        program.programId
      )

      const [poolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(POOL_SEED_PREFIX), mint1.toBuffer()],
        program.programId
      )
      const poolTokenOne = await getAssociatedTokenAddress(
        mint1, poolPda, true
      )
      
      const userAta1 = await getAssociatedTokenAddress(
        mint1, user.publicKey
      )
      

      const tx = new Transaction()
        .add(
          ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 }),
          await program.methods
            .swap(new BN(200000000), new BN(2))
            .accounts({
              pool: poolPda,
              mintTokenOne: mint1,
              poolTokenAccountOne: poolTokenOne,
              userTokenAccountOne: userAta1,
              dexConfigurationAccount: curveConfig,
              user: user.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
              rent: SYSVAR_RENT_PUBKEY,
              systemProgram: SystemProgram.programId
            })
            .instruction()
        )
      tx.feePayer = user.publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const sig = await sendAndConfirmTransaction(connection, tx, [user], { skipPreflight: true })
      console.log("Successfully swapped : ", sig)

    } catch (error) {
      console.log("Error in swap transaction", error)
    }
  })

});

function comparePublicKeys(pubkey1: PublicKey, pubkey2: PublicKey): number {
  const key1Bytes = pubkey1.toBuffer();
  const key2Bytes = pubkey2.toBuffer();

  for (let i = 0; i < key1Bytes.length; i++) {
    if (key1Bytes[i] > key2Bytes[i]) {
      return 1;
    } else if (key1Bytes[i] < key2Bytes[i]) {
      return -1;
    }
  }
  return 0;
}

function generateSeed(tokenOne: PublicKey, tokenTwo: PublicKey): string {
  return comparePublicKeys(tokenOne, tokenTwo) > 0
    ? `${tokenOne.toString()}${tokenTwo.toString()}`
    : `${tokenTwo.toString()}${tokenOne.toString()}`;
}