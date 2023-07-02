
const dragZone = document.querySelector('#dragZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.querySelector('.browseBtn');
const progress_section = document.querySelector('.progress_div');
const uploading = document.querySelector('#uploading');
const small_bar = document.querySelector('.small_bar');
const progress_sec = document.querySelector('.progress_sec');
const small_parent = document.querySelector('.small_parent');
//get copy input
const fileURL = document.querySelector('#fileURL');
const sender_data = document.querySelector('#sender_data');
const receiver_data = document.querySelector('#receiver_data');
const email_sendBtn = document.querySelector('#sendBtn');
const toast_btn = document.querySelector('.toast');

// if file is empty so content hide
const percent_sec = document.querySelector('.percent_sec');
const link_div = document.querySelector('.link_section');
const mail_div = document.querySelector('.mail_section');

//get form
const form = document.querySelector('#form');

//file max size
const maxFilesize = 100 * 1024 *1024; //=> means 100mb

dragZone.addEventListener('dragover',(e) => {
    e.preventDefault();
    dragZone.style.background = "#C5ECF2";


    if(!dragZone.classList.contains('dragged')){
    dragZone.classList.add('dragged');

    }
});

    dragZone.addEventListener('dragleave' , () => {
        dragZone.style.background = "white";
     dragZone.classList.remove('dragged')
   
   
    
    });

  dragZone.addEventListener("drop",(e) => {
      e.preventDefault();
      dragZone.classList.remove('dragged');
        const files = e.dataTransfer.files;
        // console.log(files);
        if(files.length){

            fileInput.files = files;
        }
        uploadfile();
   });



browseBtn.addEventListener('click', (e)=> {
    fileInput.click();
    console.log("clicked");
   
});

// Upload file in Xhr (select/browse file)
fileInput.addEventListener('change', ()=> {
  uploadfile();
 
});

// Upload file in Xhr (drag and drop only)

const host = "https://inshareapp-sg.onrender.com/";
const uploadURL = host + "/api/files";
const emailURL = host + "/api/files/send";


 const uploadfile = () => {
  progress_sec.style.display ="block";
  const file = fileInput.files[0];
  console.log(file.size);
  if(file.size > maxFilesize){
   showToast("Can't Upload More then 100MB");
   file.value = '';
   return;
  }

  const formData = new FormData()
  formData.append("myfile" , file);


  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
   if(xhr.readyState === XMLHttpRequest.DONE){
    onUploadSuccess(JSON.parse(xhr.response));
   }

  
   
};


xhr.upload.onprogress = updateProgress;

xhr.upload.onerror = () => {
 showToast(`Error on Upload ${xhr.statusText}`)
 progress_section.style.display = 'none';
}

  xhr.open("POST", uploadURL);
  xhr.send(formData);

 };


 // file updating progress
  const updateProgress = (e) => {
    const progress = Math.round((e.loaded/e.total)* 100);
    progress_section.style.width = `${progress}%`;
    percent_sec.innerText = `${progress}%`;
    small_bar.style.width = `${progress}%`;
    
    if(progress === 100){
    link_div.style.display ="block";
    mail_div.style.display ="block";
    }
 }


 //copy clipboard content
 function copyClipboard(){
  fileURL.select();
  console.log(fileURL.value);
  navigator.clipboard.writeText(fileURL.value);
  showToast("Link Copied");
 
 }

 // show download file link 
 const onUploadSuccess = ({file:url}) => {
  // fileInput = '';
  email_sendBtn.removeAttribute('disabled');
  const fileLink = url;  
  fileURL.value = fileLink;
  console.log('Link',fileLink);
}


// Mail Sending

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("Form Submitted");
const Url = fileURL.value;
   
    const formData = {
      uuid: Url.split('/').splice(-1,1)[0],
      emailTo: form.elements["to-email"].value,
      emailFrom: form.elements["from-email"].value,
    };
// email_sendBtn.setAttribute('disabled', true);
    console.table(formData);
console.log('emailURL',emailURL);



// send mail using API

    fetch(emailURL ,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(formData),
    })
   .then((res => res.json()))
   .then((success) => {

console.log('Response',success);
if(success){
showToast("Email Send Successfully");
}
    progress_sec.style.display = "none";
   
   })


  });

  let timer;
  const showToast = (msg) => {
    toast_btn.style.display = "block";
    toast_btn.innerText = msg;
    toast_btn.style.transform = "translate(-50%,0px)";

    timer = setTimeout(() => {
    toast_btn.style.transform = "translate(-50%,-125px)";
   },2000);

  };