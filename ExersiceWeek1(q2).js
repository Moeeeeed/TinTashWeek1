Array.prototype.populate = async function() {
    var ArrayOfResults = [];
    var ValidUrl = [];

    // Normalize each value before starting any network requests.
    for(let i = 0; i < this.length; i++) {
        let URLString = this[i];

        if(typeof URLString !== 'string') {
            throw new Error(`Invalid url at index ${i}. Not a string type.`);
        }
        
        // Add a protocol when the caller only provides a domain name.
        if(!URLString.startsWith('http')) {
            URLString = 'https://' + URLString; 
        }
        
        // Treat a value without a dot as a simple .com domain.
        if (!URLString.includes('.')) {
            URLString = URLString + '.com'; 
        }
        
        ValidUrl.push(URLString);
    }

    ArrayOfResults = ValidUrl.map((url) => {
        return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url} HTTP Status: ${response.status}`);
            } else {
                return response.text();
            }
        });
    });

    // Wait until every website response has been collected.
    ArrayOfResults = await Promise.all(ArrayOfResults);

    for (let i = 0; i < this.length; i++) {
        this[i] = ArrayOfResults[i];
    }

    return this;
}


async function main()
 {
    try {
        const myURLs = [
   "google.com",
   "wikipedia.org",
   "github.com"
   ];


       
        await myURLs.populate();

        console.log("\nSuccess! The URLs have been replaced with the website data.");
        console.log("Here are the results:\n");
        console.log(myURLs);
        
    } 
    catch (error)
     {
        console.error("The program crashed with error:", error.message);
        console.error("Underlying cause:", error.cause);
    }
}

main();