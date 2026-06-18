const rules = {
  firstName:  v => v.trim().length > 0,
  lastName:   v => v.trim().length > 0,
  email:      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone:      v => /^\d{10}$/.test(v.trim()),
  department: v => v !== '',
  jobTitle:   v => v.trim().length > 0,
  joinDate:   v => v !== '',
};

function validate(id) {
  const el = document.getElementById(id);
  const err = document.getElementById(id + '-err');
  const ok = rules[id](el.value);
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

async function submitForm() {
  const fields = Object.keys(rules);
  const allValid = fields.map(validate).every(Boolean);

  if (!allValid) {
    showError('Please fix the errors above before submitting.');
    return;
  }

  const data = {
    firstName:  document.getElementById('firstName').value.trim(),
    lastName:   document.getElementById('lastName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    phone:      document.getElementById('phone').value.trim(),
    department: document.getElementById('department').value,
    jobTitle:   document.getElementById('jobTitle').value.trim(),
    joinDate:   document.getElementById('joinDate').value,
  };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess(data.firstName + ' ' + data.lastName + ' registered successfully!');
      document.getElementById('registrationForm').reset();
      fields.forEach(id => {
        document.getElementById(id).classList.remove('valid', 'error');
        document.getElementById(id + '-err').classList.remove('show');
      });
    } else {
      showError(result.message || 'Something went wrong. Try again.');
    }
  } catch (err) {
    showError('Cannot connect to server. Make sure the backend is running.');
  }
}

function showSuccess(msg) {
  const s = document.getElementById('successMsg');
  const e = document.getElementById('errorMsg');
  s.textContent = msg;
  s.style.display = 'block';
  e.style.display = 'none';
  setTimeout(() => s.style.display = 'none', 5000);
}

function showError(msg) {
  const s = document.getElementById('successMsg');
  const e = document.getElementById('errorMsg');
  e.textContent = msg;
  e.style.display = 'block';
  s.style.display = 'none';
  setTimeout(() => e.style.display = 'none', 5000);
}