import {
  SubstrateEvent,
} from "@subql/types";
import { MultisigsFactory } from "../types/models/MultisigsFactory";

export async function handleWasmEvent(event: SubstrateEvent): Promise<void> {
  logger.info(
    `New MultisigFactory event found at block ${event.block.block.header.number.toString()}`
  );

  // Get data from the event
  // The balances.transfer event has the following payload \[from, to, value\]
  // logger.info(JSON.stringify(event));
  // const {
  //  event: {
  //    data: [from, to, amount],
  //  },
  // } = event;

  const mf = await getOrCreateMultisigsFactory(); // it's a singleton
  mf.totalMultisigs = mf.totalMultisigs + 1;

  await Promise.all([mf.save()]);
}

async function getOrCreateMultisigsFactory(): Promise<MultisigsFactory> {
  let mf = await MultisigsFactory.get('0');
  if (!mf) {
    // We couldn't find the account
    mf = MultisigsFactory.create({
      id: '0',
      totalMultisigs: 0,
    });
  }
  return mf;
}