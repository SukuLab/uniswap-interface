import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'
import { RowBetween } from '../Row'
import { ButtonLight, ButtonOutlined, ButtonSecondary } from '../Button'
import MetamaskIcon from '../../assets/images/metamask.png'

export default function AddTokenMetaMask({ show = true, ...rest }: { show?: boolean; style?: React.CSSProperties }) {
  const { ethereum } = window
  const isMetaMask = ethereum?.isMetaMask

  // TODO: Move to config
  const tokenAddress = '0x0763fdCCF1aE541A5961815C0872A8c5Bc6DE4d7'
  const tokenSymbol = 'SUKU'
  const tokenDecimals = 18
  const tokenImage =
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0763fdCCF1aE541A5961815C0872A8c5Bc6DE4d7/logo.png'

  const watchToken = async (): Promise<boolean> => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage // A string url of the token logo
          }
        }
      })

      if (wasAdded) {
        console.log('Thanks for your interest!')
        return true
      } else {
        console.log('Your loss!')
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  return (
    <>
      {show && isMetaMask && (
        <div style={{ display: 'flex', height: '3rem' }}>
          <ButtonOutlined
            style={{
              width: '8rem',
              fontSize: '12px',
              marginTop: '2rem',
              height: '3rem'
            }}
            onClick={() => watchToken()}
          >
            <RowBetween>
              <img style={{ marginRight: '0', height: '2rem' }} src={tokenImage} />
              +
              <img style={{ marginRight: '0', height: '2rem' }} src={MetamaskIcon} />
            </RowBetween>
          </ButtonOutlined>
        </div>
      )}
    </>
  )
}
