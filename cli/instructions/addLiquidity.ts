import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddLiquidityArgs {
  amountOne: BN
  amountTwo: BN
}

export interface AddLiquidityAccounts {
  pool: PublicKey
  /** CHECK */
  globalAccount: PublicKey
  liquidityProviderAccount: PublicKey
  mintTokenOne: PublicKey
  poolTokenAccountOne: PublicKey
  userTokenAccountOne: PublicKey
  user: PublicKey
  rent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amountOne"),
  borsh.u64("amountTwo"),
])

export function addLiquidity(
  args: AddLiquidityArgs,
  accounts: AddLiquidityAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.globalAccount, isSigner: false, isWritable: true },
    {
      pubkey: accounts.liquidityProviderAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.mintTokenOne, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenAccountOne, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenAccountOne, isSigner: false, isWritable: true },
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([181, 157, 89, 67, 143, 182, 52, 72])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amountOne: args.amountOne,
      amountTwo: args.amountTwo,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
