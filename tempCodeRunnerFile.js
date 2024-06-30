const cheerio = require('cheerio');

function getEpisodeNamesForSeason2(htmlString, seasonNumber ,episode ) {
  const $ = cheerio.load(htmlString);

  // Find the parent div containing the specified season number
  const seasonDiv = $('div').filter(function() {
    const text = $(this).text().trim();
    return text.startsWith(`Season${seasonNumber}`);
  });

  // Check if the div is found
  if (!seasonDiv.length) {
    return []; // No season div found, return empty array
  }

  // Extract episode data from child anchor tags (a elements)
  const episodeData = seasonDiv.find('a').map(function() {
    const episodeNumber = $(this).text().trim().split('.')[0]; // Extract episode number
    const episodeUrl = $(this).attr('href'); // Get episode URL

    return { episodeNumber, episodeUrl };
  }).get();

  return episodeData;
}

// Example usage
const htmlString = `<div class="alert alert-info-ex col-sm-12"><p class="col-sm-12 col-lg-12"></p><h4>Season2 : </h4><p></p><div class="col-sm-12 col-lg-12"><div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_6n8gOOVgXy.html">10.Valar Morghulis</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_jaZGArVk9J.html">9.Blackwater</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_qPnG6ryG7v.html">8.The Prince of Winterfell</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_l5KDq9xDp1.html">7.A Man Without Honor</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_Y4vGPK2g31.html">6.The Old Gods and the New</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_PqLDoWWD6w.html">5.The Ghost of Harrenhal</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_Xj4D4roGbO.html">4.Garden of Bones</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_4RaDeJZgBj.html">3.What Is Dead May Never Die</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_AZRG0r7DjP.html">2.The Night Lands</a></div> <div class="col-sm-12 col-md-6 col-lg-4 myp1"><a href="/episode_K9EkNOyD4n.html">1.The North Remembers</a></div> </div></div>`; // Replace with your HTML content
const episodeData = getEpisodeNamesForSeason2(htmlString, 2,1);

console.log(episodeData); // Array of objects containing episode number and URL

// Example usage of episodeData
episodeData.forEach(episode => {
  console.log(`Episode ${episode.episodeNumber}: ${episode.episodeUrl}`);
});
