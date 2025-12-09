function validateForm() {
  let form = document.forms[0];
  let isValid = true;

  // Clear previous errors
  Array.from(form.querySelectorAll('p.text-red-500')).forEach(p => {
    p.textContent = '';
    p.classList.add('hidden');
  });

  function showError(field, message) {
    const errorP = field.nextElementSibling;
    errorP.textContent = message;
    errorP.classList.remove('hidden');
    isValid = false;
  }

  if (!form.name.value.trim()) showError(form.name, "Name is required.");
  if (!form.contactDetails.value.trim()) showError(form.contactDetails, "Contact Details required.");
  if (!form.address.value.trim()) showError(form.address, "Address is required.");
  
  if (!form.email.value.trim()) showError(form.email, "Email is required.");
  else {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(form.email.value.trim())) showError(form.email, "Enter a valid email.");
  }

  if (!form.gender.value.trim()) showError(form.gender, "Gender is required.");
  if (!form.dob.value.trim()) showError(form.dob, "Date of Birth is required.");
  if (!form.medicalHistory.value.trim()) showError(form.medicalHistory, "Medical History is required.");

  return isValid; // if false, form will not submit
}
