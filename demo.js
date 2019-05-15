function main() {
    const ho = {
        "Khanh": "Ngo",
        "Tinh": "Phan"
    }
    // Callback
    // const getFullName = (name, callback) => {
    //     setTimeout(() => {
    //         callback(`${name} ${ho[name]}`)
    //     }, 3000);
    // }

    const getFullName = (name) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`${name} ${ho[name]}`)
                // reject(new Error("Name not found"))
            }, 3000);
        })
    }

    const sayHello = async name => {
        // callback
        // getFullName(name, fullname => {
        //     console.log(`Hello ${fullname}`)
        // })

        // Promise
        // getFullName(name)
        //     .then((fullname) => {
        //         console.log(`Hello ${fullname}`)
        //     })
        //     .catch((err) => {
        //         console.log("ERROR: ", err.message)
        //     })

        // ASYNC AWAIT

        try {
            const fullname = await getFullName(name)
            console.log(`Hello ${fullname}`)
        } catch(err) {
            console.log("ERROR: ", err.message)
        }

    }

    sayHello("Tinh")
}

main()