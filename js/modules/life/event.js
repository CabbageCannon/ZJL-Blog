import { showModalMask,closeModalMask } from "../utils/showModalMask.js";

export function initEvents(){
  addLifeModal();
}

// 点击上传按钮弹出日记上传框
function addLifeModal(){
  const addLifeModal=document.querySelector(".addLifeModal");
  const closeBut=addLifeModal.querySelector(".closeLifeModalButton");
  const addBut=document.querySelector("#life .but.addNewDiary");

  // 给上传按钮绑定点击事件
  addBut.addEventListener('click',(ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    
    showModalMask(addLifeModal);

    closeBut.addEventListener('click',(ev)=>{
      ev.preventDefault();
      ev.stopPropagation();

      closeModalMask();
    })
  })
}

// 日记上传框上传数据
