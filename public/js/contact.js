// ===== CONTACT PAGE JAVASCRIPT =====

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');
const submitIcon = document.getElementById('submitIcon');

// ---- Field Validators ----
function validateName() {
  const val = document.getElementById('name').value.trim();
  const err = document.getElementById('nameError');
  const input = document.getElementById('name');
  if (!val) {
    err.textContent = 'Name is required.';
    input.classList.add('error');
    return false;
  }
  err.textContent = '';
  input.classList.remove('error');
  return true;
}

function validateEmail() {
  const val = document.getElementById('email').value.trim();
  const err = document.getElementById('emailError');
  const input = document.getElementById('email');
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    err.textContent = 'Email is required.';
    input.classList.add('error');
    return false;
  }
  if (!regex.test(val)) {
    err.textContent = 'Please enter a valid email.';
    input.classList.add('error');
    return false;
  }
  err.textContent = '';
  input.classList.remove('error');
  return true;
}

function validateMessage() {
  const val = document.getElementById('message').value.trim();
  const err = document.getElementById('messageError');
  const input = document.getElementById('message');
  if (!val) {
    err.textContent = 'Please enter a message.';
    input.classList.add('error');
    return false;
  }
  err.textContent = '';
  input.classList.remove('error');
  return true;
}

// Live validation
document.getElementById('name')?.addEventListener('blur', validateName);
document.getElementById('email')?.addEventListener('blur', validateEmail);
document.getElementById('message')?.addEventListener('blur', validateMessage);

// ---- Form Submit ----
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isValid = validateName() & validateEmail() & validateMessage();
  if (!isValid) return;

  // Loading state
  submitBtn.disabled = true;
  submitText.textContent = 'Sending...';
  submitSpinner.style.display = 'inline';
  submitIcon.style.display = 'none';

  try {
    const payload = {
      access_key: "d4aa3e61-20bb-4d65-964f-c84352ce50d5",
      subject: "New Lead from Before n Beyond Website",
      from_name: "Before n Beyond Website",
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      propertyType: document.getElementById('propertyType').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim()
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.status === 200) {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    submitText.textContent = 'Send Message';
    submitSpinner.style.display = 'none';
    submitIcon.style.display = 'inline';
    submitBtn.disabled = false;

    // Show error toast
    showToast(err.message || 'Something went wrong. Please try again.', 'error');
  }
});

// ---- Toast Notification ----
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position:fixed; bottom:32px; right:32px; z-index:9999;
    background:${type === 'error' ? '#e05252' : '#2A2A2A'};
    color:#fff; padding:16px 24px; border-radius:8px;
    font-size:0.9rem; max-width:360px;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
    animation:slideIn 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  const s = document.createElement('style');
  s.textContent = `@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(s);

  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}
