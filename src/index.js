import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const VAPID_PUBLIC_KEY = "BBGXhrBKp5kzHpAHjZwIRTKvHihvER2qyVYuiUaBALmWvu9qOL1lGztXqr6BDfb2HefNGZegRC0wsRxbokJikLA";

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  if('serviceWorker' in navigator){
    sendSubscription().catch( err => console.log("Error: ", err))
  }
});

async function sendSubscription(){
  // Register sw
  const register = await navigator.serviceWorker.register('sw.js');
  console.log("SW register", register);

  // Subscribe to puch api (automaticly ask to allow notifications)
  const subscriptionObject = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  })
  console.log("Subscribed", subscriptionObject);

  // Send sub obj and get push notification
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionObject),
    headers: {
      'content-type': 'application/json'
    }
  })
  console.log("sub");
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
