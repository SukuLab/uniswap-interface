import React, { useState, useEffect, useContext } from 'react'
import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { darken } from 'polished'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'

import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween, RowFixed } from '../Row'

import axios from 'axios'

export const BodyWrapper = styled.div<{ disabled?: boolean }>`
  position: absolute;
  right: 0;
  max-width: 420px;
  width: 100%;
  padding-right: 1rem
  border-radius: 30px;
  pointer-events: ${({ disabled }) => disabled && 'none'};

 ${({ theme }) => theme.mediaWidth.upToLarge`
    position: relative;
    padding: 0;
    padding-top: 1rem;
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
  const theme = useContext(ThemeContext)
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
  const leaderview = leaderboard.slice(1, 11).map((leader: string[], index) => {
    const fontWeight = index > 2 ? 500 : 700

    return (
      <FixedHeightRow key={leader[0]} style={{ justifyContent: 'space-around' }}>
        {/* <Text color="#888D9B" fontSize={16} fontWeight={fontWeight}>
          {ranks[index]}
        </Text> */}
        <Text color="#888D9B" fontSize={16} fontWeight={fontWeight}>
          {leader[1]}
        </Text>
        <Text color="#888D9B" fontSize={16} fontWeight={fontWeight}>
          {leader[2]}
        </Text>
        <Text color="#888D9B" fontSize={16} fontWeight={fontWeight}>
          {leader[3]}
        </Text>
      </FixedHeightRow>
    )
  })

  return (
    <BodyWrapper>
      <GreyCard border={border}>
        <AutoColumn gap="18px">
          <Text fontWeight={700} fontSize={24}>
            Top 10 Liquiditiy Providers Leaderboard
          </Text>
          <FixedHeightRow style={{ justifyContent: 'space-around', height: '48px' }}>
            {/* <Text color={theme.rewardsText} fontSize={18} fontWeight={700}>
              Rank
            </Text> */}
            <Text color={theme.rewardsText} fontSize={18} fontWeight={700} textAlign={'center'}>
              SUKU Rewards
            </Text>
            <Text color={theme.rewardsText} fontSize={18} fontWeight={700} textAlign={'center'}>
              Rewards USD*
            </Text>
            <Text color={theme.rewardsText} fontSize={18} fontWeight={700} textAlign={'center'} width={'140px'}>
              Liquidity Provided USD*
            </Text>
          </FixedHeightRow>
          {leaderview}
          <Text color="#888D9B" fontSize={12} fontWeight={500}>
            *USD Amount based on price at distribution
          </Text>
        </AutoColumn>
      </GreyCard>
    </BodyWrapper>
  )
}
