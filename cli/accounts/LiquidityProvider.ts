import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface LiquidityProviderFields {
  shares: BN
}

export interface LiquidityProviderJSON {
  shares: string
}

export class LiquidityProvider {
  readonly shares: BN

  static readonly discriminator = Buffer.from([
    219, 241, 238, 133, 56, 225, 229, 191,
  ])

  static readonly layout = borsh.struct([borsh.u64("shares")])

  constructor(fields: LiquidityProviderFields) {
    this.shares = fields.shares
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<LiquidityProvider | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<LiquidityProvider | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): LiquidityProvider {
    if (!data.slice(0, 8).equals(LiquidityProvider.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = LiquidityProvider.layout.decode(data.slice(8))

    return new LiquidityProvider({
      shares: dec.shares,
    })
  }

  toJSON(): LiquidityProviderJSON {
    return {
      shares: this.shares.toString(),
    }
  }

  static fromJSON(obj: LiquidityProviderJSON): LiquidityProvider {
    return new LiquidityProvider({
      shares: new BN(obj.shares),
    })
  }
}
