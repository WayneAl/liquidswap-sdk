import { Decimal } from "decimal.js";

import { d } from "./numbers";

/**
 * Calculate return of Liquidity Coins
 * @param x {number} - x coin value with slippage
 * @param y {number} - y coin value with slippage
 * @param xReserve {number} - x coin reserves
 * @param yReserve {number} - y coin reserves
 * @param lpSupply {number} - liquidity pool supply value
 */
const MINIMAL_LIQUIDITY = 10000;

export function calcReceivedLP({
  x,
  y,
  xReserve,
  yReserve,
  lpSupply,
}: {
  x: number;
  y: number;
  xReserve: number;
  yReserve: number;
  lpSupply?: number;
}): number {
  const dxReserve = d(xReserve);
  const dyReserve = d(yReserve);
  const dx = d(x);
  const dy = d(y);
  const dSupply = d(lpSupply);

  if (dxReserve.eq(0) || dyReserve.eq(0)) {
    return Decimal.sqrt(dx.mul(dy)).minus(MINIMAL_LIQUIDITY).toNumber();
  }

  const xLp = dx.mul(dSupply).div(dxReserve);
  const yLp = dy.mul(dSupply).div(dyReserve);

  return Decimal.min(xLp, yLp).toNumber();
}

/**
 * Calculate output amount after burned
 * @param {number} xReserve - first coin reserves
 * @param {number} yReserve - second coin reserves
 * @param {number} lpSupply - liquidity pool supply value
 * @param {number} toBurn - burn amount
 */
export function calcOutputBurnLiquidity({
  xReserve,
  yReserve,
  lpSupply,
  toBurn,
}: {
  xReserve: number;
  yReserve: number;
  lpSupply: number;
  toBurn: number;
}) {
  const xReturn = d(toBurn).mul(xReserve).div(lpSupply);
  const yReturn = d(toBurn).mul(yReserve).div(lpSupply);

  if (xReturn.eq(0) || yReturn.eq(0)) {
    return undefined;
  }

  return {
    x: xReturn.toNumber(),
    y: yReturn.toNumber(),
  };
}

export function getOptimalLiquidityAmount(
  xDesired: number,
  xReserve: number,
  yReserve: number
): number {
  return Number(d(xDesired).mul(d(yReserve)).div(d(xReserve)).toFixed(0));
}

//TODO: add lpTokenNameStr from liquidswap-ui with resources account;
