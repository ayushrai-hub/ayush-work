// Simple test for Formspree integration
const formData = {
  name: "Test User",
  email: "test@example.com",
  subject: "Test Subject",
  message: "This is a test message from the Formspree integration"
};

console.log("🚀 Testing Formspree Integration...");
console.log("Form data to send:", formData);

fetch("https://formspree.io/f/mandaogr", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
})
.then(response => {
  console.log("Response status:", response.status);
  console.log("Response ok:", response.ok);
  return response.text(); // Get response as text first
})
.then(result => {
  console.log("Raw response:", result);

  try {
    const jsonResult = JSON.parse(result);
    console.log("Parsed JSON response:", jsonResult);
  } catch (e) {
    console.log("Response is not JSON:", result);
  }

  if (result.includes('success') || result.status === 200) {
    console.log("✅ Formspree integration test PASSED");
  } else {
    console.log("❌ Formspree integration test FAILED");
  }
})
.catch(error => {
  console.error("❌ Network error:", error);
});
