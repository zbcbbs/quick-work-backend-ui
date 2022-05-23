import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbXbrqv9/mXDUmXdiiZk4ffTzqiM7t7bng35irsB6uPpgtQ5gIAgaro+E7z9lAeK44Gh325WFE+0+vSZ5t+OpcJ/fFN6GEWts6l2YoqgNxXayxpnEL1JKaPOJ2iXMywy0FCa3W4WN/gcl/PCmZk4Ok5jvPVTgqOzGG20D+zYEyNQIDAQAB'

const privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJtduuq/3+ZcNSZd2KJmTh99POqIzu3tueDfmKuwHq4+mC1DmAgCBquj4TvP2UB4rjgaHfblYUT7T69Jnm346lwn98U3oYRa2zqXZiiqA3FdrLGmcQvUkpo84naJczLDLQUJrdbhY3+ByX88KZmTg6TmO89VOCo7MYbbQP7NgTI1AgMBAAECgYBDF5XZO+SnaNg26j3b24wPAxkkOtIJYyhq2IPoWFTXcAZtPYxQoPdadZmVJ6ussLCjX3vjG6kGjfQaQRNecChb12oGpV7dN3F5xQ0KvWeysUepwj1olLFHrb5eO1R+P5CkE2sTJFmM0cxEUoZPmK0sVgHcShbrfUIDzWaCnVtZnQJBAOdynQduR29W22vgRdndrLK8pqZyvuZEbTGKolaJBf56KfhScO+rjqge6al1e9RfwvR/PLj43qHIWSlkfkob9PMCQQCr2Ptvn5cQ2eMYdzBSJ/4ZOketyQhRp5apJLitAYQxlz4ihjTAFDawNaHlI7zueAr7jKDUm8yyWqaTnnePLqY3AkEAv5cuDBerBKzG6I7347jQHAl0frbf9ifQqEEVz0KQdq7UDV7ZZF0Es4Ebdg7t2ckHznOBZbGGQjBiNpScwmZQJwJAQiLBsZXTx7JzScklGZk2m3LofyNtRi+fNf1h7YM14vf3+8V2q62b1njtk4gLgCNG5sSaaPiE8OceUJWeIcasRQJBAIMhvyaWI1tqSVY3jYQ7sU/B1F/VRnQzSu1/wZ/iO2YtnTgD8VSEbeJKhws3nJpew/UpOWpMLvc/UrcQjubd71Y='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 执行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
