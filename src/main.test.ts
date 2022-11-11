import SDK from './main'
import { d, decimalsMultiplier } from "./utils";

const TokensMapping: Record<string, string> = {
  APTOS: '0x1::aptos_coin::AptosCoin',
  USDT: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT', //layerzero
  BTC: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T', // wormhole wrapped BTC
  WETH: '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T' // wormhole WETH
};

const CoinInfo: Record<string, { decimals: number }> = {
  APTOS: { decimals: 8 },
  USDT: { decimals: 6 },
  BTC: { decimals: 8 },
  WETH: { decimals: 8 }
}

function convertToDecimals(amount: number | string, token: string) {
  const mul = decimalsMultiplier(CoinInfo[token]?.decimals || 0);

  return d(amount).mul(mul)
}

function prettyAmount(amount: number | string, token: string) {
  const mul = decimalsMultiplier(CoinInfo[token]?.decimals || 0);

  return d(amount).div(mul)
}

describe('Swap Module', () => {
  const sdk = new SDK({
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
  })
  test('calculateRates (from mode)', async () => {
    console.log({amountIn: convertToDecimals(1, 'APTOS')});
    const output = await sdk.Swap.calculateRates({
      fromToken: TokensMapping.APTOS,
      toToken: TokensMapping.USDT,
      amount: convertToDecimals(1, 'APTOS'),
      curveType: 'uncorrelated',
      interactiveToken: 'from',
    })

    console.log({
      amount: output,
      pretty: prettyAmount(output, 'USDT'),
    });

    expect(1).toBe(1)
  });

  test('createSwapTransactionPayload (from mode)', async () => {
    const output = sdk.Swap.createSwapTransactionPayload({
      fromToken: TokensMapping.APTOS,
      toToken: TokensMapping.BTC,
      fromAmount: convertToDecimals('1', 'APTOS'),
      toAmount: convertToDecimals('4.995851', 'USDT'),
      interactiveToken: 'from',
      slippage: d(0.05),
      stableSwapType: 'normal',
      curveType: 'uncorrelated',
    })

    console.log(output);

    expect(1).toBe(1)
  });

  test('calculateRates (to mode)', async () => {
    console.log({amountInToMode: convertToDecimals(1, 'USDT')});
    const output = await sdk.Swap.calculateRates({
      fromToken: TokensMapping.APTOS,
      toToken: TokensMapping.USDT,
      amount: convertToDecimals('1', 'USDT'),
      curveType: 'uncorrelated',
      interactiveToken: 'to',
    })

    console.log({
      amount: output,
      pretty: prettyAmount(output, 'APTOS'),
    });

    expect(1).toBe(1)
  });

  test('createSwapTransactionPayload (to mode)', async () => {
    const output = sdk.Swap.createSwapTransactionPayload({
      fromToken: TokensMapping.APTOS,
      toToken: TokensMapping.USDT,
      fromAmount: convertToDecimals('0.20032734', 'APTOS'),
      toAmount: convertToDecimals('1', 'USDT'),
      interactiveToken: 'to',
      slippage: d(0.05),
      stableSwapType: 'normal',
      curveType: 'uncorrelated',
    })

    console.log(output);

    expect(1).toBe(1)
  });

  test('calculateRates (from mode stable)', async () => {
    console.log({amountIn: convertToDecimals(1, 'APTOS')});
    const output = await sdk.Swap.calculateRates({
      fromToken: TokensMapping.APTOS,
      toToken: TokensMapping.WETH,
      amount: convertToDecimals('1', 'APTOS'),
      curveType: 'stable',
      interactiveToken: 'from',
    })

    console.log({
      amount: output,
      pretty: prettyAmount(output, 'WETH'),
    });

    expect(1).toBe(1)
  });
})
