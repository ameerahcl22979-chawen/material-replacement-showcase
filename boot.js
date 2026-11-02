'use strict';
(() => {
 const version='20261102-loading',title=document.getElementById('title');
 let running=false;
 function script(src){return new Promise((resolve,reject)=>{const e=document.createElement('script');let done=false;const timer=setTimeout(()=>finish(new Error('脚本请求超时')),18000);function finish(error){if(done)return;done=true;clearTimeout(timer);e.onload=e.onerror=null;if(error){e.remove();reject(error)}else resolve()}e.src=src;e.onload=()=>finish();e.onerror=()=>finish(new Error('脚本请求失败'));document.body.append(e)})}
 async function start(){
  if(running)return;running=true;const retry=document.getElementById('retryLoad');if(retry)retry.remove();title.textContent='正在载入样本…';
  const slow=setTimeout(()=>title.textContent='网络响应较慢，正在读取样本…',5000);
  try{
   if(!window.BEST_DATA){
    if(typeof window.DecompressionStream==='function'){
     const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
     try{const response=await fetch('data.json.gz?v='+version,{signal:controller.signal});if(!response.ok)throw Error('数据请求失败');const stream=response.body.pipeThrough(new DecompressionStream('gzip'));window.BEST_DATA=await new Response(stream).json()}finally{clearTimeout(timer)}
    }else await script('data.js?v='+version);
   }
   if(!window.BEST_DATA?.items?.length)throw Error('数据不完整');
   await script('display.js?v='+version);clearTimeout(slow);title.removeAttribute('role');
  }catch(error){clearTimeout(slow);title.textContent='样本加载失败，请重试';title.setAttribute('role','status');const button=document.createElement('button');button.id='retryLoad';button.textContent='重新加载';button.onclick=start;title.after(button);console.error('样本加载失败',error)}finally{running=false}
 }
 start();
})();
