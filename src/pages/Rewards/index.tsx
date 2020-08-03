import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useToken } from '../../hooks/Tokens'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const sukuToken = useToken('0x0763fdccf1ae541a5961815c0872a8c5bc6de4d7')

  // fetch the balance of the rewards account
  // TODO: Pull Rewards address out into env variable
  const rewardBalance = useTokenBalance('0xc05ec5235ce6050375adce1f86bbec949c3c366f', sukuToken ?? undefined)
  const sukuRewardsText = rewardBalance
    ? `${parseInt(rewardBalance.toSignificant(4)).toLocaleString()} SUKU`
    : `Loading`

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'rewards'} />
        <AutoColumn gap="lg" justify="center">
          {/* TODO Remove Comment*/}
          {/* <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 16 }} to="/add/ETH">
            <Text fontWeight={500} fontSize={20}>
              Add Liquidity
            </Text>
          </ButtonPrimary> */}

          {/* 
              Public Rewards 
          */}
          {/* Total Rewards */}
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.text1} fontWeight={500}>
                Total Rewards
              </Text>
              {/* TODO: Provide information on where to find offical deets about the campagin? */}
              {/* FIXME: Update this text */}
              <Question text="Provide liquidity for SUKU and earn SUKU rewards." />
            </RowBetween>
            <LightCard padding="20px">
              <TYPE.largeHeader color={theme.primary1} textAlign="center">
                {/* FIXME: Set as an env variable */}
                3,200,000 SUKU
              </TYPE.largeHeader>
            </LightCard>
          </AutoColumn>

          {/* Rewards remaining */}
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.text1} fontWeight={500}>
                Rewards Remaining
              </Text>
              {/* TODO: Provide information on where to find offical deets about the campagin? */}
              {/* FIXME: Update this text */}
              <Question text="Provide liquidity for SUKU and earn SUKU rewards." />
            </RowBetween>
            <LightCard padding="20px">
              <TYPE.largeHeader color={theme.primary1} textAlign="center">
                {sukuRewardsText}
              </TYPE.largeHeader>
            </LightCard>
          </AutoColumn>

          {/* Private Rewards */}
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.text1} fontWeight={500}>
                Your Reward Status
              </Text>
              <Question text="See the rewards status of your Web3 connected account." />
            </RowBetween>

            {!account ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your rewards status.
                </TYPE.body>
              </LightCard>
            ) : v2IsLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </LightCard>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
              <LightCard padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  {/* TODO: Find Current Share Ownership of Pool Tokens * value of tokens (etherscan api) */}
                  No liquidity found.
                </TYPE.body>
              </LightCard>
            )}
          </AutoColumn>
        </AutoColumn>
      </AppBody>
    </>
  )
}
