import { createRazorpayOrder, verifyRazorpayPayment } from "../../api"; // Import your API functions

export const handleRazorpayPayment = async (token, paymentData) => {
  try {
    // ✅ Step 1: Create an Order in the Backend
    const orderResponse = await createRazorpayOrder(token, paymentData);

    if (!orderResponse.order_id) {
      throw new Error("Failed to create Razorpay order");
    }

    const { order_id, amount, currency } = orderResponse;

    // ✅ Step 2: Load Razorpay SDK
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    razorpayScript.onload = async () => {
        
      const options = {
        key: "rzp_test_i0FyFCvdQZfy1U", // Replace with your Razorpay key
        amount: amount, // Razorpay expects amount in paise
        currency: currency,
        name: "Stay_Easy",
        description: "Booking Payment",
        order_id: order_id,
        handler: async function (response) {
          try {
            // ✅ Step 3: Verify Payment in Backend
            const verifyResponse = await verifyRazorpayPayment(token, response);

            if (verifyResponse.success) {
              alert("Payment successful! Booking confirmed.");
              window.location.reload(); // Refresh or redirect after successful payment
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment failed. Please try again.");
  }
};
