import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CurveConfigurationFields {
  fees: number
}

export interface CurveConfigurationJSON {
  fees: number
}

export class CurveConfiguration {
  readonly fees: number

  static readonly discriminator = Buffer.from([
    225, 242, 252, 198, 63, 77, 56, 255,
  ])

  static readonly layout = borsh.struct([borsh.f64("fees")])

  constructor(fields: CurveConfigurationFields) {
    this.fees = fields.fees
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<CurveConfiguration | null> {
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
  ): Promise<Array<CurveConfiguration | null>> {
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

  static decode(data: Buffer): CurveConfiguration {
    if (!data.slice(0, 8).equals(CurveConfiguration.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CurveConfiguration.layout.decode(data.slice(8))

    return new CurveConfiguration({
      fees: dec.fees,
    })
  }

  toJSON(): CurveConfigurationJSON {
    return {
      fees: this.fees,
    }
  }

  static fromJSON(obj: CurveConfigurationJSON): CurveConfiguration {
    return new CurveConfiguration({
      fees: obj.fees,
    })
  }
}
