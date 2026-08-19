Array.prototype.populate = async function() {
    var ArrayOfResults = [];
    var ValidUrl = [];
    
    for(let i = 0; i < this.length; i++) {
        let URLString = this[i];

        if(typeof URLString !== 'string') {
            throw new Error(`Invalid url at index ${i}. Not a string type.`);
        }
        
        // If it doesn't have http, add it (using https is safer for modern web)
        if(!URLString.startsWith('http')) {
            URLString = 'https://' + URLString; 
        }
        
        // The universal check: if there is no dot, assume it needs '.com'
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