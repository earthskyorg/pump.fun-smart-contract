import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SwapArgs {
  amount: BN
  style: BN
}

export interface SwapAccounts {
  dexConfigurationAccount: PublicKey
  pool: PublicKey
  /** CHECK */
  globalAccount: PublicKey
  mintTokenOne: PublicKey
  poolTokenAccountOne: PublicKey
  userTokenAccountOne: PublicKey
  user: PublicKey
  rent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount"), borsh.u64("style")])

export function swap(
  args: SwapArgs,
  accounts: SwapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    {
      pubkey: accounts.dexConfigurationAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.globalAccount, isSigner: false, isWritable: true },
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
  const identifier = Buffer.from([248, 198, 158, 145, 225, 117, 135, 200])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
      style: args.style,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
