const modalMask=document.querySelector(".modalMask");

let currentModal=null;

export function showModalMask(modal){
  currentModal=modal;

  modalMask.style.display="block";
  currentModal.style.display="block";
}

export function closeModalMask(){
  if(!currentModal)return;

  modalMask.style.display="none";
  currentModal.style.display="none";

  currentModal=null;
}

modalMask.addEventListener('click',(ev)=>{
  ev.preventDefault();
  ev.stopPropagation();
  closeModalMask();
})