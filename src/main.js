const cheerio = require('cheerio');

  export const headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Content-Length': '43',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'PHPSESSID=oml9j795vi9ll0u0m741mntu77; ads_status=true',
    'Host': 'soaper.tv',
    'Origin': 'https://soaper.tv',
    'Referer': 'https://soaper.tv/movie_y5XgREJDbe.html',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

const root = 'https://soaper.live';
const tmdb_key = 'f6f2a9e9b0f5eed81b4cabe35d5a9c1b';

  export  class Soaper {
    constructor(id, ss = null, ep = null ,server=0,proxy) {
        this.id = id;
        this.ss = ss || null;
        this.ep = ep || null;
        this.type_ = ep || ss ? 'tv' : 'movie';
        this.baseTmdb = 'https://api.themoviedb.org';
        this.server = server
        this.proxy = proxy
    }

    async keyWords() {
        const res = await fetch(`${this.baseTmdb}/3/${this.type_}/${this.id}?api_key=${tmdb_key}`);
        const data = await res.json();
        const title = this.type_ === 'movie' ? data.title : data.name;
        return title;
    }

    async getKey(keyWords) {
        const url = `${root}/search.html?keyword=${keyWords}`;
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);
        let key;
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const t = $(element).text();
            if (href && t.trim() === keyWords.trim()) {
                const pattern = /\_\w+\./;
                const matches = href.match(pattern)[0].replace('_', '').replace('.', '');
                key = matches;
            }
        });
        return key;
    }

    keyStractor(encrypted_key){
        const pattern = /\_\w+\./;
            const matches = encrypted_key.match(pattern)[0].replace('_', '').replace('.', '');
            let key = matches;
            return key 
    }

    async getSource(key,isMovie=true) {
        const body = `pass=${key}&param=&extra=&e2=0&server=${this.server}`;
        
        const res = await fetch(`https://soaper.tv/home/index/Get${this.type_ =='movie'?"M":"E"}InfoAjax`, {
            method: 'POST',
            headers: headers,
            body: body
        });

        let data = await res.json();
        data =JSON.parse(data)
        try {
            let m3u8 = encodeURIComponent(`${root}${data.val}`)
            data.val = `${this.proxy}/${m3u8}`;
            data.subs = data.subs.map(obj => ({
                name: obj.name,
                link: `${this.proxy}/${encodeURIComponent(`${root}${obj.path}`)}`
            }));
            return data;
            
        } catch (error) {
            data.val = `${this.proxy}/${encodeURIComponent(data.val)}`;
            return data
        }
    }

    async getStreams(key) {
        if (this.type_ === 'movie') {
            const src = await this.getSource(key);
            return src;
        } else {
            try {
                let res = await fetch(`${root}/tv_${key}.html`);
                let html = await res.text();
                
                const episode_data = this.getEpisodeDataForSeason(html, this.ss);
                console.log(episode_data);
    
                // Corrected: Declare key before using it
                const foundEpisode = episode_data.find(obj => {
                    if (obj.episodeNumber == this.ep) {
                        return obj.episodeUrl;
                    }
                });
    
                if (foundEpisode) {
                    // console.log(`Found episode ${this.ep}: ${foundEpisode.episodeUrl}`);
                    let k = this.keyStractor(foundEpisode.episodeUrl)
                    // console.log(k)
                    console.log(k)
                    const s = await this.getSource(k);
                    return s;
                } else {
                    console.log(`Episode ${this.ep} not found in season.`);
                }
            } catch (error) {
                console.error("Error in getStreams:", error);
                return null; // Handle error gracefully
            }
        }
    }
    
     getEpisodeDataForSeason(htmlString, seasonNumber) {
        const $ = cheerio.load(htmlString);
      
        // Find the div containing the specified season number (improved selector)
        const seasonDiv = $('div').filter(function() {
          const text = $(this).text().trim();
          // Check for both "Season" and the season number to ensure accuracy
          return text.startsWith(`Season${seasonNumber}`);
        });
      
        // Check if the div is found
        if (!seasonDiv.length) {
          return null; // No season div found, return null
        }
      
        // Extract episode data from child anchor tags (a elements)
        const episodeData = seasonDiv.find('a').map(function() {
          const episodeNumber = $(this).text().trim().split('.')[0]; // Extract episode number
          const episodeUrl = $(this).attr('href'); // Get episode URL
      
          return { episodeNumber, episodeUrl };
        }).get();
      
        return episodeData;
      }
      
       

    async main() {
        console.log('hellow ')
        const title = await this.keyWords();
        const key = await this.getKey(title);
        console.log(key);
        const src = await this.getStreams(key);
        // console.log(src)
        return src
        
    }
}

// const s = new Soaper(1399,1,1,1);
// s.main().then(e => console.log(e))


