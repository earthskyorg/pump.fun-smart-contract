import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface LiquidityPoolFields {
  tokenOne: PublicKey
  tokenTwo: PublicKey
  totalSupply: BN
  reserveOne: BN
  reserveTwo: BN
  bump: number
}

export interface LiquidityPoolJSON {
  tokenOne: string
  tokenTwo: string
  totalSupply: string
  reserveOne: string
  reserveTwo: string
  bump: number
}

export class LiquidityPool {
  readonly tokenOne: PublicKey
  readonly tokenTwo: PublicKey
  readonly totalSupply: BN
  readonly reserveOne: BN
  readonly reserveTwo: BN
  readonly bump: number

  static readonly discriminator = Buffer.from([
    66, 38, 17, 64, 188, 80, 68, 129,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("tokenOne"),
    borsh.publicKey("tokenTwo"),
    borsh.u64("totalSupply"),
    borsh.u64("reserveOne"),
    borsh.u64("reserveTwo"),
    borsh.u8("bump"),
  ])

  constructor(fields: LiquidityPoolFields) {
    this.tokenOne = fields.tokenOne
    this.tokenTwo = fields.tokenTwo
    this.totalSupply = fields.totalSupply
    this.reserveOne = fields.reserveOne
    this.reserveTwo = fields.reserveTwo
    this.bump = fields.bump
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<LiquidityPool | null> {
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
  ): Promise<Array<LiquidityPool | null>> {
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

  static decode(data: Buffer): LiquidityPool {
    if (!data.slice(0, 8).equals(LiquidityPool.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = LiquidityPool.layout.decode(data.slice(8))

    return new LiquidityPool({
      tokenOne: dec.tokenOne,
      tokenTwo: dec.tokenTwo,
      totalSupply: dec.totalSupply,
      reserveOne: dec.reserveOne,
      reserveTwo: dec.reserveTwo,
      bump: dec.bump,
    })
  }

  toJSON(): LiquidityPoolJSON {
    return {
      tokenOne: this.tokenOne.toString(),
      tokenTwo: this.tokenTwo.toString(),
      totalSupply: this.totalSupply.toString(),
      reserveOne: this.reserveOne.toString(),
      reserveTwo: this.reserveTwo.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: LiquidityPoolJSON): LiquidityPool {
    return new LiquidityPool({
      tokenOne: new PublicKey(obj.tokenOne),
      tokenTwo: new PublicKey(obj.tokenTwo),
      totalSupply: new BN(obj.totalSupply),
      reserveOne: new BN(obj.reserveOne),
      reserveTwo: new BN(obj.reserveTwo),
      bump: obj.bump,
    })
  }
}
