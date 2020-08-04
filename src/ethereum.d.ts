interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    request?: (options: {
      method: string
      params: {
        type: 'ERC20' // More will be supported in the future
        options: {
          address: string // Address of token
          symbol: string // Token Symbol
          decimals: number // Token Decimals
          image: string // URL of token logo
        }
      }
    }) => Promise<boolean>
  }
  web3?: {}
}
