# multichain-bridge


## Install
```sh
npm i multichain-bridge
```
 
## GetTokenListByChainID
```bash
Get token list
```
### srcChainID
```bash
Current chain ID, required
```
### destChainID
```bash
Dest chain ID, not required
```
### tokenList
```bash
Token list, array format, not required
```

## GetChainList
```bash
Support chain information
```

## buildSwapoutSpecData
```bash
Build BTC、LTC、BLOCK etc. tx data
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```
### destChain
```bash
Dest chain label,for example: BTC、LTC、BLOCK etc.
```

## buildSwapoutErc20Data
```bash
Build erc20 tx data
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```

## buildSwapoutData
```bash
Build swapout tx data
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```
### destChain
```bash
Dest chain label
```

## buildSwapinData
```bash
Build swapin tx data
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```

## signSwapoutSpecData
```bash
Send swapout tx,for example: BTC、LTC、BLOCK etc.
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```
### destChain
```bash
Dest chain label
```

## signSwapoutErc20Data
```bash
Send erc20 swapout tx
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```

## signSwapoutData
```bash
Send swapout tx
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```
### destChain
```bash
Dest chain label
```

## signSwapinData
```bash
Send swapin tx
```
### value
```bash
Token amount,for example: '0x0'
```
### address
```bash
Receive address
```
### token
```bash
Token address
```

## createAddress
### param1
```bash
Erc20 address
```
### param2
```bash
Chain label
```
### param3
```bash
Deposit address
```

## isAddress
### param1
```bash
Address
```
### param2
```bash
Chain label
```
