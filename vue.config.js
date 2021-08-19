const pem = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDe9McTcwZKfN1t
c4rC05wBC8NfMitgHxJUYe41APRujomWcOsxOu//i1MJ7C0u8dk3ztx5k93ambBs
eVH+22Z+x1HZ2YXvxpm1pdYxuQYr08PqVcWPUPz6AmQAgLFc2rLAI11iBVot+ed5
yUqdBC/L5CC4OwFTKVZ/bQYIdoA651XEWunPgXF+1o8sBAqCOe0/9HzCpixdshdw
ljH0YoycDDM5tL0cCvJrzC5BZh8EfqN7CtRoMtnlskDMiCd4FSh02MSasQKFdgK8
ZNXJBRsuK05FkE8Y3lykaAvWvo6cNC9JL/UzSGnLp5J+IsE/E1d53XuSDlG+n4Hn
qh3vzQJJAgMBAAECggEAZWO1IFAfnUIZRAvWH3ExsXwS9biP5x9aK4t5UxtDDP++
6+4f1nxx5akLMyj3BzEuUeW9d4BZ1G4tv7aQJjDJ9H9Z5pK4COksv2FR/byhZM7h
ejBVLi5rTJpHtb7QaWR/A0dR0SCT+PJ7ZHO4fZ0Iy1TL2Fvk51eWIU6H/tM8zwvJ
MIIKAuFkodhxcf3Dhj+njFPtIsdQ/Lva3lfs/vQ3TKi78L4M0EFtwieyWpUeVsNX
554f/u7g5WqjkE+6VITrJP14LA/6uptvlJ88mgcvtB6S/WIgekWdJFRYWPJ1kubr
n3dDYve6or25GXH34+jgSyT/1zDf7PPXTVOhUfPYXQKBgQDyzhP+Ab/9OYXGRgdx
TsQiT3FzF0WrflKs+0qj7dZnsbyPnGR0BMEu0tgvwvPvujQK1NecwQm+18XfVxQp
agayOZObrjtQTJZ80q2W2gzu4U83UQBwj4Aro4AJ5o0cpLbdJ6ujIekH63BskbkJ
wFO6rBVEwyMGbHJS3wGQ+Vz8zwKBgQDrEo+jK2orYE3LBC2HniJyv7E6uly3o+p4
T819JdRWum59AhR2OAWEuWJQ/MVyHF1iiMESWORWcyyzafdS8fdFvkRZ3Qo0ushu
qPfJhtIWpJNkzfM6XbbO5o6vhpnkVgYiOP5dZ4JujxCorNBer9UPMXanlwUAl302
TtHpy6jFZwKBgQCImRN6RXXDeoceIuuw/UUuoE8NFrylXG4az00QqI+EyuNwT+Xb
t4kPVKM3S5B8/96jcVbT424eJbo2igDXw8R8pBO88+p+pHfNRaFPSuEXyz4LutBq
gvDynAs+hqxAvxH5nYXcQwmc4QHgsqLNL5xrWsCkbLvZs00l/jwdWYzM1QKBgQC8
ZJy/LW0iJEVUXh3LIZ4EDsMQCQmDl5ezImnSUX4Sn8kq4H7bm9w4WYaE13+6CyeA
b48kkB83dYiupU80p3z/5RPMXUzvo348yagEV8uJoA4MbM3wyehXewmBfMNa7uJt
jPW2j91Fk9zLAezg5dRAH+kzOOImbkJIQvUShUjWIwKBgQCqf865W504slr7EKw3
sxTltX6gD34cBJoMNhffFzjQumRJC4lsTtMGOn0099BzBVt/JyXe1GphSZMRATmN
/1HPRMk8iaa6IIh5/9nemORvapM3WTwmRvYtSm8TcYX7v5TL/PhQJcz9cfCrMY5N
XxOrfV87pERRsgAg5INRXF066w==
-----END PRIVATE KEY-----`;

const cert = `-----BEGIN CERTIFICATE-----
MIIFyjCCBLKgAwIBAgIQOR3Osrwozsg+3bBAlyE99DANBgkqhkiG9w0BAQsFADCB
jzELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
A1UEBxMHU2FsZm9yZDEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQD
Ey5TZWN0aWdvIFJTQSBEb21haW4gVmFsaWRhdGlvbiBTZWN1cmUgU2VydmVyIENB
MB4XDTIwMDgyNzAwMDAwMFoXDTIxMDgyNzIzNTk1OVowHTEbMBkGA1UEAxMScHJ5
c29mdGdlc3Rpb24uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
3vTHE3MGSnzdbXOKwtOcAQvDXzIrYB8SVGHuNQD0bo6JlnDrMTrv/4tTCewtLvHZ
N87ceZPd2pmwbHlR/ttmfsdR2dmF78aZtaXWMbkGK9PD6lXFj1D8+gJkAICxXNqy
wCNdYgVaLfnneclKnQQvy+QguDsBUylWf20GCHaAOudVxFrpz4FxftaPLAQKgjnt
P/R8wqYsXbIXcJYx9GKMnAwzObS9HArya8wuQWYfBH6jewrUaDLZ5bJAzIgneBUo
dNjEmrEChXYCvGTVyQUbLitORZBPGN5cpGgL1r6OnDQvSS/1M0hpy6eSfiLBPxNX
ed17kg5Rvp+B56od780CSQIDAQABo4ICkTCCAo0wHwYDVR0jBBgwFoAUjYxexFSt
iuF36Zv5mwXhuAGNYeEwHQYDVR0OBBYEFIx2XYcsO0aYJTgfrsiab3NnNrbKMA4G
A1UdDwEB/wQEAwIFoDAMBgNVHRMBAf8EAjAAMB0GA1UdJQQWMBQGCCsGAQUFBwMB
BggrBgEFBQcDAjBJBgNVHSAEQjBAMDQGCysGAQQBsjEBAgIHMCUwIwYIKwYBBQUH
AgEWF2h0dHBzOi8vc2VjdGlnby5jb20vQ1BTMAgGBmeBDAECATCBhAYIKwYBBQUH
AQEEeDB2ME8GCCsGAQUFBzAChkNodHRwOi8vY3J0LnNlY3RpZ28uY29tL1NlY3Rp
Z29SU0FEb21haW5WYWxpZGF0aW9uU2VjdXJlU2VydmVyQ0EuY3J0MCMGCCsGAQUF
BzABhhdodHRwOi8vb2NzcC5zZWN0aWdvLmNvbTA1BgNVHREELjAsghJwcnlzb2Z0
Z2VzdGlvbi5jb22CFnd3dy5wcnlzb2Z0Z2VzdGlvbi5jb20wggEDBgorBgEEAdZ5
AgQCBIH0BIHxAO8AdgB9PvL4j/+IVWgkwsDKnlKJeSvFDngJfy5ql2iZfiLw1wAA
AXQxYVa1AAAEAwBHMEUCIQDaaAAwsNR0e2tfx+jYFWh5/6XRSHh7q2/b7X31Ub+E
gwIgGCtDEam7kjvac8iv8jul9J9nkB6x8Cx6EUehA/MLzoYAdQCUILwejtWNbIhz
H4KLIiwN0dpNXmxPlD1h204vWE2iwgAAAXQxYVekAAAEAwBGMEQCIC434dfJT5VL
daDabPwb3sEOVxAn1LHQWodlUQeXfXbaAiA2E7Tmp6gyflEzWxMiuaIr+bSa8I4C
nY2aXdT9Xp3QEDANBgkqhkiG9w0BAQsFAAOCAQEAjB0Ik1raahEuGQZimeOKYVhL
XRez8u1iTnMCiy/JhWZqFn2qZbKVRrfFyeh35YaDMh/2QuKRnb1N2FZSZKqeewFW
llPKzVN4eLyOk3fjFQc8Z263lcOUZQjAofGnJG3z/zBapl94VF7ntleE5W2e0oWi
UDg7/zAl3ECugjayw3VN50tymzH/UhNpIgmP0196d3Gu2zG7O8PfVND1O+9wPLPc
tJ6hMMGdFzvKTyH7C3r0tHm8yknan4eh42xtDKw2LwKQj0Q8svKQbxsd5pA9An1H
g+Zo0Hp428LZOpn7pTpEDYj9wj61tNsTnlxo25O6UjhE651U0kcxVokQlVtktA==
-----END CERTIFICATE-----`

module.exports = {
    devServer: {
      /**** PRODUCTION ****/
      open: process.platform === 'darwin',
      host: '66.97.47.166',
      port: 80,
      https: false,
      public: '66.97.47.166:80',
      disableHostCheck: true,
      hotOnly: false,

      /**** LOCAL ****/
      //open: process.platform === 'darwin',
      // host: '0.0.0.0',
      // port: 8001,
      // https: false,
      // public: '0.0.0.0:8001',
      // disableHostCheck: true,
      // hotOnly: false,
    },
    publicPath: "/",
    "transpileDependencies": [
      "vuetify"
    ]
  }