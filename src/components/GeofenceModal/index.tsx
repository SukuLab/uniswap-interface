import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../Modal'
import { Text } from 'rebass'
import { CloseIcon, Spinner } from '../../theme/components'
import { RowBetween } from '../Row'
import { AutoColumn, ColumnCenter } from '../Column'
import Circle from '../../assets/images/blue-loader.svg'

import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

interface GeofenceModalProps {
  isOpen: boolean
  onDismiss: () => void
  title?: string
}

export default function GeofenceModal({ isOpen, onDismiss, title = '' }: GeofenceModalProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontWeight={500} fontSize={20}>
              SUKU Geofence
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          By proceeding you are verifying that you are NOT a resident from the United States of America, Albania,
          Belarus, Bosnia, Cuba, Democratic Republic of the Congo, Herzegovina, Iran, Iraq, Lebanon, Liberia, Libya,
          Macedonia, Montenegro, Myanmar, North Korea, Serbia, Somalia, Sudan, Syria, the Crimea Region, Venezuela,
          Yemen, or Zimbabwe.
        </Section>
        <BottomSection gap="12px">
          Please do not proceed if you are a resident in one of the aforementioned regions.
        </BottomSection>
      </Wrapper>
    </Modal>
  )
}
