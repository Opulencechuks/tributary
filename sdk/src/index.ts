import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCUGN33DKXR36WAT7YOCMRC44XZFFHM6JNUZ7U7MDICQC22PCGY7ZJSS",
  }
} as const

export const Errors = {
  1: {message:"NoRecipients"},
  2: {message:"LengthMismatch"},
  3: {message:"ZeroShare"},
  4: {message:"BadShareTotal"},
  5: {message:"SplitNotFound"},
  6: {message:"SplitImmutable"},
  7: {message:"InvalidAmount"},
  8: {message:"NothingToDistribute"}
}


export interface Split {
  controller: Option<string>;
  recipients: Array<string>;
  shares: Array<u32>;
}






export interface Client {
  /**
   * Construct and simulate a pay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Moves `amount` of `token` from the payer to every recipient of the
   * split in one call. Rounding dust goes to the last recipient.
   */
  pay: ({from, id, token, amount}: {from: string, id: u64, token: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({id, token}: {id: u64, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Moves funds into the contract and credits them to the split without
   * paying anyone yet. Useful when money arrives before a distribution
   * should happen.
   */
  deposit: ({from, id, token, amount}: {from: string, id: u64, token: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_split: ({id}: {id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Split>>>

  /**
   * Construct and simulate a distribute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pays out everything credited to the split for the given token.
   * Anyone can call this; the routing table decides where funds go.
   */
  distribute: ({id, token}: {id: u64, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a split_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  split_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a create_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Registers a new split and returns its id. Shares are basis points
   * and must sum to exactly 10_000. Passing a controller makes the
   * split mutable by that address; passing None locks it forever.
   */
  create_split: ({creator, recipients, shares, controller}: {creator: string, recipients: Array<string>, shares: Array<u32>, controller: Option<string>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u64>>>

  /**
   * Construct and simulate a update_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Replaces the recipients and shares of a mutable split.
   */
  update_split: ({id, recipients, shares}: {id: u64, recipients: Array<string>, shares: Array<u32>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAMTm9SZWNpcGllbnRzAAAAAQAAAAAAAAAOTGVuZ3RoTWlzbWF0Y2gAAAAAAAIAAAAAAAAACVplcm9TaGFyZQAAAAAAAAMAAAAAAAAADUJhZFNoYXJlVG90YWwAAAAAAAAEAAAAAAAAAA1TcGxpdE5vdEZvdW5kAAAAAAAABQAAAAAAAAAOU3BsaXRJbW11dGFibGUAAAAAAAYAAAAAAAAADUludmFsaWRBbW91bnQAAAAAAAAHAAAAAAAAABNOb3RoaW5nVG9EaXN0cmlidXRlAAAAAAg=",
        "AAAAAQAAAAAAAAAAAAAABVNwbGl0AAAAAAAAAwAAAAAAAAAKY29udHJvbGxlcgAAAAAD6AAAABMAAAAAAAAACnJlY2lwaWVudHMAAAAAA+oAAAATAAAAAAAAAAZzaGFyZXMAAAAAA+oAAAAE",
        "AAAAAAAAAH9Nb3ZlcyBgYW1vdW50YCBvZiBgdG9rZW5gIGZyb20gdGhlIHBheWVyIHRvIGV2ZXJ5IHJlY2lwaWVudCBvZiB0aGUKc3BsaXQgaW4gb25lIGNhbGwuIFJvdW5kaW5nIGR1c3QgZ29lcyB0byB0aGUgbGFzdCByZWNpcGllbnQuAAAAAANwYXkAAAAABAAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAACAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAJVNb3ZlcyBmdW5kcyBpbnRvIHRoZSBjb250cmFjdCBhbmQgY3JlZGl0cyB0aGVtIHRvIHRoZSBzcGxpdCB3aXRob3V0CnBheWluZyBhbnlvbmUgeWV0LiBVc2VmdWwgd2hlbiBtb25leSBhcnJpdmVzIGJlZm9yZSBhIGRpc3RyaWJ1dGlvbgpzaG91bGQgaGFwcGVuLgAAAAAAAAdkZXBvc2l0AAAAAAQAAAAAAAAABGZyb20AAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAAAIAAAAD",
        "AAAABQAAAAAAAAAAAAAACURlcG9zaXRlZAAAAAAAAAEAAAAJZGVwb3NpdGVkAAAAAAAAAwAAAAAAAAACaWQAAAAAAAYAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAACVNwbGl0UGFpZAAAAAAAAAEAAAAKc3BsaXRfcGFpZAAAAAAAAwAAAAAAAAACaWQAAAAAAAYAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAAAAAAAAAAAAAJZ2V0X3NwbGl0AAAAAAAAAQAAAAAAAAACaWQAAAAAAAYAAAABAAAD6QAAB9AAAAAFU3BsaXQAAAAAAAAD",
        "AAAABQAAAAAAAAAAAAAAC0Rpc3RyaWJ1dGVkAAAAAAEAAAALZGlzdHJpYnV0ZWQAAAAAAwAAAAAAAAACaWQAAAAAAAYAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAAAAAAAH5QYXlzIG91dCBldmVyeXRoaW5nIGNyZWRpdGVkIHRvIHRoZSBzcGxpdCBmb3IgdGhlIGdpdmVuIHRva2VuLgpBbnlvbmUgY2FuIGNhbGwgdGhpczsgdGhlIHJvdXRpbmcgdGFibGUgZGVjaWRlcyB3aGVyZSBmdW5kcyBnby4AAAAAAApkaXN0cmlidXRlAAAAAAACAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
        "AAAABQAAAAAAAAAAAAAADFNwbGl0Q3JlYXRlZAAAAAEAAAANc3BsaXRfY3JlYXRlZAAAAAAAAAIAAAAAAAAAAmlkAAAAAAAGAAAAAQAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAADFNwbGl0VXBkYXRlZAAAAAEAAAANc3BsaXRfdXBkYXRlZAAAAAAAAAEAAAAAAAAAAmlkAAAAAAAGAAAAAQAAAAI=",
        "AAAAAAAAAAAAAAALc3BsaXRfY291bnQAAAAAAAAAAAEAAAAG",
        "AAAAAAAAAL5SZWdpc3RlcnMgYSBuZXcgc3BsaXQgYW5kIHJldHVybnMgaXRzIGlkLiBTaGFyZXMgYXJlIGJhc2lzIHBvaW50cwphbmQgbXVzdCBzdW0gdG8gZXhhY3RseSAxMF8wMDAuIFBhc3NpbmcgYSBjb250cm9sbGVyIG1ha2VzIHRoZQpzcGxpdCBtdXRhYmxlIGJ5IHRoYXQgYWRkcmVzczsgcGFzc2luZyBOb25lIGxvY2tzIGl0IGZvcmV2ZXIuAAAAAAAMY3JlYXRlX3NwbGl0AAAABAAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAApyZWNpcGllbnRzAAAAAAPqAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAPqAAAABAAAAAAAAAAKY29udHJvbGxlcgAAAAAD6AAAABMAAAABAAAD6QAAAAYAAAAD",
        "AAAAAAAAADZSZXBsYWNlcyB0aGUgcmVjaXBpZW50cyBhbmQgc2hhcmVzIG9mIGEgbXV0YWJsZSBzcGxpdC4AAAAAAAx1cGRhdGVfc3BsaXQAAAADAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAKcmVjaXBpZW50cwAAAAAD6gAAABMAAAAAAAAABnNoYXJlcwAAAAAD6gAAAAQAAAABAAAD6QAAAAIAAAAD" ]),
      options
    )
  }
  public readonly fromJSON = {
    pay: this.txFromJSON<Result<void>>,
        balance: this.txFromJSON<i128>,
        deposit: this.txFromJSON<Result<void>>,
        get_split: this.txFromJSON<Result<Split>>,
        distribute: this.txFromJSON<Result<i128>>,
        split_count: this.txFromJSON<u64>,
        create_split: this.txFromJSON<Result<u64>>,
        update_split: this.txFromJSON<Result<void>>
  }
}