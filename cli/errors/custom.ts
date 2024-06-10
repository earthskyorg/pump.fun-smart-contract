export type CustomError =
  | DuplicateTokenNotAllowed
  | FailedToAllocateShares
  | FailedToDeallocateShares
  | InsufficientShares
  | InsufficientFunds
  | InvalidAmount
  | InvalidFee
  | FailedToAddLiquidity
  | FailedToRemoveLiquidity
  | OverflowOrUnderflowOccurred

export class DuplicateTokenNotAllowed extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "DuplicateTokenNotAllowed"
  readonly msg = "Duplicate tokens are not allowed"

  constructor(readonly logs?: string[]) {
    super("6000: Duplicate tokens are not allowed")
  }
}

export class FailedToAllocateShares extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "FailedToAllocateShares"
  readonly msg = "Failed to allocate shares"

  constructor(readonly logs?: string[]) {
    super("6001: Failed to allocate shares")
  }
}

export class FailedToDeallocateShares extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "FailedToDeallocateShares"
  readonly msg = "Failed to deallocate shares"

  constructor(readonly logs?: string[]) {
    super("6002: Failed to deallocate shares")
  }
}

export class InsufficientShares extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "InsufficientShares"
  readonly msg = "Insufficient shares"

  constructor(readonly logs?: string[]) {
    super("6003: Insufficient shares")
  }
}

export class InsufficientFunds extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InsufficientFunds"
  readonly msg = "Insufficient funds to swap"

  constructor(readonly logs?: string[]) {
    super("6004: Insufficient funds to swap")
  }
}

export class InvalidAmount extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "InvalidAmount"
  readonly msg = "Invalid amount to swap"

  constructor(readonly logs?: string[]) {
    super("6005: Invalid amount to swap")
  }
}

export class InvalidFee extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "InvalidFee"
  readonly msg = "Invalid fee"

  constructor(readonly logs?: string[]) {
    super("6006: Invalid fee")
  }
}

export class FailedToAddLiquidity extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "FailedToAddLiquidity"
  readonly msg = "Failed to add liquidity"

  constructor(readonly logs?: string[]) {
    super("6007: Failed to add liquidity")
  }
}

export class FailedToRemoveLiquidity extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "FailedToRemoveLiquidity"
  readonly msg = "Failed to remove liquidity"

  constructor(readonly logs?: string[]) {
    super("6008: Failed to remove liquidity")
  }
}

export class OverflowOrUnderflowOccurred extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "OverflowOrUnderflowOccurred"
  readonly msg = "Overflow or underflow occured"

  constructor(readonly logs?: string[]) {
    super("6009: Overflow or underflow occured")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new DuplicateTokenNotAllowed(logs)
    case 6001:
      return new FailedToAllocateShares(logs)
    case 6002:
      return new FailedToDeallocateShares(logs)
    case 6003:
      return new InsufficientShares(logs)
    case 6004:
      return new InsufficientFunds(logs)
    case 6005:
      return new InvalidAmount(logs)
    case 6006:
      return new InvalidFee(logs)
    case 6007:
      return new FailedToAddLiquidity(logs)
    case 6008:
      return new FailedToRemoveLiquidity(logs)
    case 6009:
      return new OverflowOrUnderflowOccurred(logs)
  }

  return null
}
