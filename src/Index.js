const Axios = require(`axios`)
const HTTPS = require(`https`)
const FileSystem = require(`fs`)

async function DownloadFile(Directory, URL) {
    const DownloadPromise = new Promise((Resolve) => {
        const Stream = FileSystem.createWriteStream(Directory)

        const Request = HTTPS.request(URL, function(Response) {
            Response.pipe(Stream)
        })

        Stream.on(`finish`, () => {
            Stream.close(Resolve)
        })

        Request.end()
    })
    
    return DownloadPromise
}

async function DownloadAd(Id) {
    const DownloadPromise = new Promise(async (Resolve) => {
        const URL = `https://ads.trafficjunky.net/ad7/get/${Id}`
        
        Axios.get(URL)
            .then(async (Response) => {
                let ImageURL = Response.data.match(/<img id="logo" src="(.*?)" \/>/) || Response.data.match(/<img src="(.*?)" \/>/)
        
                if (ImageURL) {
                    ImageURL = ImageURL[1]

                    console.log(ImageURL)
                    await DownloadFile(`./Ads/${Id}.png`, ImageURL)
                }
                Resolve()
            })
            .catch(() => Resolve())
    })

    return DownloadPromise
}

async function Scrape(StartingId) {
    let Id = StartingId

    while (true) {
        await DownloadAd(Id)
        Id = Id + 1
    }
}

Scrape(10000041)
