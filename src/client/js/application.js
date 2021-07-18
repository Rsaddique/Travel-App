
let form = document.querySelector('.Departure').value


document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log("e.target.elements",e.target.elements.item(0).value)
    if(e.target.elements.item(1).value.length>0 && e.target.elements.item(0).value){

            let obj = {}
            let elements = e.target.elements
            for (let i = 0; i < elements.length; i++) {
                let item = elements.item(i)   
                obj[item.name] = item.value
            }
            
          // fetch city image
            fetch(`http://localhost:3000/image?city=${obj.sectionbar}`).then(res=>{
                if(res.ok){
                    return res.json()
                }
                else {
                    return Promise.reject(res);
                }
            }).then(res=>{
                // get the city image from the response
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    document.getElementById('image').innerHTML=`
                    <img width="200" height="200" style="object-file:cover;margin-top:20px" src=${element.previewURL} />    
                    `
                    
                }
            })
            .catch(err=>{
                console.log(err)
            })
           // fetch user desired city
            fetch(`http://localhost:3000/city?city=${obj.sectionbar}`).then(res=>{
                if(res.ok){
                    return res.json()
                }
                else {
                    return Promise.reject(res);
                }
            }).then(result=>{
                console.log(result)
                // show city api response result in dom
                document.querySelector('#data').innerHTML=`
                <div style="color:white;margin-top:50px">
                    <p>Country Name : ${result.countryName}</p>
                    <p>Country Code : ${result.countryCode}</p>
                    <p>latitude : ${result.lat}</p>
                    <p>longitude : ${result.lng}</p>
                </div>
                `
                let data = result
                // fetch current weather from server
                fetch(`http://localhost:3000/currentWeather?lat=${data.lat}&lon=${data.lng}`)
                .then(resp=>{
                    if(resp.ok){
                        return resp.json()
                    }
                    else {
                        return Promise.reject(resp);
                    }
                })
                .then(result2=>{
                    console.log(result2)
            //  show the weather details in dom
                    document.querySelector('#temp').innerHTML=`
                    <div style="color:white;margin-top:50px">
                        <p>Sun Set : ${result2.sunset}</p>
                        <p>Temperature : ${result2.temp}</p>
                        <p>Time Zone : ${result2.timezone}</p>
                        <p>Wind Speed : ${result2.wind_spd}</p>
                    </div>`
                    document.querySelector('#had').style.display = "block"
                    document.querySelector('#had').style.display = "block"
                    document.querySelector('#had').innerHTML = `
                    <h1  >
                        Departure Date
                    </h1>    
                    <h1  >
                        ${e.target.elements.item(1).value}
                    </h1>    
                    `
                    console.log(":HEllo",e.target.elements.item(1).value)
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
            
    }else{
        alert("please fill in required fields")
    }

})