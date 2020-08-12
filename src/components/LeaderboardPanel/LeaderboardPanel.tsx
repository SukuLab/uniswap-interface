import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { darken } from 'polished'
import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'

import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween, RowFixed } from '../Row'

import axios from 'axios'

export const BodyWrapper = styled.div<{ disabled?: boolean }>`
  position: absolute;
  right: 0;
  max-width: 420px;
  width: 100%;
  /* background: ${({ theme }) => theme.bg1}; */
  /* box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01); */
  border-radius: 30px;
  padding: 1rem;
  /* opacity: ${({ disabled }) => (disabled ? '0.4' : '1')}; */
  pointer-events: ${({ disabled }) => disabled && 'none'};

 ${({ theme }) => theme.mediaWidth.upToLarge`
    position: relative;
  `};
`

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

interface LeaderboardPanelProps {
  // pair: Pair
  // showUnwrapped?: boolean
  border?: string
}

export default function LeaderboardPanel({ border }: LeaderboardPanelProps) {
  const [leaderboard, setLeaderboard] = useState([])
  const ranks = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(
        'https://raw.githubusercontent.com/SukuLab/liquidity-mining-rewards-script/master/results/leaderboard.json'
      )
      console.log('RESPONSE:')
      console.log(response.data)
      setLeaderboard(response.data)
    }
    fetchData()
  }, [])

  // Take the first 10 elements
  const leaderview = leaderboard.slice(1, 11).map((leader: string[], index) => (
    <FixedHeightRow key={leader[0]} style={{ justifyContent: 'space-around' }}>
      <Text color="#888D9B" fontSize={16} fontWeight={500}>
        {ranks[index]}
      </Text>
      <Text color="#888D9B" fontSize={16} fontWeight={500}>
        {leader[1]}
      </Text>
      <Text color="#888D9B" fontSize={16} fontWeight={500}>
        {leader[2]}
      </Text>
    </FixedHeightRow>
  ))

  return (
    <BodyWrapper>
      <GreyCard border={border}>
        <AutoColumn gap="18px">
          <Text fontWeight={700} fontSize={24}>
            Top 10 Liquiditiy Providers Leaderboard
          </Text>
          <FixedHeightRow style={{ justifyContent: 'space-around' }}>
            <Text color="#888D9B" fontSize={18} fontWeight={700}>
              Rank
            </Text>
            <Text color="#888D9B" fontSize={18} fontWeight={700}>
              SUKU Rewards
            </Text>
            <Text color="#888D9B" fontSize={18} fontWeight={700}>
              USD Rewards*
            </Text>
          </FixedHeightRow>
          {leaderview}
          <Text color="#888D9B" fontSize={12} fontWeight={500}>
            *USD Amount based on SUKU price at distribution
          </Text>
        </AutoColumn>
      </GreyCard>
    </BodyWrapper>
  )
}
