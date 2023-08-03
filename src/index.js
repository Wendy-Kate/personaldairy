function exist()
{
  if(localStorage.getItem("diary")==null)
  {var existingDiary = [];}
  else
  {var existingDiary = JSON.parse(localStorage.getItem("diary"));}
  return existingDiary;
}

function show(){
  let existingc = exist();
  let ss = document.getElementById("show")
  ss.innerHTML = ""
  for (var j = existingc.length - 1; j >= 0; j--){
    var ddd = document.createElement("div");
    ddd.setAttribute("class", "card");

    let ti = document.createElement("i")
    ti.setAttribute("class", "bi bi-trash");
    ti.style.display ="none"
    ti.name = "selected"
    ti.addEventListener("click", event=>{
      let r = window.confirm("Are you sure you want to delete this diary?")
      if (r==true)
      {
        deletediary(j)
      }
    })

    var nowd = document.createElement("p");
    nowd.innerText = existingc[j].nowdate;
    var www = document.createElement("p");
    www.innerText = existingc[j].weather;
    var img = document.createElement("img");
    var imgfile = "../img/" + existingc[j].filePath;
    img.setAttribute("src", imgfile);

    var dbody = document.createElement("div");
    dbody.setAttribute("class", "card-body");
    var content = document.createElement("p");
    content.setAttribute("class","card-text")
    content.innerText = existingc[j].content; 

    let location = document.createElement("p")
    location.innerHTML = existingc[j].location
    
    dbody.appendChild(nowd);
    dbody.appendChild(www);
    dbody.appendChild(content);
    dbody.appendChild(location);
    dbody.appendChild(ti);
    ddd.appendChild(img);
    ddd.appendChild(dbody);
    ss.appendChild(ddd);
  };
}

const clear = () => {
  localStorage.clear();
  show();
}

function edit(){
  const cardlist = document.getElementsByClassName("bi-trash")
  for (var i = 0; i < cardlist.length; i++){
    cardlist[i].setAttribute("style", "display:contents");
  }
}

function disappear(){
  const cardlist = document.getElementsByClassName("bi-trash")
  for (var i = 0; i < cardlist.length; i++){
    cardlist[i].setAttribute("style", "display:none");
  }
}

function deletediary(value){
  let existingc = exist();
  console.info(value);
  existingc.splice(value, 1); 
  localStorage.setItem("diary", JSON.stringify(existingc));
  show();
}

document.querySelector("#clean").addEventListener("click", event=>{
  clear()
})

document.querySelector("#edit").addEventListener("click", event=>{
  const cardlist = document.getElementsByClassName("bi-trash")[0]
  if(cardlist.style.display =="none")
  {
    edit()
  }
  else{
    disappear()
    }
})


window.addEventListener("DOMContentLoaded", event=>{
  show();
})
export{show}