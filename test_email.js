const payload = {
  access_key: "d4aa3e61-20bb-4d65-964f-c84352ce50d5",
  subject: "TEST Email from your AI Agent",
  from_name: "AI Assistant",
  name: "System Test",
  email: "beforenbeyondstaging@gmail.com",
  message: "Hello! This is a test message to verify that Web3Forms is working correctly."
};

fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(text => console.log('Raw Response:', text))
.catch(err => console.error('Error:', err));
