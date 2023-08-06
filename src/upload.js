
var Ckey = "348735";//record current and default city code
var WeatherText = "";//record current weather text
var Nlocation = "United States, Massachusetts, Boston"//record current and default address

function bind(){
	
    document.getElementById("imgSelf").addEventListener("click",function(){
        document.getElementById("imgUpload").click();
    });
}

document.getElementById("imgUpload").addEventListener("change",function() {
	var obj = document.getElementById("imgUpload");
	var oFReader = new FileReader();
	oFReader.readAsDataURL(obj.files[0]);
	oFReader.onload = function(oFREvent) {
		var style=document.createElement('style');
		var change=document.createTextNode('#img_div:before{content:none;} #img_div:after{content:none;}')
		style.appendChild(change);
		document.body.appendChild(style);
		
		var base64 = oFREvent.target.result;
		document.getElementById("imgSelf").setAttribute("src", base64);
	}
})

function exist()
{
  if(localStorage.getItem("diary")==null)
  {var existingDiary = [];}
  else
  {var existingDiary = JSON.parse(localStorage.getItem("diary"));}
  return existingDiary;
}

async function handleSubmit() {
	try{
		var fileInput = document.getElementById('imgUpload');
		var file = fileInput.files[0];
		let fileName = saveImageLocally(file);
		const inputDiv = document.getElementById('inputc');
		const content = inputDiv.textContent.trim();
		await showweather()
		const www = "Weather: "+WeatherText
		const nowdate = getdate()
	//const location = getlocation()
	saveData(fileName,content,www,nowdate)
	}
	catch{
		console.log("submit error")
	}
}

function saveImageLocally(file) {
	var formData = new FormData();
	var timestamp = Date.now();
	var fileName = 'image_' + timestamp + '.jpg';

	formData.append('image', file, fileName);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '../src/upload.php', true);
	xhr.onload = function() {
		if (xhr.status === 200) {
		alert('Image uploaded successfully!');
		} else {
		alert('Error uploading image. Please try again later.');
		}
	};
	xhr.send(formData);
	return fileName
}

function getemoji(){
	const emojiUrl = "https://emojihub.yurace.pro/api/all"
	const emojilist = document.getElementById("eee");  
    axios.get(emojiUrl)
        .then(response => {
			const emojis = response.data;
			emojis.forEach((emoji) => {
				const emojiUnicode = emoji.unicode[0].slice(2);
				const emojiCharacter = String.fromCodePoint(parseInt(emojiUnicode, 16))
				const emojiElement = document.createElement('span');
				emojiElement.innerText = emojiCharacter;

				const emojia = document.createElement('a');
				emojia.addEventListener("click",event=>{addemoji(emojiCharacter)})
				emojia.href="#"
				emojia.appendChild(emojiElement)
				emojilist.appendChild(emojia);
			});
        })
        .catch(error => {
        console.error("Error fetching emojis list:", error);
        });
}

function addemoji(emojiCharacter){
	const emojiElement = document.createElement('span');
	emojiElement.innerText = emojiCharacter;
	const inputDiv = document.getElementById('inputc');
	inputDiv.appendChild(emojiElement)
}

function getlocationkey(city="boston"){
	const apikey = "33ggoeHslxVF4gCuyAR06hOQ2s4jzC3e"
	let locationurl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey="
	const targeturl = locationurl+apikey +"&q=" + city
	axios.get(targeturl)
		.then(response =>{
			Ckey = response.data[0].Key		
			console.log("Ckey is: "+Ckey)
		})
		.catch(error => {
            console.error("Error fetching location data:", error);
            return null; 
        });
}

function getCountry(){
	const apikey = "OGVubXNOMzlrTWlTVFZjc1ZJOWZmZ21WdDA2bXZHNkFHQ1ljbnFMNg=="
	const headers = {
		"X-CSCAPI-KEY": apikey
	};
	const requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	const countrySelector = document.getElementById("country")
	axios.get("https://api.countrystatecity.in/v1/countries", requestOptions)
        .then(response => {
			let countrys = response.data;
			countrys.forEach((country) => {
            const li = document.createElement("li");
			const aaa = document.createElement("a");
			aaa.href="#"
			aaa.setAttribute("class","dropdown-item")
            aaa.textContent = country.name;
			aaa.addEventListener("click", event=>{
				getstate(country.iso2)
				const cp = document.getElementById("location_cou")
				const cs = document.getElementById("location_sta")
				const ci = document.getElementById("location_city")
				cs.innerText = ""
				ci.innerText = ""
				cp.innerText = country.name
			})
			li.appendChild(aaa)
            countrySelector.appendChild(li);
        });
        })
        .catch(error => {
        console.error("Error fetching countrys:", error);
        });
}

function getstate(countryiso2){
	const apikey = "OGVubXNOMzlrTWlTVFZjc1ZJOWZmZ21WdDA2bXZHNkFHQ1ljbnFMNg=="
	const headers = {
		"X-CSCAPI-KEY": apikey
	};
	const requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	const surl1 = "https://api.countrystatecity.in/v1/countries/"+countryiso2+"/states"
	const stateSelector = document.getElementById("states")
	stateSelector.innerHTML = ""
	axios.get(surl1, requestOptions)
        .then(response => {
			let states = response.data;
			states.forEach((state) => {
				const li = document.createElement("li");
				const aaa = document.createElement("a");
				aaa.href="#"
				aaa.setAttribute("class","dropdown-item")
				aaa.textContent = state.name;
				aaa.addEventListener("click", event=>{
					getcity(countryiso2, state.iso2)
					const cp = document.getElementById("location_sta")
					cp.innerText = state.name
					const ci = document.getElementById("location_city")
					ci.innerText = ""
				})
				li.appendChild(aaa)
				stateSelector.appendChild(li);
        	});
        })
        .catch(error => {
        console.error("Error fetching countrys:", error);
        });
}

function getcity(countryiso2,stateiso2){
	const apikey = "OGVubXNOMzlrTWlTVFZjc1ZJOWZmZ21WdDA2bXZHNkFHQ1ljbnFMNg=="
	const headers = {
		"X-CSCAPI-KEY": apikey
	};
	const requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	const surl1 = "https://api.countrystatecity.in/v1/countries/"+countryiso2+"/states/"+stateiso2+"/cities"
	const citySelector = document.getElementById("city")
	citySelector.innerHTML = ""
	axios.get(surl1, requestOptions)
        .then(response => {
			let citys = response.data;
			citys.forEach((city) => {
				const li = document.createElement("li");
				const aaa = document.createElement("a");
				aaa.href="#"
				aaa.setAttribute("class","dropdown-item")
				aaa.textContent = city.name;
				aaa.addEventListener("click", event=>{
					const cp = document.getElementById("location_city")
					cp.innerText = city.name
				})
				li.appendChild(aaa)
				citySelector.appendChild(li);
        	});
        })
        .catch(error => {
        console.error("Error fetching countrys:", error);
        });
}

function getlocation(){
	const cp = document.getElementById("location_cou")
	const cs = document.getElementById("location_sta")
	const ci = document.getElementById("location_city")
	Nlocation = cp.innerText+", " + cs.innerText+", "+ci.innerText
}

async function showweather(){
	const apikey = "33ggoeHslxVF4gCuyAR06hOQ2s4jzC3e"
	let weatherurl = "http://dataservice.accuweather.com/currentconditions/v1/"
	const targeturl = weatherurl + Ckey +"?apikey=" + apikey
	try {
		const response = await axios.get(targeturl);
		WeatherText = response.data[0].WeatherText;
	  } catch (error) {
		console.error("Error fetching weather data:", error);
	}
}

function getdate(){
	var date = new Date();
	var nowMonth = date.getMonth() + 1;
	var strDate = date.getDate();
	var seperator = "-";
	if (nowMonth >= 1 && nowMonth <= 9) {
		nowMonth = "0" + nowMonth;}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
	return nowDate;
}

class Diarydata{
	constructor(filePath, content,weather,nowdate){
		this.filePath = filePath;
		this.content = content;
		this.location = Nlocation;
		this.weather = weather;
		this.nowdate = nowdate;
	}
}


function saveData(filePath, content,weather,nowdate) {
	const data = {
	  filePath: filePath,
	  content: content,
	  location: Nlocation,
	  weather: weather,
	  nowdate:nowdate
	};
	let existingDiary = exist()
	existingDiary.push(data)
	localStorage.setItem('diary', JSON.stringify(existingDiary));
}
  
const submitButton = document.getElementById('a_submit');
submitButton.addEventListener('click', async event=>{
	await handleSubmit()
	//window.location.href = "index.html"
});

document.querySelector("#a_emoji").addEventListener("click", event=>{
	document.getElementById("eee").style.display = "block";
	document.getElementById("lll").style.display = "none";
	getemoji()
	
  })

document.querySelector("#a_loc").addEventListener("click", event=>{
	document.getElementById("lll").style.display = "block";
	document.getElementById("eee").style.display = "none";
	getCountry()
})

document.querySelector("#locsubmit").addEventListener("click", event=>{
	const spanElement = document.getElementById("location_city")
	if (spanElement.textContent.trim() === '') {
		alert("Incomplete address");
	  } else {
		getlocation();
		alert("The new address has been confirmed");
	  }
	
})

export{bind}
