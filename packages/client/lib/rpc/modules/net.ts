import { addHexPrefix } from '@nomicfoundation/ethereumjs-util'

import { middleware } from '../validation'

import type { EthereumClient } from '../..'
import type { Chain } from '../../blockchain'
import type { PeerPool } from '../../net/peerpool'
import type { EthereumService } from '../../service/ethereumservice'

/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
export class Net {
  private _chain: Chain
  private _client: EthereumClient
  private _peerPool: PeerPool

  /**
   * Create net_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._client = client
    this._peerPool = service.pool

    this.version = middleware(this.version.bind(this), 0, [])
    this.listening = middleware(this.listening.bind(this), 0, [])
    this.peerCount = middleware(this.peerCount.bind(this), 0, [])
  }

  /**
   * Returns the current network id
   * @param params An empty array
   */
  version(_params = []) {
    return this._chain.config.chainCommon.chainId().toString()
  }

  /**
   * Returns true if client is actively listening for network connections
   * @param params An empty array
   */
  listening(_params = []) {
    return this._client.opened
  }

  /**
   * Returns number of peers currently connected to the client
   * @param params An empty array
   */
  peerCount(_params = []) {
    return addHexPrefix(this._peerPool.peers.length.toString(16))
  }
}
