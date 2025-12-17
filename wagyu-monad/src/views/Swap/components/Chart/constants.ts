import { CHAIN_ID } from 'config/constants/networks'

// Native wrapped token address based on chain
// VLX for Velas (106), WMON for Monad (143)
const MONAD_WMON_ADDRESS = '0xffdff1bab47d8e6d1da119f5c925fac91fafa899'
const VELAS_WVLX_ADDRESS = '0xc579d1f3cf86749e05cd06f7ade17856c2ce3126'

const VLX_ADDRESS = parseInt(CHAIN_ID, 10) === 143 ? MONAD_WMON_ADDRESS : VELAS_WVLX_ADDRESS

export { VLX_ADDRESS, MONAD_WMON_ADDRESS, VELAS_WVLX_ADDRESS }
