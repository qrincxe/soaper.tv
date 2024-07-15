let url = 'https://soaper.tv/dev/Apis/tw_m3u8?key=NKAZzKVmMeC12eRWKq3yUomewnJjv7sdj2vayy3lH1LK2YbZdruaQN2Oy1BZUpK6YpXLYAiZLqna4EaKu648L5WL6Ofanqeaa6AVTOBmzXvwa3C6Vy67AV58.m3u8'

const line  = '#EXT-X-MEDIA:NAME="Audio",TYPE=AUDIO,GROUP-ID="audio-32000",AUTOSELECT=YES,URI="/dev/Apis/tw_m3u8?key=XndLAnmOb5cxXOpwn2BEHxZP9VaR65f69a7yewR9CRQMleEylNs9B4N4NP6xtXNYeydzq7s6yAdzj5yZHnRyXXB4zWt03wOP0dYZh9n81jNwV5HjAd6jQyXpf4E7PzexRwUzZZNy1x2oTMQzaZA8jeU5Y4znNaKNfwpaWvE2qKtQdMQrYOO9ULr9jNWYZwUJwWxl37d0caPZmydVOWcW3jPWopBXCd0ar7b9wMS5azQVrWQ4Clvrel8ywLf4EwnwBpoETKnE2Q407rUY61L2zdEotz2wMyBKd6tRnqarRaqVC2R9r8VWp6CZW1p2QaA3fyqqeRx731hKAxKJPvjbHO0wQbL8P7TyRKXz5qYXuNjWzv1nzy.m3u8"'
const u = new URL(url)

console.log(line.match(/"\/[\w/?=.]+"/))